#!/usr/bin/env python3
"""
Extract frames from mp4 → remove background with rembg → re-encode as WebM (VP9 + alpha).
Skips astrophage.mp4 (used as background overlay, transparency irrelevant).
"""

import os
import subprocess
import shutil
from rembg import new_session, remove
from PIL import Image
import io

VID_DIR = os.path.join(os.path.dirname(__file__), 'uploadsVid')

VIDEOS = [
    ('rockyHeroVid.mp4',      'rockyHeroVid.webm',      24),
    ('rockyPointingVid.mp4',  'rockyPointingVid.webm',  24),
    ('RockyEatingVid.mp4',    'RockyEatingVid.webm',    24),
]

# Create one shared session (downloads model once)
print("Loading rembg model (u2net) — may download on first run...")
session = new_session('u2net')
print("Model ready.\n")

for src_name, dst_name, fps in VIDEOS:
    src = os.path.join(VID_DIR, src_name)
    dst = os.path.join(VID_DIR, dst_name)
    frames_dir = os.path.join(VID_DIR, f'_frames_{os.path.splitext(src_name)[0]}')

    print(f"── {src_name} ──────────────────────────────")

    # 1. Extract frames
    os.makedirs(frames_dir, exist_ok=True)
    subprocess.run([
        'ffmpeg', '-y', '-i', src,
        '-vf', f'fps={fps}',
        os.path.join(frames_dir, 'frame_%04d.png')
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    frames = sorted(f for f in os.listdir(frames_dir) if f.endswith('.png'))
    total = len(frames)
    print(f"  Extracted {total} frames")

    # 2. Remove background from each frame
    for i, fname in enumerate(frames, 1):
        fpath = os.path.join(frames_dir, fname)
        with open(fpath, 'rb') as f:
            data = f.read()
        result = remove(data, session=session)
        with open(fpath, 'wb') as f:
            f.write(result)
        if i % 10 == 0 or i == total:
            print(f"  BG removed: {i}/{total}", flush=True)

    # 3. Re-encode to WebM VP9 with alpha channel
    subprocess.run([
        'ffmpeg', '-y',
        '-framerate', str(fps),
        '-i', os.path.join(frames_dir, 'frame_%04d.png'),
        '-c:v', 'libvpx-vp9',
        '-pix_fmt', 'yuva420p',
        '-b:v', '0', '-crf', '30',
        '-auto-alt-ref', '0',
        dst
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    print(f"  Encoded → {dst_name}")

    # 4. Clean up temp frames
    shutil.rmtree(frames_dir)
    print(f"  Cleaned up frames\n")

print("All done! WebM files with transparent backgrounds created.")
