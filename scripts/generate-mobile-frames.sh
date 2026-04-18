#!/usr/bin/env bash
# Generates the mobile-optimised assets used by the homepage:
#
#   1. public/frames/frame-*.webp        — 61 WebP scroll frames at 1280x720
#                                          (consumed by components/home/VideoScrollSection.tsx)
#   2. public/todoai-hero-mobile.mp4     — 720p H.264 hero loop
#                                          (consumed by components/home/BackgroundVideo.tsx)
#
# Re-run this whenever the source masters change:
#   - public/paint-scroll.mp4
#   - public/todoai-video-1776109340881.mp4
#
# Frames use a two-stage pipeline because Homebrew's stock ffmpeg ships without libwebp:
#   ffmpeg -> high-quality PNGs in a temp dir, then sharp (Node) -> WebP quality 78.
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install with: brew install ffmpeg" >&2
  exit 1
fi

if [ ! -d node_modules/sharp ]; then
  echo "sharp not found in node_modules. Run: npm install" >&2
  exit 1
fi

# ── 1. WebP scroll frames ────────────────────────────────────────────────────
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

rm -f public/frames/frame-*.jpg public/frames/frame-*.webp
mkdir -p public/frames

ffmpeg -y -loglevel error -i public/paint-scroll.mp4 \
  -vf "select='not(mod(n\,2))',scale=1280:720:flags=lanczos" \
  -fps_mode vfr \
  "$TMPDIR/frame-%04d.png"

node scripts/encode-webp-frames.mjs "$TMPDIR" public/frames

echo "Frames: $(ls public/frames/frame-*.webp | wc -l | tr -d ' ') generated, total $(du -sh public/frames | cut -f1)"

# ── 2. Mobile hero video ─────────────────────────────────────────────────────
# 1280x720 H.264 main profile, CRF 23, audio stripped (component plays muted).
# +faststart moves the moov atom to the front so playback can begin while
# the file is still streaming — important for autoplay-on-scroll feel.
ffmpeg -y -loglevel error \
  -i public/todoai-video-1776109340881.mp4 \
  -vf "scale=1280:720:flags=lanczos" \
  -c:v libx264 -profile:v main -level 4.0 -preset slow -crf 23 \
  -pix_fmt yuv420p -movflags +faststart -an \
  public/todoai-hero-mobile.mp4

echo "Hero:   $(du -sh public/todoai-hero-mobile.mp4 | cut -f1) at 1280x720"
