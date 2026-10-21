# Derick & Christina — Four Celebrations (v2)

Static site. Deploy the folder as-is (Vercel/Netlify). No build step.
Check the `og:image` / `twitter:image` URLs in `index.html` match your live domain.

## Look
Ivory paper page, muted stationery suite: burgundy, olive, sage-cream, mauve, thin champagne gold.
Cards are transparent-cornered arches with a soft baked shadow. All text is live HTML (sized in `cqw`).

## Assets (`assets/`)
- `cards/hero.webp` — cover, one image (941x1563). Also used as the "letter" in the envelope.
- `cards/<name>-top|mid|bot.webp` — each event card is a top cap, a bottom cap and a seamless middle
  strip that repeats, so a card grows taller if you add more text. Names: engagement, cocktail, madhuramveppu, wedding.
- `env-back.webp`, `env-front.webp` (lining area is transparent so the letter shows), `env-flap.webp`, `seal.webp` — envelope layers.
- `paper.webp` (seamless page texture), `damask.webp` (footer), `og-image.jpg` (link preview 1200x630), `music.mp3`.

## Editing
- Text colours per card: the `--ink / --acc / --hd / --nmc` variables on `.eng .cok .mad .wed .cover` in `style.css`.
- Where text starts/ends on each card: `--pt` (below the top illustration) and `--pb` (above the corner sprigs).
- Replacing a card's artwork: keep the same arch shape and keep the top illustration within the first ~640px
  and the corner sprigs within the last ~300px (at 941px width), then re-slice into top / mid / bot.
- RSVP posts to the Google Apps Script URL in `rsvp.js` (see `google-sheet/`). Event keys are unchanged.
