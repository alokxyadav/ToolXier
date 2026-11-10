# Publishing ToolXier — the one-time, safe way

Goal: get this project onto <https://github.com/alokxyadav/ToolXier> **in one command**, without losing your existing site, then deploy it.

## 0. What you need (one-time)
| Tool | Check | Get it |
|---|---|---|
| Node.js **20.19+ / 22.12+** | `node -v` | <https://nodejs.org> (LTS) |
| Git | `git --version` | <https://git-scm.com> |
| Git identity | `git config user.name` | `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"` |
| GitHub login | — | Git opens a browser sign-in on first push (Git Credential Manager), or use a [Personal Access Token](https://github.com/settings/tokens) as the password |

## 1. Unzip and check it locally (≈ 2 minutes)
```bash
unzip toolxier.zip && cd toolxier      # Windows: right-click → Extract All, then open a terminal in the folder
npm install
npm run verify
```
`npm run verify` runs all 199 tests, builds for production, starts a real-host-like server and checks **every one of the 125 pages** (status 200, title, canonical, crawlable content), a real 404, and the PWA files. You should end with **✔ ALL CHECKS PASSED**.

Look at it yourself: `npm run serve` → open <http://localhost:4173> (or `npm run dev` for live editing at :5173).
Try: <kbd>Ctrl/⌘+K</kbd>, a few tools, the dashboard sidebar, Dark mode, then turn off Wi-Fi and reload (offline works after the first visit).

## 2. Push everything in ONE command
```bash
npm run ship -- https://github.com/alokxyadav/ToolXier --site https://YOUR-DOMAIN
```
(Leave out `--site` if you don't have a domain yet.) It will:
1. clone your repo into a temporary folder,
2. create a **new branch** `react-platform` from `production-foundation`,
3. move your existing files into `legacy/` (history kept — nothing is deleted),
4. add ToolXier, run `npm ci`, **all tests and a production build** (it aborts before pushing if anything fails),
5. commit and `git push -u origin react-platform`,
6. print the link to open a Pull Request.

Options: `--base <branch>` (default `production-foundation`) · `--branch <name>` (default `react-platform`) · `--dry-run` (do everything except push, prints where to review).
Your existing branches are never modified, so it is safe to try. Recommended first run: add `--dry-run`.

## 3. Merge and configure GitHub (5 minutes)
1. Open the Pull Request link → review → **Merge** (or make `react-platform` the default branch in *Settings → Branches*).
2. *Settings → Security → Code security*: enable **Private vulnerability reporting** (the Code of Conduct and SECURITY.md rely on it).
3. *Settings → General*: add the description and topics: `developer-tools`, `json-formatter`, `jwt-decoder`, `react`, `vite`, `pwa`, `open-source`.
4. *Actions* tab: confirm the **CI** workflow ran green (the README badge then turns green). *Insights → Dependency graph → Dependabot* is already configured.
5. Optional: *Settings → Branches → Add rule* for `main`: require the **CI** check before merging.

## 4. Deploy (pick one — all free tiers work)
Set these two environment variables on the host to your real public URL: `SITE_URL` and `VITE_SITE_URL` (e.g. `https://toolxier.example`).
| Host | Steps |
|---|---|
| **Cloudflare Pages** | Connect repo → Build command `npm run build` → Output `dist` → add the 2 env vars |
| **Vercel** | Import repo → Framework *Vite* → add the 2 env vars |
| **Netlify** | Import repo → Build `npm run build` → Publish `dist` → add the 2 env vars |

Do **not** add a "redirect all to index.html" rule — the build already pre-renders every page and `404.html` (this gives real 404 status codes and better SEO).

After deploying: open `/sitemap.xml` and `/robots.txt`, submit the sitemap in **Google Search Console** and **Bing Webmaster Tools**, run Lighthouse on your live URL, and test "Add to Home Screen" on your own Android phone and iPhone.

## 5. Final pre-launch checklist
- [ ] `npm run verify` passed · [ ] CI is green · [ ] real-device check (Android Chrome + iPhone Safari)
- [ ] Replace placeholder icons `public/icon-192.png`, `public/icon-512.png`, `public/favicon.svg` with your logo
- [ ] Confirm the license in `LICENSE` (MIT by default) · [ ] `SITE_URL` / `VITE_SITE_URL` set on the host
- [ ] Optional: `cd audit && npm install && npm run audit && npm run lighthouse` (real-browser audit)

## Troubleshooting
| Problem | Fix |
|---|---|
| `Author identity unknown` | Run the two `git config --global` commands from step 0, then re-run `npm run ship` |
| `Authentication failed` / `403` | Sign in when the browser opens, or use a Personal Access Token (scope: `repo`) as the password. Make sure you own or can push to the repo |
| `remote: Permission denied` | You are not a collaborator on that repo — fork it and use your fork's URL |
| `! [rejected] react-platform` | The branch already exists remotely — use `--branch react-platform-2` |
| `npm ci` / Vite errors about Node | Upgrade Node to 20.19+ or 22.12+ (`node -v`) |
| Port 4399/4173 busy | Close the other server, or set `PORT=4500` before `npm run serve` |
| Tests fail after you edit | Run `npm test` and read the first failing test name; it tells you which tool/page broke |

### Manual alternative (if you prefer plain git)
```bash
git clone https://github.com/alokxyadav/ToolXier && cd ToolXier
git checkout production-foundation && git checkout -b react-platform
mkdir legacy && git ls-tree --name-only HEAD | grep -v -x -e legacy -e .github | xargs -I{} git mv {} legacy/{}
# copy the contents of the toolxier folder (not the folder itself) into this repo, then:
npm install && npm test && npm run build
git add -A && git commit -m "feat: ToolXier React platform" && git push -u origin react-platform
```
