// Production-like static server: serves files and dir/index.html, otherwise 404.html with a real 404 status (no SPA fallback).
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import { gzipSync } from 'node:zlib'
const root = join(process.cwd(), 'dist'), port = +process.env.PORT || 4173
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain' }
const send = async (req, res, file, status) => { let b = await readFile(file); const type = types[extname(file)] || 'application/octet-stream', h = { 'content-type': type, 'cache-control': file.includes(join(root, 'assets')) ? 'public, max-age=31536000, immutable' : 'no-cache' }
  if (/text|javascript|xml|svg|json/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '')) { b = gzipSync(b); h['content-encoding'] = 'gzip' } res.writeHead(status, h); res.end(b) }
createServer(async (req, res) => { try { let f = join(root, normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)))
    if (!f.startsWith(root)) throw 0; const s = await stat(f).catch(() => null); if (s?.isDirectory()) f = join(f, 'index.html'); await stat(f); await send(req, res, f, 200) }
  catch { try { await send(req, res, join(root, '404.html'), 404) } catch { res.writeHead(404); res.end('Not found') } } }).listen(port, () => console.log(`http://localhost:${port}`))
