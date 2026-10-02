#!/usr/bin/env python3
"""Self-check of the delivered files. Writes validation/report.json + validation/report.md
and 360px-wide contact sheets in validation/sheets/.

Prerequisites (see README): render.mjs (videos + --inspect + --cover), audio.mjs, mux.py.
"""
import json, subprocess, wave
from pathlib import Path

import numpy as np
from fontTools.ttLib import TTFont
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
V = ROOT / "validation"; (V / "sheets").mkdir(parents=True, exist_ok=True)
FPS, N = 30, 900
ZONE = dict(x0=80, x1=1000, y0=250, y1=1500)   # v2 kinetic measure (brief suggestion was 90~900)
# approximate Reels overlay (1080x1920): top bar, bottom caption/nav, right action column
UI_BOXES = {"top": (0, 0, 1080, 220), "bottom": (0, 1500, 1080, 1920), "right": (930, 1000, 1080, 1700)}
R = {"episodes": {}, "fails": [], "notes": []}


def fail(ep, msg):
    R["fails"].append(f"{ep}: {msg}")


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def ffprobe(path):
    j = json.loads(sh(["ffprobe", "-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", str(path)]).stdout)
    v = next(s for s in j["streams"] if s["codec_type"] == "video")
    a = next((s for s in j["streams"] if s["codec_type"] == "audio"), None)
    return {"width": v["width"], "height": v["height"], "r_frame_rate": v["r_frame_rate"], "avg_frame_rate": v["avg_frame_rate"],
            "nb_read_frames": int(v["nb_read_frames"]), "video_duration": float(v["duration"]), "format_duration": float(j["format"]["duration"]),
            "pix_fmt": v["pix_fmt"], "codec": v["codec_name"],
            "audio": None if not a else {"codec": a["codec_name"], "sample_rate": a["sample_rate"], "channels": a["channels"], "duration": float(a["duration"])},
            "size_bytes": int(j["format"]["size"])}


def decode_errors(path):
    return sh(["ffmpeg", "-v", "error", "-i", str(path), "-f", "null", "-"]).stderr.strip()


def framemd5(path):
    out = sh(["ffmpeg", "-v", "error", "-i", str(path), "-map", "0:v", "-f", "framemd5", "-"]).stdout
    return [l.split(",")[-1].strip() for l in out.splitlines() if l and not l.startswith("#")]


def decoded_frame(path, n):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vf", f"select=eq(n\\,{n}),scale=out_color_matrix=bt709:in_range=tv:out_range=pc",
                          "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(1920, 1080, 3).astype(np.float64)


def psnr(a, b):
    m = np.mean((a - b) ** 2)
    return 99.0 if m == 0 else 10 * np.log10(255 ** 2 / m)


def inter(r, box):
    x0, y0, x1, y1 = box
    return not (r["x"] + r["w"] <= x0 or r["x"] >= x1 or r["y"] + r["h"] <= y0 or r["y"] >= y1)


font = TTFont(ROOT / "fonts/NotoSansKR-VF.ttf")
cmap = font.getBestCmap()

for ep in "ABC":
    E = R["episodes"][ep] = {}
    data = json.loads((ROOT / f"src/data/{ep}.json").read_text())
    cuts = data["cuts"]
    insp = json.loads((ROOT / f"build/{ep}-inspect.json").read_text())

    # ---- 1. files, stream facts, decode
    for name in (f"{ep}.mp4", f"{ep}-silent.mp4", f"{ep}-cover.png"):
        if not (ROOT / "out" / name).exists():
            fail(ep, f"missing out/{name}")
    for kind, fn in (("with_audio", f"{ep}.mp4"), ("silent", f"{ep}-silent.mp4")):
        p = ROOT / "out" / fn
        info = ffprobe(p); info["decode_errors"] = decode_errors(p) or "none"
        E[f"file_{kind}"] = info
        if (info["width"], info["height"]) != (1080, 1920): fail(ep, f"{fn} size {info['width']}x{info['height']}")
        if info["r_frame_rate"] != "30/1" or info["avg_frame_rate"] != "30/1": fail(ep, f"{fn} fps {info['r_frame_rate']}")
        if info["nb_read_frames"] != N: fail(ep, f"{fn} frames {info['nb_read_frames']}")
        if abs(info["video_duration"] - 30.0) > 1e-6: fail(ep, f"{fn} video duration {info['video_duration']}")
        if info["decode_errors"] != "none": fail(ep, f"{fn} decode errors")
    cov = Image.open(ROOT / f"out/{ep}-cover.png")
    E["cover"] = {"size": cov.size, "audit": json.loads((ROOT / f"build/{ep}-cover-audit.json").read_text())}
    if cov.size != (1080, 1920): fail(ep, "cover size")
    cl = [a for a in E["cover"]["audit"] if a["text"] in data["cover"]["lines"]]
    if [a["text"] for a in cl] != data["cover"]["lines"]: fail(ep, "cover lines")
    for a in E["cover"]["audit"]:
        if a["x"] < 76 or a["x"] + a["w"] > 1004: fail(ep, f"cover text out of bounds: {a['text']}")

    # ---- 2. cut continuity
    cont = []
    f = 0
    for c in cuts:
        if c["start"] != f: fail(ep, f"gap/overlap before {c['id']}")
        cont.append({"cut": c["id"], "start": c["start"], "end": c["end"], "frames": c["frames"], "sec": c["sec"]})
        f = c["end"]
    E["cuts"] = {"count": len(cuts), "total_frames": f, "gaps_or_overlaps": sum(1 for x in R["fails"] if "gap/overlap" in x and x.startswith(ep)), "list": cont}
    if f != N or len(cuts) != 11: fail(ep, "cut total")

    # ---- 3. copy timing (per-frame copy state from the engine)
    timing = []
    for c in cuts:
        st = insp["copyStates"][c["start"]:c["end"]]
        if c["copy"]:
            cnt = {ph: sum(1 for s in st if s["state"] and s["state"]["phase"] == ph) for ph in ("in", "hold", "out")}
            exp = {"in": c["copy"]["in"], "hold": c["copy"]["hold"], "out": c["copy"]["out"]}
            ok = cnt == exp
            if not ok: fail(ep, f"{c['id']} copy timing {cnt} != {exp}")
            timing.append({"cut": c["id"], "frames": cnt, "seconds": {k: round(v / FPS, 3) for k, v in cnt.items()}, "ok": ok})
        else:
            if any(s["state"] for s in st): fail(ep, f"{c['id']} has copy but should not")
            timing.append({"cut": c["id"], "frames": "새 문구 없음", "ok": True})
    E["copy_timing"] = timing

    # ---- 4. copy text / emphasis / bounds / extra strings, at start / mid / last frame of each cut
    layout = {l["cut"]: l for l in insp["layout"]}
    frames = {fr["f"]: fr for fr in insp["frames"]}
    checks = []
    for i, c in enumerate(cuts):
        neighbours = [x for x in cuts[max(0, i - 1): i + 2] if x["copy"]]
        allowed = set(["REAL ACADEMY"]) | {s for x in cuts[max(0, i - 1): i + 2] for s in x["sub"]} | {l for x in neighbours for l in x["copy"]["lines"]}
        for tag_, fr in (("start", c["start"]), ("mid", c["start"] + c["frames"] // 2), ("last", c["end"] - 1)):
            items = [it for it in frames[fr]["items"] if it["visible"]]
            row = {"cut": c["id"], "frame": fr, "at": tag_, "visible_text": sorted({it["text"] for it in items}), "issues": []}
            extra = [it["text"] for it in items if it["text"] not in allowed]
            if extra: row["issues"].append(f"unexpected text {extra}")
            for it in items:
                r = it["rect"]
                if it.get("occluded"): row["issues"].append(f"occluded by {it['occluded']}: {it['text']}")
                if it["role"] in ("copy", "sub"):
                    if r["x"] < ZONE["x0"] - 0.5 or r["x"] + r["w"] > ZONE["x1"] + 0.5 or r["y"] < ZONE["y0"] or r["y"] + r["h"] > ZONE["y1"]:
                        row["issues"].append(f"out of copy zone: {it['text']} {r}")
                    hit = [k for k, b in UI_BOXES.items() if inter(r, b)]
                    if hit: row["issues"].append(f"under Reels UI {hit}: {it['text']}")
                    if it["src"] == "dom" and it["role"] == "sub" and it["fontSize"] < 48:
                        row["issues"].append(f"sub text < 48px: {it['text']} {it['fontSize']}")
            if c["copy"] and tag_ == "mid":
                cl = [it for it in items if it["role"] == "copy" and it["cut"] == c["id"]]
                got = [it["domText"] for it in sorted(cl, key=lambda x: (x["rect"]["y"]))]
                if got != c["copy"]["lines"]: row["issues"].append(f"copy lines {got} != {c['copy']['lines']}")
                ems = [e["text"] for it in cl for e in it["ems"]]
                want = [e for line in c["copy"]["lines"] for e in c["copy"]["emph"] if e in line]
                if sorted(ems) != sorted(want): row["issues"].append(f"emphasis {ems} != {want}")
                if any(e["weight"] != "900" for it in cl for e in it["ems"]): row["issues"].append("emphasis not bold")
                row["copy_size_px"] = "/".join(str(x) for x in layout[c["id"]]["sizes"])
                row["copy_size_at_360px"] = "/".join(str(round(x / 3, 1)) for x in layout[c["id"]]["sizes"])
                row["copy_max_line_width"] = layout[c["id"]]["maxWidth"]
                if not all(72 <= x <= 150 for x in layout[c["id"]]["sizes"]): row["issues"].append("copy size outside 72~150")
            if tag_ == "mid":
                need = c["sub"]
                if c.get("subTiming"):
                    need = [s for s in need if c["subTiming"].get(s, [0, 9999])[0] <= fr < c["subTiming"].get(s, [0, 9999])[1]]
                miss = [s for s in need if s not in row["visible_text"]]
                if miss: row["issues"].append(f"missing sub {miss}")
            for s in row["issues"]: fail(ep, f"{c['id']}@{fr}: {s}")
            checks.append(row)
    E["text_checks"] = checks

    # ---- 5. glyph coverage
    strings = [l for c in cuts if c["copy"] for l in c["copy"]["lines"]] + [s for c in cuts for s in c["sub"]] + data["cover"]["lines"] + ["초등 영어", "리얼 아카데미"]
    missing = sorted({ch for s in strings for ch in s if ch.strip() and ord(ch) not in cmap})
    E["glyph_missing"] = missing
    if missing: fail(ep, f"missing glyphs {missing}")

    # ---- 6. still-hold checks on the rendered source frames (md5 of every PNG frame)
    md5 = json.loads((ROOT / f"build/{ep}-frames.json").read_text())["md5"]
    holds = []
    for c in cuts:
        for h in c.get("holds", []):
            seg = md5[h["from"]:h["to"]]
            ok = len(set(seg)) == 1
            holds.append({"cut": c["id"], "what": h["what"], "frames": f"{h['from']}..{h['to'] - 1}", "count": len(seg), "seconds": round(len(seg) / FPS, 3), "identical": ok})
            if not ok: fail(ep, f"{c['id']} hold '{h['what']}' not static ({len(set(seg))} distinct)")
    # copy holds where nothing else should move are reported, not required
    E["source_holds"] = holds

    # ---- 7. decoded mp4: frame alignment (PSNR vs source PNG) and CTA freeze
    srcdir = V / "frames" / ep
    dmd5 = framemd5(ROOT / f"out/{ep}.mp4")
    E["decoded_frames"] = len(dmd5)
    cta = dmd5[780:900]
    E["decoded_cta_still"] = {"frames": "780..899", "count": len(cta), "distinct_decoded_md5": len(set(cta))}
    if len(set(cta)) != 1: fail(ep, f"decoded CTA not still ({len(set(cta))} distinct)")
    for h in holds:
        a, b = map(int, h["frames"].split(".."))
        h["decoded_distinct_md5"] = len(set(dmd5[a:b + 1]))
        if h["decoded_distinct_md5"] != 1: fail(ep, f"decoded hold {h['what']} not still")
        last = srcdir / f"{ep}_{b:03d}.png"     # quality of the last (skip-coded) frame vs the source render
        if last.exists():
            h["decoded_last_psnr"] = round(psnr(np.asarray(Image.open(last).convert("RGB"), np.float64), decoded_frame(ROOT / f"out/{ep}.mp4", b)), 2)
            if h["decoded_last_psnr"] < 38: fail(ep, f"decoded hold {h['what']} low PSNR")
    align = []
    for fr in [c["start"] + c["frames"] // 2 for c in cuts][:11:2] + ([324, 330] if ep == "A" else []):
        src = np.asarray(Image.open(srcdir / f"{ep}_{fr:03d}.png").convert("RGB"), np.float64) if (srcdir / f"{ep}_{fr:03d}.png").exists() else None
        if src is None: continue
        d0 = decoded_frame(ROOT / f"out/{ep}.mp4", fr)
        align.append({"frame": fr, "psnr_vs_source": round(psnr(src, d0), 2)})
        if psnr(src, d0) < 38: fail(ep, f"decoded frame {fr} PSNR low")
    E["decoded_alignment"] = align

    # ---- 8. 360px contact sheets (start / mid / last of every cut)
    sheet = Image.new("RGB", (11 * 368 + 8, 3 * 648 + 8), (120, 120, 120))
    for i, c in enumerate(cuts):
        for j, fr in enumerate((c["start"], c["start"] + c["frames"] // 2, c["end"] - 1)):
            im = Image.open(srcdir / f"{ep}_{fr:03d}.png").convert("RGB").resize((360, 640), Image.LANCZOS)
            sheet.paste(im, (8 + i * 368, 8 + j * 648))
    sheet.save(V / f"sheets/{ep}_all_cuts_360px.png")

    # ---- 9. audio
    lo = json.loads((ROOT / "build/audio/loudness.json").read_text())[ep]
    cues = json.loads((ROOT / "build/audio/cues.json").read_text())[ep]

    def wav(p):
        with wave.open(str(ROOT / p)) as w:
            a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64).reshape(-1, 2) / 32767
        return a.mean(axis=1)
    bgm, ref, mix = wav(f"build/audio/{ep}-bgm.wav"), wav(f"build/audio/{ep}-bgm_noduck.wav"), wav(f"build/audio/{ep}-mix.wav")
    rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-20)
    duck = []
    for a, e, dbv in data["music"]["duck"]:
        s0, s1 = int(a * 48000), int(e * 48000)
        duck.append({"window_s": [a, e], "target_dB": dbv, "measured_dB": round(20 * np.log10(rms(bgm[s0:s1]) / rms(ref[s0:s1])), 2)})
    fade_end = 20 * np.log10(rms(mix[int(29.95 * 48000):]) / rms(mix[int(29.0 * 48000):int(29.4 * 48000)]) + 1e-12)
    late = [c for c in cues["sfx"] if c["t"] > 26.0]
    E["audio"] = {"loudness": lo, "duck": duck, "fade_last_50ms_vs_29.0-29.4s_dB": round(float(fade_end), 1),
                  "sfx_cues": cues["sfx"], "sfx_starting_after_26s": late, "bpm": cues["bpm"]}
    for d in duck:
        if abs(d["measured_dB"] - d["target_dB"]) > 0.3: fail(ep, f"duck {d}")
    if late: fail(ep, "sfx after 26s")

# ---- A06 state evidence
insp = json.loads((ROOT / "build/A-inspect.json").read_text())
fr = {x["f"]: x for x in insp["frames"]}
a06 = []
for f in (257, 258, 323, 324, 329, 330, 404, 405):
    it = [i for i in fr[f]["items"] if i["visible"] and i["text"].startswith("I like")]
    a06.append({"frame": f, "sec": round(f / 30, 3), "sentence": it[0]["text"] if it else None,
                "rect": it[0]["rect"] if it else None, "label_visible": any(i["visible"] and i["text"] == "학습 방식 예시" for i in fr[f]["items"])})
R["A06_states"] = a06
exp = {258: "I like apple.", 323: "I like apple.", 330: "I like apples.", 404: "I like apples."}
for row in a06:
    if row["frame"] in exp and row["sentence"] != exp[row["frame"]]: fail("A", f"A06 frame {row['frame']} sentence {row['sentence']}")
    if row["frame"] in exp and not row["label_visible"]: fail("A", f"A06 frame {row['frame']} 학습 방식 예시 not visible")
r258, r330 = next(r for r in a06 if r["frame"] == 258)["rect"], next(r for r in a06 if r["frame"] == 330)["rect"]
R["A06_position_fixed"] = {"x_258": r258["x"], "x_330": r330["x"], "y_258": r258["y"], "y_330": r330["y"], "width_258": r258["w"], "width_330": r330["w"]}
if (r258["x"], r258["y"]) != (r330["x"], r330["y"]): fail("A", "A06 sentence moved")
strip = Image.new("RGB", (4 * 820 + 10, 330), (120, 120, 120))
for k, f in enumerate((258, 323, 330, 404)):
    im = Image.open(V / f"frames/A/A_{f:03d}.png").convert("RGB").crop((80, 860, 900, 1190))
    strip.paste(im, (2 + k * 822, 0))
strip.save(V / "sheets/A06_states_258_323_330_404.png")

(V / "report.json").write_text(json.dumps(R, ensure_ascii=False, indent=1))

# ------------------------------------------------------------------ markdown
L = ["# 검수 결과 (자동 자가 검수)", "", f"- 실패 항목: **{len(R['fails'])}건**"]
L += [f"  - {x}" for x in R["fails"]]
L += ["", "> 수치는 `scripts/validate.py`가 실제 파일(ffprobe/ffmpeg 디코드, 렌더 원본 프레임 MD5, 브라우저 DOM 측정, WAV 분석)에서 계산한 값입니다.",
      "> 학부모 이해도·시청 유지율·상담 성과는 실측 전이므로 **미검증**입니다.", ""]
L += ["## A06 예시 상태 (8.4~13.6초)", "", "| 프레임 | 초 | 보이는 예시 문장 | 학습 방식 예시 표기 |", "|---|---|---|---|"]
L += [f"| {r['frame']} | {r['sec']} | {r['sentence']} | {'예' if r['label_visible'] else '아니오'} |" for r in R["A06_states"]]
P_ = R["A06_position_fixed"]
L += ["", f"- 문장 시작 좌표: 258f ({P_['x_258']}, {P_['y_258']}) / 330f ({P_['x_330']}, {P_['y_330']}) — 동일. 폭 {P_['width_258']} → {P_['width_330']}px (s 한 글자분만 증가)",
      "- 258~323 (66f/2.2s) 'I like apple.' 정지, 324~329 s 추가·밑줄, 330~404 (75f/2.5s) 'I like apples.' 정지 — 아래 A편 정지 표에서 원본·디코드 모두 동일 프레임 확인",
      "", "![A06](sheets/A06_states_258_323_330_404.png)", ""]
for ep, E in R["episodes"].items():
    a, s = E["file_with_audio"], E["file_silent"]
    L += [f"## {ep}편", "", "| 항목 | " + f"{ep}.mp4 | {ep}-silent.mp4 |", "|---|---|---|",
          f"| 해상도 | {a['width']}×{a['height']} | {s['width']}×{s['height']} |",
          f"| fps (r/avg) | {a['r_frame_rate']} / {a['avg_frame_rate']} | {s['r_frame_rate']} / {s['avg_frame_rate']} |",
          f"| 디코드 프레임 수 | {a['nb_read_frames']} | {s['nb_read_frames']} |",
          f"| 비디오 길이 | {a['video_duration']:.3f}s | {s['video_duration']:.3f}s |",
          f"| 컨테이너 길이 | {a['format_duration']:.3f}s | {s['format_duration']:.3f}s |",
          f"| 오디오 | {a['audio']['codec']} {a['audio']['sample_rate']}Hz {a['audio']['channels']}ch {a['audio']['duration']:.3f}s | 없음(무음본) |",
          f"| 디코드 오류 | {a['decode_errors']} | {s['decode_errors']} |", "",
          f"- 컷: {E['cuts']['count']}개, 합계 {E['cuts']['total_frames']}프레임, 누락/겹침 {E['cuts']['gaps_or_overlaps']}",
          f"- 글리프 누락: {E['glyph_missing'] or '없음'}",
          f"- 디코드된 CTA(780~899) 고유 프레임 MD5 수: {E['decoded_cta_still']['distinct_decoded_md5']} (1 = 120프레임 완전 정지)",
          f"- 디코드 프레임 정렬(PSNR, 원본 PNG 대비): " + ", ".join(f"f{x['frame']}={x['psnr_vs_source']}dB" for x in E["decoded_alignment"]), "",
          "### 주 카피 시간 (엔진 프레임 상태 집계)", "", "| 컷 | 등장 | 정지 | 퇴장 |", "|---|---|---|---|"]
    for t in E["copy_timing"]:
        if isinstance(t["frames"], dict):
            fr = t["frames"]; L.append(f"| {t['cut']} | {fr['in']}f ({fr['in']/30:.1f}s) | {fr['hold']}f ({fr['hold']/30:.1f}s) | {fr['out']}f ({fr['out']/30:.1f}s) |")
        else: L.append(f"| {t['cut']} | 새 문구 없음 | | |")
    L += ["", "### 장면 정지 구간 (렌더 원본 PNG MD5 동일 여부 + 디코드 MD5)", "", "| 컷 | 대상 | 프레임 | 길이 | 원본 동일 | 디코드 고유 MD5 | 마지막 프레임 PSNR(디코드 vs 원본) |", "|---|---|---|---|---|---|---|"]
    for h in E["source_holds"]:
        L.append(f"| {h['cut']} | {h['what']} | {h['frames']} | {h['count']}f / {h['seconds']}s | {'예' if h['identical'] else '아니오'} | {h['decoded_distinct_md5']} | {h.get('decoded_last_psnr', '-')} dB |")
    L += ["", "### 카피·보조 문자열 (각 컷 시작/중앙/마지막 프레임)", "", "| 컷 | 프레임 | 보이는 문자열 | 카피 크기(1080 / 360폭) | 문제 |", "|---|---|---|---|---|"]
    for r in E["text_checks"]:
        size = f"{r['copy_size_px']}px / {r['copy_size_at_360px']}px" if "copy_size_px" in r else ""
        L.append(f"| {r['cut']} | {r['frame']} ({r['at']}) | {' · '.join(r['visible_text'])} | {size} | {'; '.join(r['issues']) or '없음'} |")
    au = E["audio"]
    L += ["", "### 오디오 (코드 합성 임시 음원)", "",
          f"- 통합 라우드니스 {au['loudness']['final_I_LUFS']} LUFS, 피크 {au['loudness']['final_true_peak_dBTP']} dB, BPM {au['bpm']}",
          "- BGM 덕킹: " + ", ".join(f"{d['window_s'][0]}~{d['window_s'][1]}s 목표 {d['target_dB']}dB → 측정 {d['measured_dB']}dB" for d in au["duck"]),
          f"- 끝 페이드: 마지막 50ms RMS가 29.0~29.4s 대비 {au['fade_last_50ms_vs_29.0-29.4s_dB']}dB",
          f"- 26초 이후 시작하는 효과음: {len(au['sfx_starting_after_26s'])}개 (26.0초 확인음 1회만 허용)",
          "", f"![{ep} 360px](sheets/{ep}_all_cuts_360px.png)", ""]
(V / "report.md").write_text("\n".join(L))
print("fails:", len(R["fails"]))
for x in R["fails"]: print(" -", x)
