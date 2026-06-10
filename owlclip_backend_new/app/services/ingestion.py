"""
         Ingestion Pipeline Wiring (Production Grade)
         
         Flow:
         VAD/Energy -> Candidates -> Transcription -> Intelligence -> LLM Hook Detection (Top 2) -> HD Clipper -> Azure Upload
"""

import asyncio
import shutil
import logging
import json
import os
from pathlib import Path

from app.services.media.analysis.vad import analyze_audio
from app.services.media.extract_audio import extract_audio
from app.services.media.analysis.normalized_audio import normalize_and_convert

from app.services.media.analysis.audio_analyzer import analyze_candidates
from app.services.media.analysis.audio_cutter import cleanup_audio_clips, cut_audio_segments
from app.services.media.analysis.transcribe_candidates import transcribe_audio_clips
from app.services.media.analysis.transcript_processor import process_transcript_clips
from app.services.media.analysis.llm_analyzation import analyze_hooks_for_clips
from app.services.media.analysis.clipper import produce_final_clips

from app.core.storage import storage_service
from app.repositories.upload_jobs import (
    get_videojob,
    save_transcript,
    save_final_clips,
    update_status
)
from app.core.database import AsyncSessionLocal
from app.core.config import settings

logger = logging.getLogger(__name__)


async def ingestion_pipeline(job_id: str):
    """
    Full production ingestion pipeline with proper cleanup.
    """
    
    # Track resources for cleanup
    extracted_audio = None
    audio_clips = None
    wav_path = None
    clipped_temp_dir = None
    
    try:
        # Step 0: Pre-flight Validation
        required_settings = {
            "GEMINI_API_KEY": settings.GEMINI_API_KEY,
            "GROQ_API_KEY": settings.GROQ_API_KEY,
            "AZURE_SPEECH_KEY": settings.AZURE_SPEECH_KEY,
            "AZURE_STORAGE_ACCOUNT_NAME": settings.AZURE_STORAGE_ACCOUNT_NAME,
            "AZURE_STORAGE_ACCOUNT_KEY": settings.AZURE_STORAGE_ACCOUNT_KEY
        }

        missing = [k for k, v in required_settings.items() if not v]
        if missing:
            error_msg = f"Missing required environment variables: {', '.join(missing)}"
            logger.error(f"🚫 Pre-flight check failed: {error_msg}")
            async with AsyncSessionLocal() as db:
                await update_status(db, job_id, "FAILED")
            return

        # Step 1: Fetch job
        async with AsyncSessionLocal() as db:
            job = await get_videojob(db, job_id)

        if not job:
            logger.error(f"Job {job_id} not found")
            return

        yt_url = job.yt_url 
        logger.info(f"🚀 Starting Ingestion: job={job_id}, url={yt_url}")

        # ✅ NEW: Set pipeline timeout (600 seconds = 10 minutes max)
        try:
            async with asyncio.timeout(1800):
                # Step 2: Extract audio
                extracted_audio = await extract_audio(yt_url)
                
                # Step 3: Normalize to WAV
                wav_path = await normalize_and_convert(extracted_audio.audio_path)

                # Step 4: VAD + Energy Analysis
                speech_timestamps_path = await analyze_audio(wav_path)
                
                # Step 5: Candidate Segment Generation
                candidates_json = await analyze_candidates(speech_timestamps_path, wav_path)
                
                with open(candidates_json) as f:
                    analysis = json.load(f)
                    selected_segments = analysis['selected_segments']
                    logger.info(f"✅ {len(selected_segments)} candidate segments selected")

                # Step 6: Cut Audio Segments
                audio_clips = await cut_audio_segments(wav_path, selected_segments)
 
                # Step 7: Transcribe segments
                audio_clips = await transcribe_audio_clips(audio_clips)

                # Step 8: Intelligence Layer
                audio_clips = await process_transcript_clips(audio_clips)

                # Step 9: LLM Hook Detection
                viral_hooks = await analyze_hooks_for_clips(audio_clips)
                if not viral_hooks:
                    logger.warning("No viral hooks found by LLM. Pipeline stopping.")
                    return

                # Step 10: Final HD Clipping
                produced_clips = await produce_final_clips(yt_url, viral_hooks)
                
                # ✅ NEW: Validate produced clips and track for cleanup
                if not produced_clips:
                    logger.error("No clips produced by clipper")
                    return
                
                # Track the temp directory for cleanup in finally block
                clipped_temp_dir = Path(produced_clips[0]["final_video_path"]).parent
                
                for clip in produced_clips:
                    if not clip.get("final_video_path"):
                        logger.error(f"Clip missing final_video_path: {clip}")
                        return

                # Step 11: Upload to Azure Blob Storage
                final_results = []
                upload_errors = []
                
                for i, clip in enumerate(produced_clips, start=1):
                    video_local_path = clip.get("final_video_path")
                    if video_local_path:
                        try:
                            logger.info(f"☁️  Uploading Clip {i} to Azure...")
                            azure_url = await storage_service.upload_clip(video_local_path, job_id)
                            
                            if azure_url:
                                clip["azure_url"] = azure_url
                                final_results.append({
                                    "clip_num": i,
                                    "title": clip.get("title"),
                                    "url": azure_url,
                                    "viral_score": clip.get("viral_score"),
                                    "reasoning": clip.get("reasoning"),
                                    "start_time": clip.get("abs_start"),
                                    "end_time": clip.get("abs_end"),
                                    # ✅ NEW: Store subtitles for frontend
                                    "subtitles": clip.get("subtitle_segments", [])
                                })
                            else:
                                upload_errors.append(f"Clip {i}: No URL returned")
                                logger.error(f"Failed to upload clip {i}")
                        except Exception as e:
                            upload_errors.append(f"Clip {i}: {str(e)}")
                            logger.error(f"Upload failed for clip {i}: {e}")
                
                # ✅ NEW: Only save if at least one clip uploaded successfully
                if not final_results:
                    logger.error(f"All uploads failed: {upload_errors}")
                    async with AsyncSessionLocal() as db:
                        await update_status(db, job_id, "FAILED")
                    return

                # Step 12: Save results to DB
                async with AsyncSessionLocal() as db:
                    await save_final_clips(db, job_id, final_results)
                    await update_status(db, job_id, "COMPLETED")
                    logger.info(f"🏁 Pipeline Complete for job {job_id}. {len(final_results)} clips saved.")

        except asyncio.TimeoutError:
            logger.error(f"❌ Pipeline timeout after 600 seconds for job {job_id}")
            async with AsyncSessionLocal() as db:
                await update_status(db, job_id, "FAILED")
            raise

    except Exception as e:
        logger.error(f"❌ Pipeline failed for {job_id}: {e}", exc_info=True)
        try:
            async with AsyncSessionLocal() as db:
                await update_status(db, job_id, "FAILED")
        except:
            pass
        raise
    
    finally:
        # ✅ CRITICAL: ALWAYS cleanup, even on failure
        logger.info(f"🧹 Cleaning up resources for job {job_id}...")
        
        # Cleanup audio clips
        if audio_clips:
            try:
                await cleanup_audio_clips(audio_clips)
            except Exception as e:
                logger.warning(f"Failed to cleanup audio clips: {e}")
        
        # Cleanup extracted audio temp dir
        if extracted_audio:
            try:
                shutil.rmtree(extracted_audio.temp_dir, ignore_errors=True)
                logger.debug(f"Cleaned up extracted audio: {extracted_audio.temp_dir}")
            except Exception as e:
                logger.warning(f"Failed to cleanup extracted audio: {e}")
        
        logger.info(f"✅ Cleanup complete for job {job_id}")

