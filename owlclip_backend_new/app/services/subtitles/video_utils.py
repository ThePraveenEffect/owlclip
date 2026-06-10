import json
import subprocess
import requests


def probe_video(path):
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_streams", path],
        capture_output=True, text=True
    )
    streams = json.loads(result.stdout)["streams"]
    video   = next(s for s in streams if s["codec_type"] == "video")
    return int(video["width"]), int(video["height"])


def download_video(url, dest):
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_content(8192):
                if chunk:
                    f.write(chunk)


def burn_subtitles(input_path, ass_path, output_path):
    cmd = [
        "ffmpeg", "-y",
        "-i", input_path,
        "-vf", f"ass={ass_path}",
        "-c:v", "libx264",
        "-crf", "18",
        "-preset", "fast",
        "-c:a", "aac",
        "-b:a", "192k",
        output_path
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True)

    if proc.returncode != 0:
        print("❌ FFmpeg failed. Relevant errors:")
        for line in proc.stderr.split("\n"):
            if any(k in line.lower() for k in ["error", "invalid", "no such", "filter", "ass"]):
                print(" ", line)
        print("\n--- stderr tail ---")
        print(proc.stderr[-1500:])
        return False
    return True

