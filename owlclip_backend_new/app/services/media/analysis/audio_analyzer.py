# app/services/media/analysis/audio_analyzer.py

import json 
import logging
import librosa 
import numpy as np 
from typing import List, Dict, Any
import tempfile 
import os
import time

logger = logging.getLogger(__name__)

ANALYSIS_CONFIG = {
    "clip_duration": 120,           # 2 minutes (120 seconds)
    "hop_length": 512,
    "n_fft": 2048,
    "sr": 22050,
    "num_candidates": 5,            # Final selection: 5 segments
    "top_candidates_pool": 20,      # Consider top 20 candidates
    "selection_strategy": "diverse", # Options: "diverse", "top_scored", "random_from_top"
}


def _select_diverse_candidates(candidates: List[Dict], num_to_select: int) -> List[Dict]:
    """
    Select candidates spread throughout timeline for diversity.
    
    Strategy: Divide timeline into buckets and pick best from each bucket.
    This ensures you get good segments from different parts of the video.
    """
    if len(candidates) <= num_to_select:
        return candidates
    
    # Sort by start time
    candidates_by_time = sorted(candidates, key=lambda x: x['start'])
    total_duration = candidates_by_time[-1]['end']
    
    # Divide into buckets
    bucket_size = total_duration / num_to_select
    selected = []
    
    for i in range(num_to_select):
        bucket_start = i * bucket_size
        bucket_end = (i + 1) * bucket_size
        
        # Find candidates in this bucket
        bucket_candidates = [
            c for c in candidates_by_time 
            if c['start'] >= bucket_start and c['start'] < bucket_end
        ]
        
        # If bucket is empty, expand search
        if not bucket_candidates:
            bucket_candidates = [
                c for c in candidates_by_time 
                if c['start'] >= bucket_start - bucket_size/2 and c['start'] < bucket_end + bucket_size/2
            ]
        
        # Pick the highest scored from this bucket
        if bucket_candidates:
            best = max(bucket_candidates, key=lambda x: x['score'])
            selected.append(best)
    
    return sorted(selected, key=lambda x: x['start'])


async def analyze_candidates(
    vad_json_path: str, 
    wav_path: str,
    num_final: int = None,
    top_pool: int = None,
    strategy: str = None
) -> str:
    """
    Find the best 5 × 2-minute segments from audio for transcription.
    
    Strategy:
    - Extract multiple audio features (energy, dynamics, spectral content)
    - Score each 2-minute window based on engagement metrics
    - Return top 5 non-overlapping segments from a diverse pool
    
    These 5 segments (10 minutes total) will be transcribed.
    Then AI will analyze transcripts to find hooks and extract 40-50s clips.
    
    Args:
        vad_json_path: Path to VAD analysis (where speech is)
        wav_path: Path to normalized audio file
        num_final: Override num_candidates (default from config)
        top_pool: Override top_candidates_pool (default from config)
        strategy: Override selection_strategy (default from config)
    
    Returns:
        Path to JSON file with 5 best 2-minute segments + top candidates timeline
    """
    
    # Use provided values or defaults from config
    num_final = num_final or ANALYSIS_CONFIG['num_candidates']
    top_pool = top_pool or ANALYSIS_CONFIG['top_candidates_pool']
    strategy = strategy or ANALYSIS_CONFIG['selection_strategy']
    
    start_time = time.time()
    
    try:
        # ========== STEP 1: Load VAD data ==========
        logger.info(f"📖 Loading VAD analysis: {vad_json_path}")
        with open(vad_json_path, 'r') as f:
            vad_data = json.load(f)
        
        speech_segments = vad_data['timestamps']
        logger.info(f"✅ Found {len(speech_segments)} speech segments")
        
        # ========== STEP 2: Load audio ==========
        logger.info(f"🎵 Loading audio: {wav_path}")
        y, sr = librosa.load(wav_path, sr=ANALYSIS_CONFIG['sr'])
        duration = librosa.get_duration(y=y, sr=sr)
        logger.info(f"✅ Audio loaded: {duration:.1f}s ({duration/60:.1f} minutes)")
        
        # ========== STEP 3: Extract audio features ==========
        logger.info("🔬 Extracting audio features...")
        
        # Feature 1: Mel-spectrogram (frequency content)
        S = librosa.feature.melspectrogram(
            y=y, 
            sr=sr,
            n_fft=ANALYSIS_CONFIG['n_fft'],
            hop_length=ANALYSIS_CONFIG['hop_length'],
            n_mels=128
        )
        log_S = librosa.power_to_db(S, ref=np.max)
        
        # Feature 2: Energy (loudness) ✅
        energy = np.sqrt(np.sum(S**2, axis=0))
        energy = (energy - energy.min()) / (energy.max() - energy.min() + 1e-10)
        
        # Feature 3: Spectral flux (how much audio changes) ✅
        spectral_flux = np.sqrt(np.sum(np.diff(log_S, axis=1)**2, axis=0))
        spectral_flux = np.concatenate(([0], spectral_flux))
        spectral_flux = (spectral_flux - spectral_flux.min()) / (spectral_flux.max() - spectral_flux.min() + 1e-10)
        
        # Feature 4: Spectral centroid (brightness/treble) ✅
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        spectral_centroid = (spectral_centroid - spectral_centroid.min()) / (spectral_centroid.max() - spectral_centroid.min() + 1e-10)
        
        # Feature 5: Zero crossing rate (how "crisp" the audio is) ✅
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        zcr = (zcr - zcr.min()) / (zcr.max() - zcr.min() + 1e-10)
        
        # Feature 6: MFCC (perceptual audio quality) ✅
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_energy = np.sqrt(np.sum(mfcc**2, axis=0))
        mfcc_energy = (mfcc_energy - mfcc_energy.min()) / (mfcc_energy.max() - mfcc_energy.min() + 1e-10)
        
        # Feature 7: Spectral roll-off (frequency cutoff) ✅
        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
        spectral_rolloff = (spectral_rolloff - spectral_rolloff.min()) / (spectral_rolloff.max() - spectral_rolloff.min() + 1e-10)
        
        # Feature 8: RMS (root mean square energy) ✅
        rms = librosa.feature.rms(y=y)[0]
        rms = (rms - rms.min()) / (rms.max() - rms.min() + 1e-10)
        
        logger.info("✅ Features extracted")
        
        # ========== STEP 4: Create VAD mask ==========
        # Mark which parts have speech (VAD = 1, silence = 0)
        vad_mask = np.zeros(len(energy))
        for segment in speech_segments:
            start_sec = segment['start'] / 1000
            end_sec = segment['end'] / 1000
            start_frame = int(start_sec * sr / ANALYSIS_CONFIG['hop_length'])
            end_frame = int(end_sec * sr / ANALYSIS_CONFIG['hop_length'])
            vad_mask[max(0, start_frame):min(len(vad_mask), end_frame)] = 1
        
        logger.info(f"✅ VAD mask created ({np.sum(vad_mask)} frames have speech)")
        
        # ========== STEP 5: Score all 2-minute windows ==========
        logger.info("🎯 Scoring 2-minute windows...")
        
        all_candidates = []
        clip_duration_frames = int(
            ANALYSIS_CONFIG['clip_duration'] * sr / ANALYSIS_CONFIG['hop_length']
        )
        
        # Slide through entire audio
        for start_frame in range(0, len(energy) - clip_duration_frames, clip_duration_frames // 2):
            end_frame = start_frame + clip_duration_frames
            
            if end_frame > len(energy):
                break
            
            window_energy = energy[start_frame:end_frame]
            window_flux = spectral_flux[start_frame:end_frame]
            window_centroid = spectral_centroid[start_frame:end_frame]
            window_zcr = zcr[start_frame:end_frame]
            window_mfcc = mfcc_energy[start_frame:end_frame]
            window_rolloff = spectral_rolloff[start_frame:end_frame]
            window_rms = rms[start_frame:end_frame]
            window_vad = vad_mask[start_frame:end_frame]
            
            # Calculate metrics
            energy_score = np.mean(window_energy)
            dynamics_score = np.mean(window_flux)
            brightness_score = np.mean(window_centroid)
            crispness_score = np.mean(window_zcr)
            mfcc_score = np.mean(window_mfcc)
            rolloff_score = np.mean(window_rolloff)
            rms_score = np.mean(window_rms)
            vad_coverage = np.mean(window_vad)  # How much speech in this window
            
            # Skip windows with too little speech
            if vad_coverage < 0.3:
                continue
            
            # Composite scoring (weights matter!)
            composite_score = (
                0.25 * energy_score +           # Loud segments are engaging
                0.25 * dynamics_score +         # Changes are interesting
                0.15 * brightness_score +       # Variety in frequency
                0.10 * crispness_score +        # Clear speech
                0.10 * mfcc_score +             # Audio quality
                0.10 * rms_score +              # Signal strength
                0.05 * rolloff_score            # Frequency distribution
            )
            
            start_sec = start_frame / (sr / ANALYSIS_CONFIG['hop_length'])
            end_sec = end_frame / (sr / ANALYSIS_CONFIG['hop_length'])
            
            all_candidates.append({
                "start": float(start_sec),
                "end": float(end_sec),
                "duration": ANALYSIS_CONFIG['clip_duration'],
                "score": float(composite_score),
                "energy": float(energy_score),
                "dynamics": float(dynamics_score),
                "brightness": float(brightness_score),
                "crispness": float(crispness_score),
                "mfcc": float(mfcc_score),
                "vad_coverage": float(vad_coverage),
                "metrics": {
                    "mean_energy": float(energy_score),
                    "mean_dynamics": float(dynamics_score),
                    "mean_brightness": float(brightness_score),
                }
            })
        
        logger.info(f"✅ Scored {len(all_candidates)} candidate windows")
        
        # ========== STEP 6: Get top candidates pool ==========
        logger.info(f"🎯 Creating top-{top_pool} candidate pool (using '{strategy}' strategy)...")
        
        # Sort by score descending
        all_candidates = sorted(all_candidates, key=lambda x: x['score'], reverse=True)
        
        # Get top candidates that don't overlap
        top_candidates = []
        for candidate in all_candidates:
            overlaps = False
            for top_cand in top_candidates:
                if not (candidate['end'] < top_cand['start'] or 
                        candidate['start'] > top_cand['end']):
                    overlaps = True
                    break
            
            if not overlaps:
                top_candidates.append(candidate)
            
            if len(top_candidates) == top_pool:
                break
        
        logger.info(f"✅ Built pool of {len(top_candidates)} non-overlapping candidates")
        
        # ========== STEP 7: Select final segments based on strategy ==========
        logger.info(f"🏆 Selecting {num_final} final segments ({strategy} strategy)...")
        
        if strategy == "diverse":
            # Select top-scored but spread across timeline
            selected = _select_diverse_candidates(top_candidates, num_final)
        elif strategy == "random_from_top":
            # Randomly select from top pool
            indices = np.random.choice(
                len(top_candidates), 
                min(num_final, len(top_candidates)), 
                replace=False
            )
            selected = [top_candidates[i] for i in sorted(indices)]
            selected = sorted(selected, key=lambda x: x['start'])
        else:  # "top_scored"
            # Just take top N by score
            selected = sorted(top_candidates[:num_final], key=lambda x: x['start'])
        
        # Sort by time for final output
        selected = sorted(selected, key=lambda x: x['start'])
        
        logger.info(f"✅ Selected {len(selected)} segments:")
        for i, seg in enumerate(selected, 1):
            logger.info(
                f"  {i}. {seg['start']:.1f}s - {seg['end']:.1f}s | "
                f"Score: {seg['score']:.3f} | Energy: {seg['energy']:.2f}"
            )
        
        # ========== STEP 8: Save results ==========
        logger.info("💾 Saving candidate segments...")
        
        temp_file = tempfile.NamedTemporaryFile(
            mode='w',
            suffix='.json',
            prefix='candidates_',
            delete=False
        )
        
        result = {
            "vad_source": vad_json_path,
            "audio_file": wav_path,
            "total_duration": float(duration),
            "analysis_config": ANALYSIS_CONFIG,
            "selection_strategy_used": strategy,
            "selected_segments": selected,
            "top_candidates_pool": sorted(top_candidates, key=lambda x: x['start']),  # Show timeline
            "selection_stats": {
                "total_candidates_scored": len(all_candidates),
                "segments_selected": len(selected),
                "top_pool_size": len(top_candidates),
                "average_score": float(np.mean([s['score'] for s in selected])),
                "average_score_top_pool": float(np.mean([s['score'] for s in top_candidates])),
                "analysis_time_seconds": float(time.time() - start_time)
            },
            "next_step": f"These {len(selected)} × 2-minute segments will be transcribed"
        }
        
        json.dump(result, temp_file, indent=2)
        temp_file.close()
        
        logger.info(f"✅ Analysis complete in {time.time() - start_time:.1f}s")
        logger.info(f"📁 Results saved to: {temp_file.name}")
        logger.info(f"📊 Ready for transcription of {len(selected) * 2} minutes of audio")
        
        return temp_file.name
        
    except Exception as e:
        logger.error(f"❌ Analysis failed: {e}", exc_info=True)
        raise