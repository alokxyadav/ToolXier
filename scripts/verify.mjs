// One command local check: tests → production build → serve like a real host → check every URL, 404, PWA files. Usage: npm run verify
import { spawn, spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
const PORT = 4399, O = `http://localhost:${PORT}`, win = process.platform === 'win32'
const sh = (a, env = {}) => spawnSync('npm', a, { stdio: 'inherit', shell: win, env: { ...process.env, ...env } }).status === 0
const bad = [], ok = m => console.log('  ✔', m), fail = m => { bad.push(m); console.log('  ✘', m) }
console.log('\n[1/4] Unit + page-render tests'); if (!sh(['test'])) { console.log('\n✘ Tests failed.'); process.exit(1) }
console.log('\n[2/4] Production build'); if (!sh(['run', 'build'], { SITE_URL: O, VITE_SITE_URL: O })) { console.log('\n✘ Build failed.'); process.exit(1) }
console.log('\n[3/4] Starting a production-like server on ' + O)
const srv = spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' })
try {
  for (let i = 0; i < 50; i++) { try { await fetch(O); break } catch { await new Promise(r => setTimeout(r, 100)) } }
  console.log('\n[4/4] Checking every page'); const paths = [...readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)].map(m => m[1]); let n = 0
  for (const p of paths) { const r = await fetch(O + p), h = await r.text()
    if (r.status !== 200) fail(`${p} → HTTP ${r.status}`); else if (!/<title>[^<]{5,}<\/title>/.test(h)) fail(`${p} → missing <title>`); else if (p !== '/' && !h.includes('rel="canonical"')) fail(`${p} → missing canonical`); else if (p !== '/' && !h.includes('<noscript>') && !/^\/(api-tester|image-tools|qr-code|qr-reader|markdown-preview|css-layout|favicon-generator)$/.test(p)) fail(`${p} → missing no-JS content`); else n++ }
  n === paths.length ? ok(`${n} pages: HTTP 200, title, canonical, crawlable content`) : null
  const nf = await fetch(O + '/this/page/does/not/exist'); nf.status === 404 ? ok('unknown URL returns a real 404') : fail('unknown URL returned ' + nf.status)
  for (const f of ['/sw.js', '/manifest.webmanifest', '/robots.txt', '/sitemap.xml', '/icon-192.png', '/icon-512.png', '/favicon.svg']) (await fetch(O + f)).status === 200 ? ok(f) : fail(f + ' missing')
} finally { srv.kill() }
if (bad.length) { console.log(`\n✘ ${bad.length} problem(s):\n` + bad.join('\n')); process.exit(1) }
console.log('\n✔ ALL CHECKS PASSED. To look at it yourself:  npm run serve   then open http://localhost:4173\n  (optional real-browser audit: cd audit && npm install && npm run audit)')
