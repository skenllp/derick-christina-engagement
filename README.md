# Derick Mathew & Christina Cherian — Engagement Invitation

Five-section invitation: `index.html`, `style.css`, `script.js`, `assets/`. No build step.

## Sections and backgrounds
1. Opening screen (`.opening`) – `assets/opening-bg.webp` – "Open Invitation" fades into the invitation in 1.1s
2. Verse, parents, couple names (`.panel--family`) – `assets/family-bg.webp`
3. Engagement ceremony (`.panel--ceremony`) – `assets/ceremony-bg.webp`
4. Reception (`.panel--reception`) – `assets/reception-bg.webp`
5. Closing (`.panel--closing`) – `assets/closing-bg.webp`

Each section is a 9:16 box matching its 941x1672 image, so artwork is never stretched or cropped.
Type is sized in `cqw` (relative to the section width) so layout is identical at 360px, 430px and desktop.
To swap an image, keep the same 9:16 proportions and file name.

## Social preview (Open Graph)
`assets/og-image.jpg` (1200x630) is included. Social apps need an absolute URL, so after hosting
change `content="assets/og-image.jpg"` in `index.html` to `https://YOUR-DOMAIN/assets/og-image.jpg`
and add the same for `twitter:image`.

## Preview locally
`python3 -m http.server` in this folder, then open http://localhost:8000
Fonts load from Google Fonts (fallback to system serif if offline).
