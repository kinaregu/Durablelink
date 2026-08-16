# Durablelink Prints and Brands — Website

A fully static, ready-to-deploy rebuild of https://durablelink.abacusai.app with the **new logo** (from `logo brand.png`). Everything else — design, colors, content, and pages — was kept as it was.

## What was changed

| Item | Change |
|---|---|
| Header logo (all pages) | Replaced the old SVG mark + text with the provided logo image |
| Login page logo | Replaced with the same new logo (larger size) |
| Favicon | Generated from the new logo |
| Social share image (`og-image.png`) | Rebuilt with the new logo on the brand navy background |
| Everything else | Unchanged (design, navy `#0A2472` / yellow `#F5C300` theme, Poppins font, content, images) |

## How to run / deploy

This is a plain static website — **no build step, no server code needed**.

- **Locally:** open `index.html`, or run a tiny server: `python3 -m http.server 8000` and visit `http://localhost:8000`
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop the folder (or connect a repo) — deploy as-is
- **GitHub Pages:** push the folder contents to a repo — done
- **Any shared hosting / cPanel:** upload the folder contents to `public_html`

Upload **everything** (the `.html` files plus the `assets/` folder).

## Pages included

`index.html` · `services.html` · `shop.html` · `quote.html` · `portfolio.html` · `about.html` · `contact.html` · `login.html` · `cart.html`

## How the site works (static equivalents)

The original site was a hosted app with a backend. In this static version, the same features are provided with browser-side equivalents:

- **Shop** — the real 16-product catalog is rendered statically; category filters, search, and Add to Cart work. The cart is stored in the visitor's browser.
- **Cart / Checkout** — items, quantities, and totals work; "Proceed to Checkout via WhatsApp" sends the order summary to +211 922 266 621.
- **Quote & Contact forms** — submissions open WhatsApp (+211 922 266 621) with the filled-in details pre-loaded.
- **Portfolio filters, mobile menu, scroll animations, stat counters** — all preserved.
- **Login** — kept as a page for completeness; account sign-in needs the hosted backend, so the form shows a notice instead.
- The original AI chat widget script is kept (loads from apps.abacus.ai).

## Small notes

- `og:image` is a relative path (`assets/og-image.png`). After deploying, you can change it to an absolute URL (e.g. `https://yourdomain.com/assets/og-image.png`) in the `<head>` of each page for social sharing previews.
- To change the logo later, replace `assets/brand/logo-header.png` (420 px wide) and `assets/brand/logo.png` (full resolution).
