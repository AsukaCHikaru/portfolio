#!/usr/bin/env bash
# usage: ./batch-card-thumb.sh [source_folder] [output_folder]
set -euo pipefail

src="${1:-.}"
out="${2:-thumbs}"

mkdir -p "$out"

shopt -s nullglob nocaseglob
for f in "$src"/*.jpg "$src"/*.jpeg "$src"/*.png "$src"/*.webp "$src"/*.avif; do
  [ -e "$f" ] || continue

  filename="$(basename "$f")"
  base="${filename%.*}"
  outfile="$out/${base}.webp"

  ffmpeg -y -i "$f" \
    -vf "scale=320:320:force_original_aspect_ratio=increase,crop=320:320" \
    -c:v libwebp -q:v 90 \
    "$outfile"

  echo "Wrote $outfile"
done
shopt -u nocaseglob
