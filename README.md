# Collin Services – website

Next.js 16 + Tailwind CSS 4 + GSAP + Lenis. The front page opens with an animated logo reveal; the car section sweeps a light beam and glints over a real photo (public/car) as you scroll.

## Deploy to Vercel

1. Create a new GitHub repository and upload this folder (everything except `node_modules`).
2. Go to vercel.com → **Add New → Project** → import the repository.
3. Vercel detects Next.js automatically. Click **Deploy**. No settings needed.
4. Later: **Settings → Domains** to connect e.g. `collinservices.fi`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Where to edit things

| What | File |
| --- | --- |
| Phone, WhatsApp number | `content/site.ts` |
| Logo (C + water drop) | `components/LogoMark.tsx`, favicon `app/icon.svg` |
| Services and prices (incl. per car size) | `content/site.ts` |
| All text, Finnish + English | `content/i18n.ts` |
| Photos (before/after, gallery, about) | put files in `public/images/`, set paths in `content/media.ts` |

### Prices by car size
Each service has `small`, `medium`, `large`. Right now only `small` (the “from” price) is set. When every service has all three filled in, a **Pieni / Keskikokoinen / Iso** switch appears automatically above the price list.
