import os
import tempfile
from app.services.subtitles.processing import redistribute_subtitles,group_subtitles
from app.services.subtitles.ass_generation import build_ass, seconds_to_ass
from app.services.subtitles.video_utils import probe_video, download_video,burn_subtitles



def process_clip(clip_model):
    clip = clip_model.dict()

    clip_duration = clip["end_time"] - clip["start_time"]

    temp_dir    = tempfile.gettempdir()
    input_path  = os.path.join(temp_dir, f"input_{clip['clip_num']}.mp4")
    ass_path    = os.path.join(temp_dir, f"subs_{clip['clip_num']}.ass")
    output_path = os.path.join(temp_dir, f"output_{clip['clip_num']}.mp4")

    # 1. Download
    print(f"\n{'─'*50}")
    print(f"🎬 Clip {clip['clip_num']}: {clip['title']}")
    print(f"   Duration: {clip_duration:.2f}s")
    print("📥 Downloading...")
    download_video(clip["url"], input_path)

    # 2. Probe actual video dimensions
    w, h = probe_video(input_path)
    print(f"📐 Resolution: {w}x{h}")

    # 3. Redistribute subtitles proportionally across real clip duration
    #    — ignores original timestamps entirely, works for every clip
    subs = redistribute_subtitles(clip["subtitles"], clip_duration)

    # 4. Group into clean reading chunks
    subs = group_subtitles(subs, max_words=5)

    print(f"📝 {len(subs)} subtitle groups:")
    for s in subs:
        print(f"   {s['start']:6.2f}s → {s['end']:6.2f}s  |  {s['text']}")

    # 5. Build and write ASS file
    ass_content = build_ass(subs, w, h, title_text=clip["title"])
    with open(ass_path, "w", encoding="utf-8") as f:
        f.write(ass_content)

    # 6. Burn
    print("🔥 Burning subtitles...")
    success = burn_subtitles(input_path, ass_path, output_path)

    if success:
        size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"✅ Done → {output_path}  ({size_mb:.1f} MB)")
        return output_path

    return None

