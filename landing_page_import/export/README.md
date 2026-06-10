# Amplefi Landing — Style Reference

Visual reference for wiring the new design into your React app.

## Files
- `Amplefi Landing Page.html` — the canonical design file. Open in any browser.
- `assets/amplefi-water.jpeg` — hero background image.
- `assets/amplefi-logo-ink.png` — dark-ink version of the signature logo (header/footer use).
- `assets/amplefi-logo.png` — original transparent logo.

## Design tokens

```css
--paper:   #F3F1EC;   /* warm off-white background */
--paper-2: #EAE7E0;
--ink:     #16140F;   /* near-black, warm */
--ink-2:   #2A2622;
--mute:    #7A746B;
--mute-2:  #A8A299;
--line:    rgba(22,20,15,0.14);
--line-2:  rgba(22,20,15,0.08);
```

## Type stack
- **Sans (display + body):** `Geist`, weights 300/400/500/600
- **Serif accent (italics only):** `Instrument Serif`
- **Mono (labels):** `Geist Mono`

Loaded via Google Fonts:
```
https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap
```

## Section map → React components
| Section in HTML | Maps to component |
|---|---|
| `<nav class="top">` | `Nav.jsx` |
| `<header class="hero">` (full-bleed water bg) | `Hero.jsx` |
| `<section id="what">` | `WhatWeDo.jsx` |
| `<section id="how">` | `HowWeDoIt.jsx` |
| `<section id="why">` (compare table) | `Differentiation.jsx` |
| `<section class="stats">` (NEW — quiet stats) | optional new component |
| `<section id="contact" class="cta-final">` | `CtaBottom.jsx` |
| `<footer>` | `Footer.jsx` |

## Notes
- `Divider.jsx` is no longer needed — sections are separated by `border-top: 1px solid var(--line)` and generous padding.
- The hero is dark (water bg, light text). Buttons invert inside `.hero` — see the `.hero .btn` rules in the CSS.
- The contact modal markup + behavior in this file is a reference; keep your existing `ContactModal.jsx` logic and just port the styles.
- Numbered lists (i./ii./iii., 01–05) were intentionally removed throughout per the editorial direction.
