"""Turn a video of your character into the scroll-scrubbed frame sequence used by the hero.

    python scripts/extract_frames.py path/to/video.mp4
    python scripts/extract_frames.py path/to/video.mp4 --count 120 --width 1600

Writes public/hero-frames (desktop) and public/hero-frames-mobile (portrait crop target),
each with f001.webp... and a meta.json holding the frame count. Needs `pip install imageio-ffmpeg`.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent


def duration_seconds(ffmpeg: str, video: Path) -> float:
    info = subprocess.run([ffmpeg, "-hide_banner", "-i", str(video)], capture_output=True, text=True).stderr
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", info)
    if not m:
        sys.exit("Could not read the video duration.")
    h, mnt, s = m.groups()
    return int(h) * 3600 + int(mnt) * 60 + float(s)


def extract(ffmpeg: str, video: Path, out: Path, count: int, width: int, quality: int) -> int:
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob("f*.webp"):
        old.unlink()
    fps = count / duration_seconds(ffmpeg, video)
    subprocess.run(
        [
            ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(video),
            "-vf", f"fps={fps:.5f},scale={width}:-2",
            "-c:v", "libwebp", "-quality", str(quality), "-start_number", "1",
            str(out / "f%03d.webp"),
        ],
        check=True,
    )
    written = len(list(out.glob("f*.webp")))
    (out / "meta.json").write_text(json.dumps({"count": written}), encoding="utf-8")
    return written


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("video", type=Path)
    p.add_argument("--count", type=int, default=120, help="number of frames (more = smoother, bigger)")
    p.add_argument("--width", type=int, default=1600, help="desktop frame width in px")
    p.add_argument("--mobile-width", type=int, default=800, help="mobile frame width in px")
    p.add_argument("--quality", type=int, default=78)
    p.add_argument("--out", type=Path, default=ROOT / "public", help="folder that will hold hero-frames*")
    a = p.parse_args()

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    n = extract(ffmpeg, a.video, a.out / "hero-frames", a.count, a.width, a.quality)
    m = extract(ffmpeg, a.video, a.out / "hero-frames-mobile", a.count, a.mobile_width, a.quality)
    print(f"desktop: {n} frames, mobile: {m} frames -> {a.out}")


if __name__ == "__main__":
    main()
