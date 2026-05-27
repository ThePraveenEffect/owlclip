# Candidate Selection Strategies - Implementation Guide

## Problem

Your pipeline was always selecting **the same 5 segments** every time because:
- ✋ No randomization
- ✋ Pure deterministic scoring
- ✋ Always picking absolute top-5 by score

Result: Even with different audio inputs, if they had similar characteristics, you'd get similar patterns.

## Solution: Three Selection Strategies

### 1. **"diverse"** (DEFAULT)
**Best for**: Getting representative segments from throughout the video

```python
candidates = await analyze_candidates(vad_path, wav_path, strategy='diverse')
```

**How it works**:
- Considers top-20 candidates by score
- Divides timeline into 5 equal buckets
- Picks the best-scored candidate from each bucket
- **Result**: Segments spread across the video, still all high-quality

**Output varies**: YES (depends on where good segments are located)

---

### 2. **"top_scored"** (Deterministic)
**Best for**: Reproducible results / baseline comparison

```python
candidates = await analyze_candidates(vad_path, wav_path, strategy='top_scored')
```

**How it works**:
- Scores all 2-minute windows
- Returns absolute top-5 by composite score
- **No randomization**, same input = same output

**Output varies**: NO (100% deterministic)

---

### 3. **"random_from_top"** (Variable)
**Best for**: Getting different high-quality segments each run

```python
candidates = await analyze_candidates(vad_path, wav_path, strategy='random_from_top')
```

**How it works**:
- Considers top-20 candidates
- Randomly selects 5 from the pool
- All selections are still high-quality (from top-20)
- **Different each time** (unless numpy seed is set)

**Output varies**: YES (always different)

---

## Configuration

### Global Config
```python
# app/services/media/analysis/audio_analyzer.py
ANALYSIS_CONFIG = {
    "clip_duration": 120,           # 2 minutes (120 seconds)
    "hop_length": 512,
    "n_fft": 2048,
    "sr": 22050,
    "num_candidates": 5,            # Final selection: 5 segments
    "top_candidates_pool": 20,      # Consider top 20 candidates
    "selection_strategy": "diverse", # Default strategy
}
```

### Per-Call Override
```python
candidates = await analyze_candidates(
    vad_path, 
    wav_path,
    num_final=7,           # Override: get 7 instead of 5
    top_pool=30,          # Override: consider top-30 instead of top-20
    strategy='random_from_top'  # Override: use random strategy
)
```

---

## JSON Output Structure

Each analysis now returns:

```json
{
  "vad_source": "path/to/vad.json",
  "audio_file": "path/to/audio.wav",
  "selection_strategy_used": "diverse",
  
  "selected_segments": [
    {
      "start": 59.97,
      "end": 179.95,
      "score": 0.185,
      "energy": 0.0117,
      "dynamics": 0.177,
      ...
    },
    // ... 4 more segments
  ],
  
  "top_candidates_pool": [
    // Full timeline of top-20 candidates for visualization
    { "start": 59.97, "end": 179.95, "score": 0.185, ... },
    { "start": 719.72, "end": 839.70, "score": 0.186, ... },
    // ... 18 more
  ],
  
  "selection_stats": {
    "total_candidates_scored": 42,
    "segments_selected": 5,
    "top_pool_size": 20,
    "average_score": 0.1857,
    "average_score_top_pool": 0.1865,
    "analysis_time_seconds": 97.18
  }
}
```

**Key additions**:
- `top_candidates_pool`: See all viable candidates (good for UI/dashboard)
- `selection_strategy_used`: Know which strategy was used
- `top_pool_size`: How many were in the candidate pool
- `average_score_top_pool`: Quality of the full pool

---

## Usage in Ingestion Pipeline

### Current (unchanged - uses default)
```python
candidates = await analyze_candidates(speech_timestamps, wav_path)
# Uses: diversity strategy, top-20 pool, selects 5
```

### With Strategy Override
```python
# Get different segments each time
candidates = await analyze_candidates(
    speech_timestamps, 
    wav_path,
    strategy='random_from_top'  # New: vary the segments
)
```

---

## Comparison

| Aspect | diverse | top_scored | random_from_top |
|--------|---------|-----------|-----------------|
| Variety | ✅ High | ❌ None | ✅ High |
| Quality | ✅ High | ✅ Highest | ✅ High |
| Deterministic | ❌ No | ✅ Yes | ❌ No |
| Timeline spread | ✅ Good | ❌ Clustered | ✅ Good |
| Best for | General use | Testing/baseline | Exploration |

---

## Implementation Details

### _select_diverse_candidates() Helper

```python
def _select_diverse_candidates(candidates: List[Dict], num_to_select: int) -> List[Dict]:
    """
    Select candidates spread throughout timeline for diversity.
    
    Strategy: Divide timeline into buckets and pick best from each bucket.
    """
    # Divides the total duration into num_to_select equal buckets
    # For each bucket, picks the highest-scored candidate
    # Ensures good segments from beginning, middle, and end
```

---

## Recommendations

**For your use case (exploring different clips from the same video)**:

1. **First run**: Use `"diverse"` to get representative segments
2. **Explore variations**: Use `"random_from_top"` to get different takes
3. **Verify quality**: Check `top_candidates_pool` to see if you're happy with the overall pool
4. **For testing**: Use `"top_scored"` for reproducibility

---

## Next Steps

This now enables:
- ✅ Different segments from the same video (use random_from_top)
- ✅ Timeline visualization (use top_candidates_pool in UI)
- ✅ Smart segment distribution (use diverse by default)
- ✅ Reproducible testing (use top_scored when needed)

Try running:
```bash
python test_candidate_strategies.py
```

To see the strategy differences in action!
