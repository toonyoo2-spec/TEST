#!/usr/bin/env python3
"""Loudness-normalise each synthesized mix (static gain to -16 LUFS, limiter ceiling -1.5 dBFS)
and mux it with the rendered video.  Also writes the silent master (video stream only).

  python3 scripts/mux.py    -> out/{A,B,C}.mp4 (with audio), out/{A,B,C}-silent.mp4, build/audio/loudness.json
"""
import json, re, shutil, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = -16.0


def ebur(path):
    r = subprocess.run(["ffmpeg", "-nostats", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    summ = r[r.rfind("Summary:"):]
    i = float(re.search(r"I:\s+(-?[\d.]+) LUFS", summ).group(1))
    tp = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", summ).group(1))
    return i, tp


report = {}
(ROOT / "out").mkdir(exist_ok=True)
for ep in "ABC":
    raw = ROOT / f"build/audio/{ep}-mix_raw.wav"
    i0, p0 = ebur(raw)
    gain = TARGET - i0
    final_wav = ROOT / f"build/audio/{ep}-mix.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                    f"volume={gain:.2f}dB,alimiter=limit=0.8414:attack=3:release=60:level=false",
                    "-c:a", "pcm_s16le", str(final_wav)], check=True)
    i1, p1 = ebur(final_wav)
    video = ROOT / f"build/{ep}-video.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-i", str(final_wav),
                    "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                    "-t", "30", "-movflags", "+faststart", str(ROOT / f"out/{ep}.mp4")], check=True)
    shutil.copyfile(video, ROOT / f"out/{ep}-silent.mp4")
    report[ep] = {"raw_I_LUFS": i0, "raw_peak_dBFS": p0, "gain_dB": round(gain, 2), "final_I_LUFS": i1, "final_true_peak_dBTP": p1}
    print(ep, report[ep])
(ROOT / "build/audio/loudness.json").write_text(json.dumps(report, indent=1))
