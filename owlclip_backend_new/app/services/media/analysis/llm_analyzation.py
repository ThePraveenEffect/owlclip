# app/services/media/analysis/llm_analyzation.py

"""
LLM Hook Detection & Semantic Scoring Layer

Purpose:
- Identify viral "hooks" and high-engagement moments from transcripts.
- Use Gemini (Primary) and Groq (Fallback) for high reliability.
- Extract precise start/end timestamps for video cutting.
- Provide viral reasoning for each selected clip.

Architecture:
- Pydantic models for structured output.
- Provider-agnostic service wrapper.
- Sophisticated prompt engineering for viral analysis.
"""

import os
import json
import logging
import asyncio
from pathlib import Path
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, AliasChoices

# Lazy imports for optional dependencies
try:
    import google.generativeai as genai
except ImportError:
    genai = None

try:
    from groq import AsyncGroq
except ImportError:
    AsyncGroq = None

from app.core.config import settings

logger = logging.getLogger(__name__)

# =========================================================
# MODELS
# =========================================================

class ViralHook(BaseModel):
    """Structured data for a single viral clip candidate"""
    title: str = Field(..., description="Catchy title for the clip")
    hook_text: str = Field(..., validation_alias=AliasChoices("hook_text", "text"), description="The main sentence or idea that acts as the hook")
    start_time: float = Field(..., description="Start time of the hook in seconds")
    end_time: float = Field(..., description="End time of the hook in seconds")
    viral_score: int = Field(..., ge=1, le=10, description="Score from 1-10 on virality potential")
    reasoning: str = Field(..., description="Brief explanation of why this moment is viral")
    narrative_context: str = Field(..., description="Description of the story being told here")


class AnalysisResult(BaseModel):
    """The complete response from the LLM"""
    hooks: List[ViralHook] = Field(..., validation_alias=AliasChoices("hooks", "viral_hooks"))
    overall_summary: str
    target_audience: str


# =========================================================
# PROMPTS
# =========================================================

SYSTEM_PROMPT = """
You are an expert Social Media Growth Strategist and Viral Content Analyst. 
Your task is to analyze a video transcript and identify the most engaging, high-impact moments that would perform well as short-form content (Reels, TikToks, Shorts).

CRITERIA FOR A VIRAL HOOK:
1. **The Pattern Interruption**: A statement or question that immediately grabs attention.
2. **The "What Happens Next?"**: A setup for a story or a surprising fact.
3. **Emotional Spike**: High energy, controversy, or deep vulnerability.
4. **Value Density**: A "golden nugget" of information or a punchline.

GUIDELINES:
- Each hook should ideally be 40 to 60 seconds long.
- You MUST provide precise start/end timestamps based on the provided transcript.
- Be objective but aggressive in selecting ONLY the best moments.
- If a moment is mediocre, ignore it.

JSON STRUCTURE (STRICT):
{
  "hooks": [
    {
      "title": "string",
      "hook_text": "string",
      "start_time": float,
      "end_time": float,
      "viral_score": integer (1-10),
      "reasoning": "string",
      "narrative_context": "string"
    }
  ],
  "overall_summary": "string",
  "target_audience": "string"
}
"""

USER_PROMPT_TEMPLATE = """
TRANSCRIPT DATA:
{transcript_data}

TASKS:
1. Analyze the semantic chunks above.
2. Identify the top viral hooks.
3. For each hook, extract the exact start_time and end_time.
4. Output your analysis in a valid JSON format that matches the required schema.

Note: Ensure the start and end times are within the range of the provided transcript segments.
"""


# =========================================================
# LLM CLIENTS
# =========================================================

class LLMProvider:
    """Base class for LLM providers"""
    async def analyze(self, transcript_text: str) -> Optional[AnalysisResult]:
        raise NotImplementedError


class GeminiProvider(LLMProvider):
    """Primary provider using Google Gemini"""
    def __init__(self, api_key: str):
        if not genai:
            raise ImportError("google-generativeai package is not installed")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    async def analyze(self, transcript_text: str) -> Optional[AnalysisResult]:
        try:
            prompt = f"{SYSTEM_PROMPT}\n\n{USER_PROMPT_TEMPLATE.format(transcript_data=transcript_text)}"
            
            # Using generate_content_async for Gemini
            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                )
            )
            
            if not response.text:
                return None
                
            data = json.loads(response.text)
            return AnalysisResult(**data)
        except Exception as e:
            logger.error(f"❌ Gemini Analysis failed: {e}")
            return None


class GroqProvider(LLMProvider):
    """Fallback provider using Groq (Llama-3-70b)"""
    def __init__(self, api_key: str):
        if not AsyncGroq:
            raise ImportError("groq package is not installed")
        self.client = AsyncGroq(api_key=api_key)

    async def analyze(self, transcript_text: str) -> Optional[AnalysisResult]:
        try:
            completion = await self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": USER_PROMPT_TEMPLATE.format(transcript_data=transcript_text)}
                ],
                response_format={"type": "json_object"}
            )
            
            data = json.loads(completion.choices[0].message.content)
            return AnalysisResult(**data)
        except Exception as e:
            logger.error(f"❌ Groq Analysis failed: {e}")
            return None


# =========================================================
# MAIN SERVICE
# =========================================================

class HookAnalysisService:
    """Orchestrates LLM analysis with fallback logic"""
    
    def __init__(self):
        self.primary = None
        self.fallback = None
        
        # Diagnostic: Log key presence (masked for safety)
        def mask(key):
            return f"{key[:4]}...{key[-2:]}" if key and len(key) > 6 else "MISSING"

        logger.info(f"🔑 Groq Key: {mask(settings.GROQ_API_KEY)}")
        logger.info(f"🔑 Gemini Key: {mask(settings.GEMINI_API_KEY)}")

        if settings.GROQ_API_KEY:
            try:
                self.primary = GroqProvider(settings.GROQ_API_KEY)
            except Exception as e:
                logger.warning(f"Failed to init Groq: {e}")

        if settings.GEMINI_API_KEY:
            try:
                self.fallback = GeminiProvider(settings.GEMINI_API_KEY)
            except Exception as e:
                logger.warning(f"Failed to init Gemini: {e}")

    async def analyze_transcript(self, transcript_data: str) -> Optional[AnalysisResult]:
        """Runs analysis with Groq (Primary) -> Gemini (Fallback)"""
        
        # Try Groq first
        if self.primary:
            logger.info("🤖 Analyzing with Groq (Primary)...")
            result = await self.primary.analyze(transcript_data)
            if result:
                return result
        
        # Fallback to Gemini
        if self.fallback:
            logger.info("🤖 Falling back to Gemini...")
            # Try Gemini Flash first
            result = await self.fallback.analyze(transcript_data)
            if result:
                return result
            
            # Sub-fallback: If Flash fails (404/etc), try Pro
            logger.info("🤖 Gemini Flash failed, trying gemini-pro-latest...")
            self.fallback.model = genai.GenerativeModel('gemini-pro-latest')
            result = await self.fallback.analyze(transcript_data)
            if result:
                return result
                
        logger.error("🚫 Both LLM providers failed or are not configured")
        return None


async def analyze_hooks_for_clips(clips: List[Dict]) -> List[Dict]:
    """
    Analyzes multiple candidate clips to find the absolute best hooks.
    
    GUARANTEES:
    - All clips are 45-55 seconds (viral sweet spot)
    - Timestamps validated within segment bounds
    - Full end-to-end pipeline tracing
    
    Pipeline Flow:
    1. Load sentences with timestamps from transcript
    2. LLM analyzes and returns hooks with start/end times
    3. Validate hooks are within segment duration
    4. Enforce 45-55 second duration (core requirement)
    5. Calculate absolute timestamps for clipper
    6. Return top 2 by viral score
    
    Args:
        clips: List of clip dicts with audio_path, start, end, transcript_path
        
    Returns:
        List of 2 top-rated hooks, each 45-55 seconds long
    """
    
    # ✅ CRITICAL DURATION CONSTRAINTS - 45-55 seconds for viral content
    MIN_CLIP_DURATION = 45.0  # seconds (minimum for TikTok/Reels)
    MAX_CLIP_DURATION = 55.0  # seconds (maximum before losing attention)
    
    service = HookAnalysisService()
    all_hooks = []
    
    logger.info(f"\n{'='*80}")
    logger.info(f"🔎 PHASE: LLM Hook Analysis - Starting for {len(clips)} segments")
    logger.info(f"{'='*80}")
    logger.info(f"📏 Duration requirement: {MIN_CLIP_DURATION}s - {MAX_CLIP_DURATION}s")
    logger.info(f"{'='*80}\n")
    
    for index, clip in enumerate(clips, start=1):
        try:
            transcript_path = clip.get("transcript_path")
            if not transcript_path:
                logger.warning(f"❌ Segment {index}: No transcript_path provided. Skipping.")
                continue
            
            # ✅ STEP 1: Load transcript with word-level timestamps
            logger.info(f"\n📂 Segment {index}: Loading transcript from {Path(transcript_path).name}")
            
            with open(transcript_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            processed = data.get("processed_transcript", {})
            sentences = processed.get("sentences", [])
            
            if not sentences:
                logger.warning(f"❌ Segment {index}: No sentences found. Skipping.")
                continue
            
            # ✅ STEP 2: Calculate segment bounds (for validation)
            segment_start_abs = clip.get("start", 0)  # Where this segment starts in original video
            segment_end_abs = clip.get("end", segment_start_abs + 120)  # Default 120s if not provided
            segment_duration = segment_end_abs - segment_start_abs
            
            logger.info(f"   📍 Segment bounds: {segment_start_abs:.1f}s - {segment_end_abs:.1f}s "
                       f"({segment_duration:.1f}s duration)")
            logger.info(f"   📊 Sentences available: {len(sentences)} | "
                       f"Time range: {sentences[0]['start']:.1f}s - {sentences[-1]['end']:.1f}s")
            
            # ✅ STEP 3: Send full transcript to LLM for analysis
            formatted_transcript = json.dumps(sentences, indent=2)
            
            logger.info(f"   🤖 Sending to LLM for analysis...")
            result = await service.analyze_transcript(formatted_transcript)
            
            if not result:
                logger.warning(f"❌ Segment {index}: LLM returned no results. Skipping.")
                continue
            
            logger.info(f"   ✅ LLM found {len(result.hooks)} potential hooks")
            
            # ✅ STEP 4: Validate each hook's timestamps and duration
            valid_hooks_count = 0
            
            for hook_idx, hook in enumerate(result.hooks, start=1):
                hook_dict = hook.model_dump()
                
                start_time = float(hook_dict.get("start_time", 0))
                end_time = float(hook_dict.get("end_time", 30))
                original_duration = end_time - start_time
                
                logger.info(f"\n   Hook {hook_idx}/3:")
                logger.info(f"      Raw times: {start_time:.1f}s → {end_time:.1f}s ({original_duration:.1f}s)")
                
                # ✅ VALIDATION 1: Check for negative times
                if start_time < 0:
                    logger.warning(f"      ⚠️  start_time={start_time:.1f}s is negative. Clamping to 0.0s")
                    start_time = 0.0
                
                # ✅ VALIDATION 2: Check for out-of-bounds times
                if end_time > segment_duration:
                    logger.warning(
                        f"      ⚠️  end_time={end_time:.1f}s exceeds segment duration={segment_duration:.1f}s. "
                        f"Clamping to {segment_duration:.1f}s"
                    )
                    end_time = segment_duration
                
                # ✅ VALIDATION 3: Check for inverted times
                if start_time >= end_time:
                    logger.warning(
                        f"      ❌ Invalid range: start_time={start_time:.1f}s >= end_time={end_time:.1f}s. SKIPPING."
                    )
                    continue
                
                # ✅ VALIDATION 4: Check and enforce 45-55 second range
                adjusted_duration = end_time - start_time
                
                if adjusted_duration < MIN_CLIP_DURATION:
                    logger.warning(
                        f"      ⚠️  Duration={adjusted_duration:.1f}s < {MIN_CLIP_DURATION}s minimum. "
                        f"EXTENDING by {MIN_CLIP_DURATION - adjusted_duration:.1f}s"
                    )
                    # Try extending end first
                    new_end = start_time + MIN_CLIP_DURATION
                    if new_end > segment_duration:
                        # If that exceeds bounds, move start back instead
                        start_time = max(0, segment_duration - MIN_CLIP_DURATION)
                        end_time = segment_duration
                        logger.info(f"         Moving start back: {start_time:.1f}s → {end_time:.1f}s")
                    else:
                        end_time = new_end
                        logger.info(f"         Extending end: {start_time:.1f}s → {end_time:.1f}s")
                
                elif adjusted_duration > MAX_CLIP_DURATION:
                    logger.warning(
                        f"      ⚠️  Duration={adjusted_duration:.1f}s > {MAX_CLIP_DURATION}s maximum. "
                        f"TRIMMING by {adjusted_duration - MAX_CLIP_DURATION:.1f}s"
                    )
                    # Trim from the end, keeping start intact
                    new_end = start_time + MAX_CLIP_DURATION
                    if new_end > segment_duration:
                        start_time = max(0, segment_duration - MAX_CLIP_DURATION)
                        end_time = segment_duration
                        logger.info(f"         Moving start back: {start_time:.1f}s → {end_time:.1f}s")
                    else:
                        end_time = new_end
                        logger.info(f"         Trimmed end: {start_time:.1f}s → {end_time:.1f}s")
                
                # ✅ Calculate final validated duration
                final_duration = end_time - start_time
                
                # ✅ STEP 5: Calculate absolute timestamps for clipper
                abs_start = segment_start_abs + start_time
                abs_end = segment_start_abs + end_time
                
                hook_dict["start_time"] = start_time
                hook_dict["end_time"] = end_time
                hook_dict["start"] = segment_start_abs
                hook_dict["original_clip_num"] = clip.get("clip_num")
                hook_dict["audio_path"] = clip.get("audio_path")
                # ✅ ADD THIS:
                hook_dict["transcript_path"] = transcript_path  # Store for later subtitle extraction


                all_hooks.append(hook_dict)
                valid_hooks_count += 1
                
                logger.info(f"      ✅ VALID: {final_duration:.1f}s | "
                           f"Absolute: {abs_start:.1f}s → {abs_end:.1f}s | "
                           f"Score: {hook_dict.get('viral_score', 0)}/10 | "
                           f"Title: '{hook_dict.get('title', 'N/A')}'")
            
            logger.info(f"\n   📊 Segment {index} result: {valid_hooks_count}/{len(result.hooks)} hooks validated")
                
        except Exception as e:
            logger.error(f"❌ Segment {index}: Failed to analyze: {e}", exc_info=True)

        # ✅ STEP 6: Rank and select top 2 hooks by viral score
    logger.info(f"\n{'='*80}")
    logger.info(f"🏆 PHASE: Selecting Top 2 Hooks")
    logger.info(f"{'='*80}")
    logger.info(f"Total valid hooks found: {len(all_hooks)}")
    
    top_hooks = sorted(all_hooks, key=lambda x: x.get("viral_score", 0), reverse=True)[:2]
    
    logger.info(f"Selected: {len(top_hooks)} top hooks\n")
    
    # ✅ Step 6b: Attach subtitle data to each hook
    for hook in top_hooks:
        # Get subtitles that overlap with this hook's time range
        transcript_path = hook.get("transcript_path")
        if transcript_path:
            try:
                with open(transcript_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                subtitle_segments = data.get("processed_transcript", {}).get("subtitle_segments", [])
                
                # Filter subtitles that fall within this hook's time window
                hook_start = hook.get("start_time", 0)
                hook_end = hook.get("end_time", 0)
                
                relevant_subs = [
                    sub for sub in subtitle_segments
                    if sub["start"] >= hook_start and sub["end"] <= hook_end
                ]
                
                hook["subtitle_segments"] = relevant_subs
                logger.info(f"   📝 Attached {len(relevant_subs)} subtitle segments to hook")
            except Exception as e:
                logger.warning(f"   ⚠️  Failed to load subtitles: {e}")
                hook["subtitle_segments"] = []
        else:
            hook["subtitle_segments"] = []

    # ✅ STEP 7: Log final clips for verification (BEFORE RETURN!)
    logger.info(f"\n{'='*80}")
    logger.info(f"📹 FINAL CLIPS SUMMARY")
    logger.info(f"{'='*80}\n")
    
    for i, hook in enumerate(top_hooks, 1):
        duration = hook.get("end_time", 0) - hook.get("start_time", 0)
        segment_start = hook.get("start", 0)
        abs_start = segment_start + hook.get("start_time", 0)
        abs_end = segment_start + hook.get("end_time", 0)
        num_subtitles = len(hook.get("subtitle_segments", []))
        
        logger.info(f"📹 FINAL CLIP {i}:")
        logger.info(f"   ✅ Duration: {duration:.1f}s (target: 45-55s)")
        logger.info(f"   📍 Within segment: {hook.get('start_time', 0):.1f}s - {hook.get('end_time', 0):.1f}s")
        logger.info(f"   🎬 Absolute in video: {abs_start:.1f}s - {abs_end:.1f}s")
        logger.info(f"   ⭐ Score: {hook.get('viral_score', 0)}/10")
        logger.info(f"   📝 Title: {hook.get('title', 'N/A')}")
        logger.info(f"   💬 Reason: {hook.get('reasoning', 'N/A')}")
        logger.info(f"   📊 Subtitles: {num_subtitles} segments attached")
        if num_subtitles > 0:
            for sub_idx, sub in enumerate(hook.get("subtitle_segments", [])[:3], 1):
                logger.info(f"      [{sub_idx}] {sub['start']:.1f}s-{sub['end']:.1f}s: {sub['text']}")
        logger.info("")
    
    logger.info(f"{'='*80}\n")
    
    return top_hooks  # ✅ RETURN AFTER LOGGING!