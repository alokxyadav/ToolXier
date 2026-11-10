// Post-build: sitemap, robots, and pre-rendered per-route HTML (unique SEO tags without JS + a real 404.html)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { tools, VOLATILE } from '../src/tools/registry.js'
import { ITEMS, CATS as categories } from '../src/tools/items.js'
import { LEGAL } from '../src/pages/legal.js'
import { EXTRA } from '../src/pages/extra.js'
const site = (process.env.SITE_URL || 'https://YOUR-DOMAIN').replace(/\/$/, '')
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const catPages = categories.map(c => ({ path: `/category/${c.toLowerCase()}`, title: `Free Online ${c} Tools | ToolXier`, desc: `Free ${c.toLowerCase()} tools that run in your browser — no sign-up, no uploads.`,
  ns: `<noscript><h1>Free Online ${esc(c)} Tools</h1><ul>${ITEMS.filter(t => t.category === c).map(t => `<li><a href="${t.path}">${esc(t.name)}</a> — ${esc(t.description)}</li>`).join('')}</ul></noscript>` }))
const legalPages = Object.entries(LEGAL).map(([k, v]) => ({ path: `/${k}`, title: `${v.title} | ToolXier`, desc: v.desc, ns: `<noscript><h1>${esc(v.title)}</h1>${v.body.map(b => `<p>${esc(b)}</p>`).join('')}</noscript>` }))
const pages = [{ path: '/' }, ...catPages, ...legalPages, ...EXTRA.map(p => ({ path: p.path, title: `${p.name} — Free | ToolXier`, desc: `${p.desc} Free, private, runs in your browser.` })),
  ...tools.map(t => ({ tool: t, path: `/tools/${t.slug}`, title: `${t.name} Online — Free | ToolXier`, desc: `${t.description} Free, private, runs in your browser.` }))]
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `<url><loc>${site}${p.path}</loc></url>`).join('\n')}\n</urlset>\n`)
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`)
const base = readFileSync('dist/index.html', 'utf8')
for (const p of pages.filter(p => p.path !== '/')) {
  let ns = p.ns || ''
  if (p.tool) { let out = ''; if (p.tool.example && !VOLATILE.includes(p.tool.slug)) { try { out = String(await p.tool.run(p.tool.example)) } catch { out = '' } }
    ns = `<noscript><h1>${esc(p.tool.name)}</h1><p>${esc(p.tool.description)}</p><p>This tool needs JavaScript. Example input:</p><pre>${esc(p.tool.example || '')}</pre>${out ? `<p>Example result:</p><pre>${esc(out)}</pre>` : ''}</noscript>` }
  const h = base.replace(/<title>.*?<\/title>/, `<title>${esc(p.title)}</title>`).replace(/(<meta name="description" content=")[^"]*/, `$1${esc(p.desc)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(p.title)}`).replace('</head>', `<link rel="canonical" href="${site}${p.path}"/></head>`).replace('<div id="root"></div>', `<div id="root"></div>${ns}`)
  mkdirSync(`dist${p.path}`, { recursive: true }); writeFileSync(`dist${p.path}/index.html`, h) }
writeFileSync('dist/404.html', base.replace(/<title>.*?<\/title>/, '<title>404 — Page not found | ToolXier</title>').replace('</head>', '<meta name="robots" content="noindex"/></head>'))
console.log(`prerendered ${pages.length - 1} pages + 404.html; sitemap: ${pages.length} URLs for ${site}`)

// Home page: crawlable internal links to every page without JavaScript
const hb = readFileSync('dist/index.html', 'utf8')
writeFileSync('dist/index.html', hb.replace('<div id="root"></div>', `<div id="root"></div><noscript><h1>ToolXier — free online developer tools</h1>${categories.map(c => `<h2>${esc(c)}</h2><ul>${ITEMS.filter(t => t.category === c).map(t => `<li><a href="${t.path}">${esc(t.name)}</a></li>`).join('')}</ul>`).join('')}</noscript>`))

// Service worker: precache the whole app shell (all hashed assets) with a content-based cache version so updates replace old caches.
import { readdirSync, readFileSync as rf, writeFileSync as wf } from 'node:fs'
import { createHash } from 'node:crypto'
const shell = ['/', '/favicon.svg', '/manifest.webmanifest', '/icon-192.png', ...readdirSync('dist/assets').map(f => `/assets/${f}`)]
const ver = createHash('sha256').update(shell.join('|')).digest('hex').slice(0, 10)
wf('dist/sw.js', rf('dist/sw.js', 'utf8').replace("const C='toolxier-v1';", `const C='toolxier-${ver}';`).replace("c.addAll(['/','/favicon.svg'])", `c.addAll(${JSON.stringify(shell)})`))
console.log(`service worker precaches ${shell.length} files (cache toolxier-${ver})`)
