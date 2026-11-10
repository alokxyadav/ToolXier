// Real-browser audit of the production build (Chromium via @sparticuz/chromium; no browser download needed).
// Usage: npm run build && npm run serve   (in one terminal)   |   cd audit && npm i && npm run audit   (in another)
import chromium from '@sparticuz/chromium'; import puppeteer from 'puppeteer-core'; import { readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const QR = join(tmpdir(), 'toolxier-qr.png')
const O = process.env.ORIGIN || 'http://localhost:4173', fails = [], titles = new Map()
const urls = [...readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8').matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)].map(m => m[1])
const b = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: 'shell' })
const F = (u, m) => fails.push(`${u}: ${m}`)
async function page(vp) { const p = await b.newPage(); await p.setViewport(vp); const errs = []
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) }); p.on('pageerror', e => errs.push('pageerror ' + e.message)); p.on('requestfailed', r => errs.push('reqfail ' + r.url())); p._errs = errs; return p }
// 1) every URL on a phone
const mob = await page({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
for (const u of urls) { mob._errs.length = 0
  const r = await mob.goto(O + u, { waitUntil: 'networkidle0', timeout: 20000 }).catch(e => (F(u, 'goto ' + e.message), null)); if (!r) continue
  if (r.status() !== 200) F(u, 'status ' + r.status())
  const i = await mob.evaluate(() => ({ h1: document.querySelectorAll('h1').length, title: document.title, canon: document.querySelector('link[rel=canonical]')?.href || '', over: document.documentElement.scrollWidth - window.innerWidth,
    unl: [...document.querySelectorAll('input:not([type=hidden]),textarea,select')].filter(e => !(e.labels?.length || e.getAttribute('aria-label') || e.getAttribute('aria-labelledby'))).length,
    nob: [...document.querySelectorAll('button,a')].filter(e => !(e.textContent.trim() || e.getAttribute('aria-label'))).length, noalt: [...document.querySelectorAll('img:not([alt])')].length, small: [...document.querySelectorAll('button')].filter(e => e.offsetHeight && e.offsetHeight < 32).length }))
  if (i.h1 !== 1) F(u, 'h1 count ' + i.h1); if (i.over > 0) F(u, 'horizontal overflow ' + i.over + 'px'); if (!i.title) F(u, 'no title'); if (u !== '/' && !i.canon.endsWith(u)) F(u, 'canonical ' + i.canon)
  if (i.unl) F(u, i.unl + ' unlabeled fields'); if (i.nob) F(u, i.nob + ' nameless buttons/links'); if (i.noalt) F(u, 'img without alt'); if (i.small) F(u, i.small + ' small touch targets')
  if (titles.has(i.title)) F(u, 'duplicate title with ' + titles.get(i.title)); titles.set(i.title, u); if (mob._errs.length) F(u, 'console: ' + mob._errs.join(' | ').slice(0, 200)) }
// 2) other viewports
for (const [n, vp] of [['tablet', { width: 768, height: 1024 }], ['desktop', { width: 1440, height: 900 }], ['small-phone', { width: 320, height: 568, isMobile: true }]]) { const p = await page(vp)
  for (const u of ['/', '/tools/json-formatter', '/api-tester', '/image-tools', '/css-layout', '/category/calculators', '/privacy']) { await p.goto(O + u, { waitUntil: 'networkidle0' }); const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (o > 0) F(`${n} ${u}`, 'overflow ' + o) ; if (p._errs.length) F(`${n} ${u}`, 'console ' + p._errs[0]) } }
// 3) real interactions
const p = await page({ width: 390, height: 844, isMobile: true, hasTouch: true }); const chk = (c, m) => { if (!c) F('interaction', m) }
await p.goto(O + '/tools/json-formatter', { waitUntil: 'networkidle0' }); await p.type('#in', '{"a":1}'); await p.click('button.primary'); await p.waitForFunction(() => document.querySelector('#out').value.includes('"a": 1'), { timeout: 3000 }).catch(() => F('interaction', 'json formatter output')); 
await p.type('#in', '{bad'); await p.evaluate(() => document.querySelector('#in').value = ''); 
const res = await p.goto(O + '/does/not/exist'); chk(res.status() === 404, '404 status was ' + res.status())
// api tester against our own origin
await p.goto(O + '/api-tester', { waitUntil: 'networkidle0' }); await p.evaluate(() => {}); await p.$eval('#u', e => e.value = ''); await p.type('#u', O + '/robots.txt'); await p.click('button.primary'); await p.waitForFunction(() => document.body.innerText.includes('200'), { timeout: 5000 }).catch(() => F('interaction', 'api tester did not show 200'))
// QR generate -> download image -> QR reader decodes it
await p.goto(O + '/qr-code', { waitUntil: 'networkidle0' }); await p.click('button.primary'); await p.waitForSelector('img[alt="Generated QR code"]', { timeout: 5000 }).catch(() => F('interaction', 'qr image'))
const png = await p.$eval('img[alt="Generated QR code"]', e => e.src).catch(() => null)
if (png) { writeFileSync(QR, Buffer.from(png.split(',')[1], 'base64')); await p.goto(O + '/qr-reader', { waitUntil: 'networkidle0' }); await (await p.$('#qf')).uploadFile(QR); await p.waitForFunction(() => document.querySelector('pre')?.textContent.includes('github.com/alokxyadav/ToolXier'), { timeout: 5000 }).catch(() => F('interaction', 'qr reader did not decode')) 
  // image tools: upload the PNG, convert to webp
  await p.goto(O + '/image-tools', { waitUntil: 'networkidle0' }); await (await p.$('#f')).uploadFile(QR); await p.click('button.primary'); await p.waitForSelector('img[alt="Converted result preview"]', { timeout: 5000 }).catch(() => F('interaction', 'image convert'))
  await p.goto(O + '/favicon-generator', { waitUntil: 'networkidle0' }); await (await p.$('#ff')).uploadFile(QR); await p.waitForFunction(() => document.querySelectorAll('.card img').length === 6, { timeout: 5000 }).catch(() => F('interaction', 'favicon generation')) }
// markdown preview sandbox: scripts must not run
await p.goto(O + '/markdown-preview', { waitUntil: 'networkidle0' }); await p.$eval('#md', e => { e.value = '<img src=x onerror="window.top.__x=1">' }); await p.type('#md', ' '); const x = await p.evaluate(() => window.__x); chk(!x, 'XSS executed in markdown preview')
// offline PWA: visit ONLY home online, then open a never-visited tool page offline
const q = await b.newPage(); await q.goto(O + '/', { waitUntil: 'networkidle0' }); await q.evaluate(() => navigator.serviceWorker.ready); await q.reload({ waitUntil: 'networkidle0' })
await q.setOfflineMode(true); await q.goto(O + '/tools/md5-generator', { waitUntil: 'load' }).catch(e => F('offline', 'goto ' + e.message))
await q.waitForFunction(() => /MD5/.test(document.querySelector('h1')?.textContent || ''), { timeout: 5000 }).catch(() => F('offline', 'unvisited tool page not usable offline'))
await q.click('button:nth-of-type(1)').catch(() => {}); await q.setOfflineMode(false)
console.log(`PAGES=${urls.length} FAILS=${fails.length}`); console.log(fails.slice(0, 40).join('\n')); await b.close()
