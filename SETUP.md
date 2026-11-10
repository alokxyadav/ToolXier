> **Fast path:** see [PUBLISHING.md](PUBLISHING.md) — `npm run verify` to check locally, `npm run ship -- <repo-url>` to push everything in one command.

# ToolXier — Setup Guide

## 1. Prerequisites
- Node.js **20.19+ or 22.12+** (required by Vite 8) — check with `node -v`
- Git

## 2. Run locally
```bash
npm install
npm run dev          # http://localhost:5173
```

## 3. Test & build
```bash
npm test             # unit tests (Vitest)
SITE_URL=https://your-domain.com VITE_SITE_URL=https://your-domain.com npm run build   # outputs dist/ + sitemap.xml + robots.txt
npm run preview      # serve the production build locally
```
On Windows PowerShell: `$env:SITE_URL="https://your-domain.com"; npm run build`

### Real-browser audit
```bash
npm run build && npm run serve &      # production-like server on :4173
cd audit && npm install && npm run audit        # functional + responsive + offline audit
npm run lighthouse                               # Lighthouse scores
```

### Browser tests & Lighthouse
```bash
npx playwright install      # one-time browser download
npm run e2e                 # desktop, Pixel 7, iPhone 14 profiles
npm run build && npx -y @lhci/cli@0.14.0 autorun
```

## 4. Merge into your existing GitHub repo
Your current repo (`alokxyadav/ToolXier`, branch `production-foundation`) is a static HTML/CSS/JS site (age, bmi, gst, compress, imageresize, qr, qrdecoder, link, todo, tictactoe, epicwatch, legal pages). This project is a Vite + React app, so migrate on a new branch and keep your old files for reference:
```bash
git clone https://github.com/alokxyadav/ToolXier && cd ToolXier
git checkout production-foundation && git checkout -b react-platform
mkdir legacy && git mv *.html *.css *.js *.mp4 *.png logo.svg frontend legacy/ 2>/dev/null   # keep your old site safe
# copy ALL files from this project into the repo root (overwrite README.md), then:
npm install && npm test && SITE_URL=https://your-domain.com VITE_SITE_URL=https://your-domain.com npm run build
git add . && git commit -m "feat: React platform with 100+ tools" && git push -u origin react-platform
```
Open a Pull Request, review, then merge. Mapping of your old pages: age → Age Calculator · bmi → BMI Calculator · gst → GST Calculator · compress/imageresize → Image Tools · qr → QR Code · qrdecoder → QR Reader · about/contact/privacy/terms/disclaimer → `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`. **Not ported:** `link`, `epicwatch`, `todo`, `tictactoe` (not reviewed / not utilities) — they stay in `legacy/` until you decide.

## 5. Deploy (pick one)
| Host | Steps |
|---|---|
| **Vercel** | Import repo → Framework: Vite → add env `SITE_URL` and `VITE_SITE_URL` → Deploy. `vercel.json` adds security headers; pre-rendered routes handle routing. |
| **Cloudflare Pages** | Build command `npm run build`, output `dist`, envs `SITE_URL` and `VITE_SITE_URL`. pre-rendered routes + `404.html` handle routing. |
| **Netlify** | Same build/output; `public/_headers` is supported. |

## 6. After deploy checklist
- [ ] Replace `YOUR-DOMAIN` in `public/robots.txt` (the build overwrites it if `SITE_URL` is set)
- [ ] Open `/sitemap.xml` and `/robots.txt`
- [ ] Submit the sitemap in Google Search Console
- [ ] Run Lighthouse; test "Add to Home Screen" on Android Chrome and iOS Safari (Share → Add to Home Screen)
- [ ] Replace the placeholder icons in `public/icon-192.png` / `icon-512.png` with your final logo

## 7. CI
`.github/workflows/ci.yml` runs tests, build and `npm audit` on every push/PR. Security headers for Cloudflare/Netlify are in `public/_headers`; Vercel uses `vercel.json`.

## 8. Troubleshooting
- **404 for a valid tool URL** → re-run `npm run build` with `SITE_URL` set; the build pre-renders every route into `dist/` and creates `404.html`. Do **not** add a catch-all SPA rewrite — it would hide real 404s.
- **`crypto.subtle` undefined** → needs HTTPS or localhost.
- **Service worker serving old files** → DevTools → Application → Unregister, or bump `C` in `public/sw.js`.
