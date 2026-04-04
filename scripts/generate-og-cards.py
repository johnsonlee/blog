#!/usr/bin/env python3
"""Generate OG card images for blog posts.

Usage: python3 generate-og-cards.py <source_dir> <output_dir>

Reads all markdown files in source_dir/_posts/, generates a 600x600 square card
image for each post, and saves to output_dir/{slug}.png.

Only regenerates if the post is newer than the existing image.
"""

import os
import sys
import re
import hashlib
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

def category_color(name):
    """Generate a stable, visually distinct color from category name."""
    if not name:
        return '#37474F'
    h = int(hashlib.md5(name.encode()).hexdigest()[:8], 16)
    hue = h % 360
    saturation = 55 + (h >> 12) % 25  # 55-79%
    lightness = 45 + (h >> 20) % 15   # 45-59%
    # HSL to RGB
    s, l = saturation / 100, lightness / 100
    c = (1 - abs(2 * l - 1)) * s
    x = c * (1 - abs((hue / 60) % 2 - 1))
    m = l - c / 2
    if hue < 60:    r, g, b = c, x, 0
    elif hue < 120: r, g, b = x, c, 0
    elif hue < 180: r, g, b = 0, c, x
    elif hue < 240: r, g, b = 0, x, c
    elif hue < 300: r, g, b = x, 0, c
    else:           r, g, b = c, 0, x
    return '#{:02x}{:02x}{:02x}'.format(
        int((r + m) * 255), int((g + m) * 255), int((b + m) * 255)
    )

SIZE = 600
FONT_PATH = '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc'
SITE_NAME = 'Johnson Lee'


def parse_frontmatter(filepath):
    """Extract title and first category from markdown frontmatter."""
    text = filepath.read_text(encoding='utf-8')
    m = re.match(r'^---\s*\n(.*?)\n---', text, re.DOTALL)
    if not m:
        return None, None

    fm = m.group(1)

    # title
    title_m = re.search(r'^title:\s*(.+)$', fm, re.MULTILINE)
    title = title_m.group(1).strip().strip('"').strip("'") if title_m else None

    # first category
    cat_m = re.search(r'categories:\s*\n\s*-\s*(.+)', fm)
    category = cat_m.group(1).strip() if cat_m else None

    return title, category


def wrap_text(draw, text, font, max_width):
    """Wrap text to fit within max_width, return list of lines."""
    lines = []
    current = ''
    for ch in text:
        test = current + ch
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] > max_width:
            if current:
                lines.append(current)
            current = ch
        else:
            current = test
    if current:
        lines.append(current)
    return lines


def generate_card(title, category, output_path):
    """Generate a single OG card image."""
    accent = category_color(category)

    img = Image.new('RGB', (SIZE, SIZE), '#1a1a2e')
    draw = ImageDraw.Draw(img)

    # Accent bar on left
    draw.rectangle([0, 0, 6, SIZE], fill=accent)

    # Category label
    font_cat = ImageFont.truetype(FONT_PATH, 22)
    if category:
        draw.text((40, 36), category.upper(), fill=accent, font=font_cat)

    # Title
    font_title = ImageFont.truetype(FONT_PATH, 42)
    lines = wrap_text(draw, title, font_title, SIZE - 80)
    lines = lines[:5]

    y = 80
    for line in lines:
        draw.text((40, y), line, fill='#EEEEEE', font=font_title)
        y += 54

    # Bottom: site name
    font_site = ImageFont.truetype(FONT_PATH, 18)
    draw.text((40, SIZE - 52), f'>_ {SITE_NAME}', fill='#666666', font=font_site)

    # Bottom accent line
    draw.rectangle([40, SIZE - 22, 150, SIZE - 18], fill=accent)

    img.save(output_path, 'PNG', optimize=True)


def main():
    source_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)

    posts_dir = source_dir / '_posts'
    if not posts_dir.exists():
        print('No _posts directory found')
        return

    count = 0
    skipped = 0

    for md in sorted(posts_dir.glob('*.md')):
        slug = md.stem
        out_path = output_dir / f'{slug}.png'

        # Skip if image is newer than source
        if out_path.exists() and out_path.stat().st_mtime >= md.stat().st_mtime:
            skipped += 1
            continue

        title, category = parse_frontmatter(md)
        if not title:
            continue

        generate_card(title, category, out_path)
        count += 1

    print(f'OG cards: {count} generated, {skipped} skipped (up to date)')


if __name__ == '__main__':
    main()
