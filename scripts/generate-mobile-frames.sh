#!/usr/bin/env bash
# Extracts 60 WebP frames at 1080x608 from public/paint-scroll.mp4 into public/frames/.
# Consumed by components/home/VideoScrollSection.tsx (mobile branch).
# Re-run this whenever paint-scroll.mp4 changes.
#
# Two-stage pipeline because Homebrew's stock ffmpeg ships without libwebp:
#   1. ffmpeg -> high-quality PNG frames in a temp dir
#   2. sharp (Node)  -> WebP at quality 78 in public/frames/
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

TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

rm -f public/frames/frame-*.jpg public/frames/frame-*.webp
mkdir -p public/frames

ffmpeg -y -loglevel error -i public/paint-scroll.mp4 \
  -vf "select='not(mod(n\,2))',scale=1080:608:flags=lanczos" \
  -fps_mode vfr \
  "$TMPDIR/frame-%04d.png"

node scripts/encode-webp-frames.mjs "$TMPDIR" public/frames

echo "Generated $(ls public/frames/frame-*.webp | wc -l | tr -d ' ') frames, total $(du -sh public/frames | cut -f1)"
