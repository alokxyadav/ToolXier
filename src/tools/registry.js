// Central tool registry. Add a tool = add one object here. Pure functions, runs locally in the browser.
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('')
const sha = algo => async t => hex(await crypto.subtle.digest(algo, new TextEncoder().encode(t)))
const b64d = s => new TextDecoder().decode(Uint8Array.from(atob(s.trim()), c => c.charCodeAt(0)))
const b64e = s => btoa(String.fromCharCode(...new TextEncoder().encode(s)))
const jwtPart = p => JSON.parse(b64d(p.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(p.length / 4) * 4, '=')))
const pick = (chars, n) => { const a = new Uint32Array(n); crypto.getRandomValues(a); return [...a].map(x => chars[x % chars.length]).join('') }
const CK = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const ulid = () => { let t = Date.now(), s = ''; for (let i = 0; i < 10; i++) { s = CK[t % 32] + s; t = Math.floor(t / 32) } return s + pick(CK, 16) }
const csvParse = t => { const rows = []; let r = [], f = '', q = false
  for (let i = 0; i < t.length; i++) { const c = t[i]
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++ } else q = false } else f += c }
    else if (c === '"') q = true; else if (c === ',') { r.push(f); f = '' }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; r.push(f); rows.push(r); r = []; f = '' } else f += c }
  if (f || r.length) { r.push(f); rows.push(r) } return rows }
const esc = v => { v = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v }
const words = t => t.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[^A-Za-z0-9]+/).filter(Boolean)
const cap = w => w[0].toUpperCase() + w.slice(1).toLowerCase()
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' }
const STATUS = { 200: 'OK', 201: 'Created', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict', 418: "I'm a teapot", 422: 'Unprocessable Content', 429: 'Too Many Requests', 500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable', 504: 'Gateway Timeout' }
const LOREM = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat'.split(' ')
const enc = s => new TextEncoder().encode(s)
const two = t => { const p = t.split(/\r?\n---\r?\n/); if (p.length !== 2) throw new Error('Put the two inputs separated by a line containing only ---'); return p }
const lcs = (a, b) => { if (a.length * b.length > 4e6) throw new Error('Inputs too large (max ~2000 lines each).')
  const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1))
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) d[i][j] = a[i] === b[j] ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1])
  let i = 0, j = 0; const o = []
  while (i < m && j < n) { if (a[i] === b[j]) { o.push('  ' + a[i]); i++; j++ } else if (d[i + 1][j] >= d[i][j + 1]) o.push('- ' + a[i++]); else o.push('+ ' + b[j++]) }
  while (i < m) o.push('- ' + a[i++]); while (j < n) o.push('+ ' + b[j++]); return o.join('\n') }
const jd = (a, b, p = '$', o = []) => { if (JSON.stringify(a) === JSON.stringify(b)) return o; const isO = x => x && typeof x === 'object'
  if (isO(a) && isO(b) && Array.isArray(a) === Array.isArray(b)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const q = Array.isArray(a) ? `${p}[${k}]` : `${p}.${k}`
    if (!(k in b)) o.push(`- ${q}: ${JSON.stringify(a[k])}`); else if (!(k in a)) o.push(`+ ${q}: ${JSON.stringify(b[k])}`); else jd(a[k], b[k], q, o) } }
  else o.push(`~ ${p}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`); return o }
const mdHtml = t => { const e = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const inl = s => e(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
  const out = []; let ul = false, para = []; const fp = () => { if (para.length) out.push(`<p>${inl(para.join(' '))}</p>`); para = [] }; const cu = () => { if (ul) out.push('</ul>'); ul = false }
  for (const l of t.split(/\r?\n/)) { let m
    if ((m = l.match(/^(#{1,6})\s+(.*)/))) { fp(); cu(); out.push(`<h${m[1].length}>${inl(m[2])}</h${m[1].length}>`) }
    else if ((m = l.match(/^\s*[-*]\s+(.*)/))) { fp(); if (!ul) out.push('<ul>'); ul = true; out.push(`<li>${inl(m[1])}</li>`) }
    else if (!l.trim()) { fp(); cu() } else { cu(); para.push(l.trim()) } }
  fp(); cu(); return out.join('\n') }
const parseCurl = t => { const tk = (t.replace(/\\\n/g, ' ').match(/'[^']*'|"[^"]*"|\S+/g) || []).map(s => /^['"]/.test(s) ? s.slice(1, -1) : s)
  if (tk[0] !== 'curl') throw new Error('Command must start with curl.'); let m = '', url = '', body; const h = {}
  for (let i = 1; i < tk.length; i++) { const a = tk[i]; if (a === '-X' || a === '--request') m = tk[++i]; else if (a === '-H' || a === '--header') { const [k, ...v] = tk[++i].split(':'); h[k.trim()] = v.join(':').trim() }
    else if (/^(-d|--data(-raw|-binary)?)$/.test(a)) body = tk[++i]; else if (!a.startsWith('-')) url = a }
  if (!/^https?:\/\//.test(url)) throw new Error('No http(s) URL found.'); return { method: (m || (body ? 'POST' : 'GET')).toUpperCase(), url, headers: h, body } }
const beautify = t => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*\{\s*/g, ' {\n  ').replace(/;\s*(?!\s*\})/g, ';\n  ').replace(/;?\s*\}\s*/g, ';\n}\n').trim()
const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i
const toRgb = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)) }
const toHsl = ([r, g, b]) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)); let h = d === 0 ? 0 : mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [(h * 60 + 360) % 360, s, l] }
const fromHsl = (h, s, l) => { h = (h % 360 + 360) % 360; const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]
  return '#' + [r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('') }
const md5 = bytes => { const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0), S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21]
  const len = bytes.length, pl = (((len + 8) >> 6) + 1) << 6, buf = new Uint8Array(pl); buf.set(bytes); buf[len] = 0x80
  const dv = new DataView(buf.buffer); dv.setUint32(pl - 8, (len * 8) >>> 0, true); dv.setUint32(pl - 4, Math.floor(len / 2 ** 29), true)
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476
  for (let o = 0; o < pl; o += 64) { const M = Array.from({ length: 16 }, (_, i) => dv.getUint32(o + i * 4, true)); let A = a0, B = b0, C = c0, D = d0
    for (let i = 0; i < 64; i++) { let F, g; if (i < 16) { F = (B & C) | (~B & D); g = i } else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16 } else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16 } else { F = C ^ (B | ~D); g = (7 * i) % 16 }
      F = (F + A + K[i] + M[g]) >>> 0; A = D; D = C; C = B; const s = S[(i >> 4) * 4 + (i % 4)]; B = (B + ((F << s) | (F >>> (32 - s)))) >>> 0 }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0 }
  return [a0, b0, c0, d0].map(x => [0, 8, 16, 24].map(sh => ((x >>> sh) & 255).toString(16).padStart(2, '0')).join('')).join('') }
const tree = (v, k = '$', d = 0, o = []) => { const pr = typeof v !== 'object' || v === null, t = Array.isArray(v) ? `array(${v.length})` : v === null ? 'null' : typeof v
  o.push(`${'  '.repeat(d)}${k}: ${pr ? JSON.stringify(v) + ` (${t})` : t}`); if (!pr) for (const [kk, vv] of Object.entries(v)) tree(vv, kk, d + 1, o); return o }
const sortKeys = v => Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, sortKeys(v[k])])) : v
const rgb2hex = ([r, g, b]) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
const ymd = (a, b) => { if (a > b) [a, b] = [b, a]; let y = b.getUTCFullYear() - a.getUTCFullYear(), m = b.getUTCMonth() - a.getUTCMonth(), d = b.getUTCDate() - a.getUTCDate()
  if (d < 0) { m--; d += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate() } if (m < 0) { y--; m += 12 } return `${y} years, ${m} months, ${d} days` }
const dateOnly = s => { if (!/^\d{4}-\d{2}-\d{2}$/.test(s.trim())) throw new Error('Use the format YYYY-MM-DD, e.g. 1995-08-24.'); const d = new Date(s.trim() + 'T00:00:00Z'); if (isNaN(d)) throw new Error('That date is not valid.'); return d }
const MORSE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '/': '-..-.' }
const UNMORSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))
const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
const toRoman = n => ROMAN.reduce((s, [v, r]) => { while (n >= v) { s += r; n -= v } return s }, '')
const fromRoman = r => { let n = 0; for (let i = 0; i < r.length; i++) { const v = ROMAN.find(x => x[1] === r[i])[0], nx = ROMAN.find(x => x[1] === r[i + 1]); n += nx && nx[0] > v ? -v : v } return n }
const utf8 = b => { try { return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(b)) } catch { throw new Error('The bytes are not valid UTF-8 text.') } }
const ip2n = s => { const p = s.split('.'); if (p.length !== 4 || p.some(x => !/^\d{1,3}$/.test(x) || +x > 255)) throw new Error('Enter an IPv4 CIDR like 192.168.1.10/24.'); return p.reduce((a, x) => a * 256 + +x, 0) }
const n2ip = n => [24, 16, 8, 0].map(s => (n >>> s) & 255).join('.')
const rwx = d => (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-')
const cronSet = (f, min, max, name) => { const s = new Set(); for (const part of f.split(',')) { const [r, st] = part.split('/'), step = st === undefined ? 1 : +st
    if (!Number.isInteger(step) || step < 1 || (r === '' )) throw new Error(`Invalid ${name} field “${f}”.`); let a, b
    if (r === '*') [a, b] = [min, max]; else if (/^\d+-\d+$/.test(r)) [a, b] = r.split('-').map(Number); else if (/^\d+$/.test(r)) { a = +r; b = st === undefined ? a : max } else throw new Error(`Invalid ${name} field “${f}”.`)
    if (a < min || b > max || a > b) throw new Error(`${name} must be between ${min} and ${max}.`); for (let v = a; v <= b; v += step) s.add(v) } return s }
const nums = (t, n, msg) => { const a = t.trim().split(/[\s,]+/).filter(Boolean).map(Number); if (a.length < n || a.some(x => !isFinite(x))) throw new Error(msg); return a }
const m2 = x => (Math.round(x * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const unitTool = (table, ex) => t => { const m = t.trim().match(/^(-?\d*\.?\d+(?:e[+-]?\d+)?)\s*([a-z0-9/²]+)$/i); const u = m && Object.keys(table).find(k => k.toLowerCase() === m[2].toLowerCase())
  if (!m || !u) throw new Error(`Enter a value and unit, e.g. “${ex}”. Units: ${Object.keys(table).join(', ')}.`); const base = +m[1] * table[u]; return Object.keys(table).map(k => `${k}: ${+(base / table[k]).toPrecision(8)}`).join('\n') }
const ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' '), TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const w999 = n => { const p = [], h = Math.floor(n / 100), r = n % 100; if (h) p.push(ONES[h] + ' hundred'); if (r) p.push(r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10] : '')); return p.join(' ') }
const words2 = n => { if (n === 0) return 'zero'; const sc = ['', ' thousand', ' million', ' billion'], out = []; for (let i = 0; n > 0; i++, n = Math.floor(n / 1000)) { const c = n % 1000; if (c) out.unshift(w999(c) + sc[i]) } return out.join(' ') }
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a)
const iso = s => (s ? new Date(s * 1000).toISOString() : undefined)

export const categories = ['JSON', 'Encoding', 'Security', 'Generators', 'Converters', 'Text', 'Frontend', 'API', 'Calculators', 'Units', 'Image']

export const tools = [
  { slug: 'json-formatter', name: 'JSON Formatter', category: 'JSON', description: 'Format and beautify JSON with 2-space indentation.',
    example: '{"name":"ToolXier","tags":["dev","free"]}', run: t => JSON.stringify(JSON.parse(t), null, 2) },
  { slug: 'json-validator', name: 'JSON Validator', category: 'JSON', description: 'Check whether JSON is valid and see the exact error.',
    example: '{"ok": true,}', run: t => { JSON.parse(t); return 'Valid JSON ✔' } },
  { slug: 'json-minifier', name: 'JSON Minifier', category: 'JSON', description: 'Remove whitespace from JSON to shrink its size.',
    example: '{\n  "a": 1,\n  "b": [1, 2]\n}', run: t => JSON.stringify(JSON.parse(t)) },
  { slug: 'base64-encode', name: 'Base64 Encoder', category: 'Encoding', description: 'Encode text (UTF-8 safe) to Base64.',
    example: 'Hello, ToolXier!', run: b64e },
  { slug: 'base64-decode', name: 'Base64 Decoder', category: 'Encoding', description: 'Decode Base64 back to UTF-8 text.',
    example: 'SGVsbG8sIFRvb2xYaWVyIQ==', run: b64d },
  { slug: 'url-encode', name: 'URL Encoder', category: 'Encoding', description: 'Percent-encode text for safe use in URLs.',
    example: 'name=Tool Xier&q=a/b', run: encodeURIComponent },
  { slug: 'url-decode', name: 'URL Decoder', category: 'Encoding', description: 'Decode percent-encoded URL text.',
    example: 'name%3DTool%20Xier', run: decodeURIComponent },
  { slug: 'jwt-decoder', name: 'JWT Decoder', category: 'Security', description: 'Decode JWT header and claims. Does NOT verify the signature.',
    note: '⚠ Decoding is not verification. A decoded token is NOT proven authentic or valid. Never paste production secrets into untrusted sites.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJEZXYiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwMzYwMH0.signature',
    run: t => { const [h, p, s] = t.trim().split('.'); if (!h || !p || s === undefined) throw new Error('A JWT has 3 dot-separated parts.')
      const payload = jwtPart(p)
      return JSON.stringify({ header: jwtPart(h), payload, times: { issuedAt: iso(payload.iat), notBefore: iso(payload.nbf), expires: iso(payload.exp),
        expired: payload.exp ? payload.exp * 1000 < Date.now() : 'no exp claim' }, signatureVerified: false }, null, 2) } },
  { slug: 'sha-256-generator', name: 'SHA-256 Generator', category: 'Security', description: 'Compute the SHA-256 hash of text.', example: 'hello', run: sha('SHA-256') },
  { slug: 'sha-512-generator', name: 'SHA-512 Generator', category: 'Security', description: 'Compute the SHA-512 hash of text.', example: 'hello', run: sha('SHA-512') },
  { slug: 'uuid-generator', name: 'UUID Generator', category: 'Generators', description: 'Generate 5 random v4 UUIDs. Input is ignored.',
    example: '', run: () => Array.from({ length: 5 }, () => crypto.randomUUID()).join('\n') },
  { slug: 'unix-timestamp-converter', name: 'Unix Timestamp Converter', category: 'Converters',
    description: 'Convert a Unix timestamp (seconds or ms) to a date, or a date to a timestamp.', example: '1700000000',
    run: t => { t = t.trim(); const n = /^\d+$/.test(t) ? Number(t) : NaN
      const d = Number.isNaN(n) ? new Date(t) : new Date(n < 1e12 ? n * 1000 : n)
      if (isNaN(d)) throw new Error('Enter a Unix timestamp or a valid date.')
      return `ISO: ${d.toISOString()}\nSeconds: ${Math.floor(d / 1000)}\nMilliseconds: ${d.getTime()}` } },
  { slug: 'word-counter', name: 'Word & Character Counter', category: 'Text', description: 'Count words, characters and lines.', example: 'The quick brown fox.',
    run: t => `Words: ${t.trim() ? t.trim().split(/\s+/).length : 0}\nCharacters: ${t.length}\nLines: ${t ? t.split('\n').length : 0}` },
  { slug: 'slug-generator', name: 'Slug Generator', category: 'Text', description: 'Turn text into a clean URL slug.', example: 'Hello, World! Ünïcode Test',
    run: t => t.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') },
  { slug: 'sha-384-generator', name: 'SHA-384 Generator', category: 'Security', description: 'Compute the SHA-384 hash of text.', example: 'hello', run: sha('SHA-384') },
  { slug: 'html-entity-encode', name: 'HTML Entity Encoder', category: 'Encoding', description: 'Escape &, <, >, quotes for safe HTML display.', example: '<a href="x">Tom & Jerry</a>',
    run: t => t.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) },
  { slug: 'html-entity-decode', name: 'HTML Entity Decoder', category: 'Encoding', description: 'Decode named and numeric HTML entities.', example: '&lt;b&gt;Tom &amp; Jerry&lt;/b&gt; &#169;',
    run: t => t.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e.toLowerCase()] ?? m) },
  { slug: 'unicode-escape', name: 'Unicode Escape', category: 'Encoding', description: 'Convert non-ASCII characters to \\u{…} escapes.', example: 'héllo ✓ 😀',
    run: t => [...t].map(c => c.codePointAt(0) > 127 ? `\\u{${c.codePointAt(0).toString(16)}}` : c).join('') },
  { slug: 'unicode-unescape', name: 'Unicode Unescape', category: 'Encoding', description: 'Convert \\uXXXX and \\u{…} escapes back to text.', example: 'h\\u00e9llo \\u{1f600}',
    run: t => t.replace(/\\u\{([0-9a-f]+)\}|\\u([0-9a-f]{4})/gi, (m, a, b) => String.fromCodePoint(parseInt(a || b, 16))) },
  { slug: 'ulid-generator', name: 'ULID Generator', category: 'Generators', description: 'Generate 5 sortable ULIDs. Input is ignored.', example: '', run: () => Array.from({ length: 5 }, ulid).join('\n') },
  { slug: 'password-generator', name: 'Password Generator', category: 'Generators', description: 'Generate 5 strong 20-character passwords using Web Crypto. Enter a length (8–128) to change it.',
    example: '24', run: t => { const n = t.trim() ? Number(t) : 20; if (!Number.isInteger(n) || n < 8 || n > 128) throw new Error('Length must be a whole number from 8 to 128.')
      return Array.from({ length: 5 }, () => pick('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_', n)).join('\n') } },
  { slug: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', category: 'Generators', description: 'Generate placeholder paragraphs. Enter a paragraph count (1–20).', example: '3',
    run: t => { const n = t.trim() ? Number(t) : 3; if (!Number.isInteger(n) || n < 1 || n > 20) throw new Error('Enter a paragraph count from 1 to 20.')
      return Array.from({ length: n }, (_, p) => { const s = Array.from({ length: 40 }, (_, i) => LOREM[(i * 7 + p * 11) % LOREM.length]).join(' '); return s[0].toUpperCase() + s.slice(1) + '.' }).join('\n\n') } },
  { slug: 'case-converter', name: 'Case Converter', category: 'Text', description: 'Convert text to UPPER, lower, camelCase, PascalCase, snake_case and kebab-case.', example: 'hello worldFoo bar',
    run: t => { const w = words(t); if (!w.length) throw new Error('Enter some text.')
      return [`UPPER: ${t.toUpperCase()}`, `lower: ${t.toLowerCase()}`, `camelCase: ${w[0].toLowerCase() + w.slice(1).map(cap).join('')}`, `PascalCase: ${w.map(cap).join('')}`,
        `snake_case: ${w.join('_').toLowerCase()}`, `kebab-case: ${w.join('-').toLowerCase()}`].join('\n') } },
  { slug: 'duplicate-line-remover', name: 'Duplicate Line Remover', category: 'Text', description: 'Remove repeated lines, keeping the first occurrence.', example: 'a\nb\na\nc\nb', run: t => [...new Set(t.split('\n'))].join('\n') },
  { slug: 'whitespace-cleaner', name: 'Whitespace Cleaner', category: 'Text', description: 'Trim lines, collapse spaces and remove extra blank lines.', example: '  hello   world  \n\n\n\n  bye ',
    run: t => t.split('\n').map(l => l.trim().replace(/[ \t]+/g, ' ')).join('\n').replace(/\n{3,}/g, '\n\n').trim() },
  { slug: 'number-base-converter', name: 'Number Base Converter', category: 'Converters', description: 'Convert decimal, hex (0x), binary (0b) or octal (0o) to all bases.', example: '0xFF',
    run: t => { let n; try { n = BigInt(t.trim()) } catch { throw new Error('Enter an integer like 255, 0xFF, 0b1010 or 0o17.') }
      return `Decimal: ${n}\nHex: 0x${n.toString(16)}\nBinary: 0b${n.toString(2)}\nOctal: 0o${n.toString(8)}` } },
  { slug: 'byte-size-converter', name: 'Byte Size Converter', category: 'Converters', description: 'Convert a byte count to KB/MB/GB (1000) and KiB/MiB/GiB (1024).', example: '1572864',
    run: t => { const n = Number(t.trim()); if (!t.trim() || !isFinite(n) || n < 0) throw new Error('Enter a non-negative number of bytes.')
      const f = (d, u) => `${+(n / d).toFixed(4)} ${u}`; return [f(1, 'B'), f(1e3, 'KB'), f(1e6, 'MB'), f(1e9, 'GB'), f(1024, 'KiB'), f(1024 ** 2, 'MiB'), f(1024 ** 3, 'GiB')].join('\n') } },
  { slug: 'json-to-csv', name: 'JSON to CSV', category: 'JSON', description: 'Convert an array of JSON objects to CSV.', example: '[{"name":"Ann","age":30},{"name":"Bo, Jr.","age":25}]',
    run: t => { const a = JSON.parse(t); if (!Array.isArray(a) || !a.length) throw new Error('Input must be a non-empty JSON array of objects.')
      const k = [...new Set(a.flatMap(o => Object.keys(o ?? {})))]; return [k.map(esc).join(','), ...a.map(o => k.map(c => esc(o?.[c])).join(','))].join('\n') } },
  { slug: 'csv-to-json', name: 'CSV to JSON', category: 'JSON', description: 'Convert CSV with a header row to a JSON array.', example: 'name,age\nAnn,30\n"Bo, Jr.",25',
    run: t => { const [h, ...d] = csvParse(t.trim()); if (!h || !d.length) throw new Error('CSV needs a header row and at least one data row.')
      return JSON.stringify(d.map(r => Object.fromEntries(h.map((k, i) => [k, r[i] ?? '']))), null, 2) } },
  { slug: 'css-minifier', name: 'CSS Minifier', category: 'Frontend', description: 'Strip comments and whitespace from CSS. Review output if you use quoted strings with multiple spaces.',
    example: '/* c */\n.a {\n  color: red;\n  margin: 0 auto;\n}', run: t => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim() },
  { slug: 'curl-to-fetch', name: 'cURL to Fetch Converter', category: 'API', description: 'Convert a basic cURL command (-X, -H, -d, URL) to fetch().',
    example: `curl -X POST https://api.example.com/items -H 'Content-Type: application/json' -d '{"a":1}'`,
    run: t => { const tk = (t.replace(/\\\n/g, ' ').match(/'[^']*'|"[^"]*"|\S+/g) || []).map(s => /^['"]/.test(s) ? s.slice(1, -1) : s)
      if (tk[0] !== 'curl') throw new Error('Command must start with curl.'); let m = '', url = '', body, h = {}
      for (let i = 1; i < tk.length; i++) { const a = tk[i]
        if (a === '-X' || a === '--request') m = tk[++i]; else if (a === '-H' || a === '--header') { const [k, ...v] = tk[++i].split(':'); h[k.trim()] = v.join(':').trim() }
        else if (/^(-d|--data(-raw|-binary)?)$/.test(a)) body = tk[++i]; else if (!a.startsWith('-')) url = a }
      if (!/^https?:\/\//.test(url)) throw new Error('No http(s) URL found.'); const o = { method: m || (body ? 'POST' : 'GET') }
      if (Object.keys(h).length) o.headers = h; if (body !== undefined) o.body = body
      return `fetch(${JSON.stringify(url)}, ${JSON.stringify(o, null, 2)})\n  .then(r => r.json())\n  .then(console.log)\n  .catch(console.error);` } },
  { slug: 'http-status-codes', name: 'HTTP Status Code Reference', category: 'API', description: 'Look up a status code, or leave blank to list common ones.', example: '404',
    run: t => { const c = t.trim(); if (!c) return Object.entries(STATUS).map(([k, v]) => `${k} ${v}`).join('\n'); if (!STATUS[c]) throw new Error('Code not in the common list. Leave blank to see supported codes.'); return `${c} ${STATUS[c]}` } },
  { slug: 'regex-tester', name: 'Regex Tester', category: 'Text', description: 'Test a JavaScript regex. Line 1: /pattern/flags — remaining lines: the text. Avoid catastrophic patterns on huge text.',
    example: '/(\\w+)@(\\w+)\\.com/g\nmail ann@site.com and bo@corp.com', run: t => { const nl = t.indexOf('\n'); const m = nl > 0 && t.slice(0, nl).match(/^\/(.+)\/([dgimsuy]*)$/)
      if (!m) throw new Error('First line must look like /pattern/flags, followed by the text on the next lines.'); if (t.length > 2e5) throw new Error('Input too large (200k chars max).')
      let re; try { re = new RegExp(m[1], m[2].includes('g') ? m[2] : m[2] + 'g') } catch (e) { throw new Error('Invalid regex: ' + e.message) }
      const out = []; for (const x of t.slice(nl + 1).matchAll(re)) { out.push(`#${out.length + 1} @${x.index}: ${JSON.stringify(x[0])}` + (x.length > 1 ? ' groups: ' + JSON.stringify(x.slice(1)) : '')); if (out.length >= 500) break }
      return out.length ? `${out.length} match(es)\n` + out.join('\n') : 'No matches' } },
  { slug: 'text-diff-checker', name: 'Text Diff Checker', category: 'Text', description: 'Line diff of two texts separated by a line containing only ---.', example: 'a\nb\nc\n---\na\nx\nc',
    run: t => { const [a, b] = two(t); return lcs(a.split('\n'), b.split('\n')) } },
  { slug: 'json-diff', name: 'JSON Compare / Diff', category: 'JSON', description: 'Deep-compare two JSON documents separated by a line containing only ---. Key order is ignored.',
    example: '{"a":1,"b":[1,2],"c":true}\n---\n{"b":[1,3],"c":true,"d":"new"}', run: t => { const [a, b] = two(t); const r = jd(JSON.parse(a), JSON.parse(b)); return r.length ? r.join('\n') : 'No differences ✔' } },
  { slug: 'markdown-to-html', name: 'Markdown to HTML', category: 'Text', description: 'Convert basic Markdown (headings, lists, bold, italic, code, links) to escaped, XSS-safe HTML source.',
    example: '# Title\n\nSome **bold** and [a link](https://example.com).\n\n- one\n- two', run: mdHtml },
  { slug: 'hmac-sha256-generator', name: 'HMAC-SHA256 Generator', category: 'Security', description: 'Line 1: secret key. Remaining lines: message. Computed locally; never transmitted.',
    example: 'key\nThe quick brown fox jumps over the lazy dog', run: async t => { const i = t.indexOf('\n'); if (i < 1) throw new Error('Line 1 = key, next lines = message.')
      const k = await crypto.subtle.importKey('raw', enc(t.slice(0, i)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return hex(await crypto.subtle.sign('HMAC', k, enc(t.slice(i + 1)))) } },
  { slug: 'curl-to-axios', name: 'cURL to Axios Converter', category: 'API', description: 'Convert a basic cURL command to an axios call.', example: `curl -X POST https://api.example.com/items -H 'Content-Type: application/json' -d '{"a":1}'`,
    run: t => { const c = parseCurl(t); const o = { method: c.method, url: c.url }; if (Object.keys(c.headers).length) o.headers = c.headers; if (c.body !== undefined) o.data = c.body
      return `import axios from 'axios';\n\naxios(${JSON.stringify(o, null, 2)})\n  .then(res => console.log(res.data))\n  .catch(console.error);` } },
  { slug: 'css-beautifier', name: 'CSS Beautifier', category: 'Frontend', description: 'Format minified CSS into readable rules.', example: '.a{color:red;margin:0 auto}.b{padding:4px}', run: beautify },
  { slug: 'html-minifier', name: 'HTML Minifier', category: 'Frontend', description: 'Remove comments and whitespace between tags. Do not use on content with <pre> or <textarea>.', example: '<div>\n  <!-- hi -->\n  <p>  Hello  </p>\n</div>',
    run: t => t.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim() },
  { slug: 'date-converter', name: 'Date Converter', category: 'Converters', description: 'Parse a date string and show ISO, UTC, local time and epoch. Dates without a timezone are read as your local time.', example: '2026-11-07T10:30:00Z',
    run: t => { const d = new Date(t.trim()); if (!t.trim() || isNaN(d)) throw new Error('Could not parse that date. Try 2026-11-07T10:30:00Z.'); return `ISO: ${d.toISOString()}\nUTC: ${d.toUTCString()}\nLocal: ${d.toString()}\nEpoch (s): ${Math.floor(d / 1000)}` } },
  { slug: 'time-zone-converter', name: 'Time Zone Converter', category: 'Converters', description: 'Show one moment in major time zones. Include Z or an offset for an exact instant.', example: '2026-11-07T10:30:00Z',
    run: t => { const d = new Date(t.trim()); if (!t.trim() || isNaN(d)) throw new Error('Enter an ISO date-time like 2026-11-07T10:30:00Z.')
      return ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney'].map(z => `${z.padEnd(20)} ${d.toLocaleString('en-GB', { timeZone: z, dateStyle: 'medium', timeStyle: 'long' })}`).join('\n') } },
  { slug: 'color-palette-generator', name: 'Color Palette Generator', category: 'Generators', description: 'From a base HEX color get complementary, triadic, analogous and shade colors.', example: '#2563eb',
    run: t => { const v = t.trim(); if (!HEX.test(v)) throw new Error('Enter a HEX color like #2563eb.'); const [h, s, l] = toHsl(toRgb(v)), f = (dh, nl = l) => fromHsl(h + dh, s, nl)
      return [`Base: ${f(0)}`, `Complementary: ${f(180)}`, `Triadic: ${f(120)}, ${f(240)}`, `Analogous: ${f(-30)}, ${f(30)}`, `Lighter: ${f(0, Math.min(1, l + .15))}, ${f(0, Math.min(1, l + .3))}`, `Darker: ${f(0, Math.max(0, l - .15))}, ${f(0, Math.max(0, l - .3))}`, `RGB: ${toRgb(v).join(', ')}`].join('\n') } },
  { slug: 'css-gradient-generator', name: 'CSS Gradient Generator', category: 'Frontend', description: 'Comma-separated HEX colors, optional angle last. Example: #2563eb, #9333ea, 45', example: '#2563eb, #9333ea, 45',
    run: t => { const p = t.split(',').map(x => x.trim()).filter(Boolean); let ang = 90; if (p.length && /^-?\d+$/.test(p[p.length - 1])) ang = +p.pop()
      if (p.length < 2 || !p.every(c => HEX.test(c))) throw new Error('Give at least two HEX colors, e.g. #2563eb, #9333ea, 45.'); const c = p.map(x => x.startsWith('#') ? x : '#' + x).join(', ')
      return `background: linear-gradient(${ang}deg, ${c});` } },
  { slug: 'box-shadow-generator', name: 'CSS Box Shadow Generator', category: 'Frontend', description: 'Format: x y blur spread #color [inset] — e.g. 0 4 12 0 #00000033', example: '0 4 12 0 #00000033',
    run: t => { const p = t.trim().split(/\s+/); const ins = p[p.length - 1] === 'inset' ? (p.pop(), ' inset') : ''
      if (p.length !== 5 || !p.slice(0, 4).every(n => /^-?\d+(\.\d+)?$/.test(n)) || !/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(p[4])) throw new Error('Use: x y blur spread #color [inset], e.g. 0 4 12 0 #00000033')
      return `box-shadow: ${p.slice(0, 4).map(n => n + 'px').join(' ')} ${p[4]}${ins};` } },
  { slug: 'md5-generator', name: 'MD5 Hash Generator', category: 'Security', description: 'Compute an MD5 hash for checksums and legacy systems.', note: '⚠ MD5 is cryptographically broken. Do NOT use it for passwords, signatures or security. Use SHA-256 or better.',
    example: 'hello', run: t => md5(enc(t)) },
  { slug: 'json-tree-viewer', name: 'JSON Tree Viewer', category: 'JSON', description: 'Show the structure and types of a JSON document as an indented tree.', example: '{"user":{"name":"Ann","tags":["a","b"]},"ok":true}',
    run: t => { const o = tree(JSON.parse(t)); if (o.length > 5000) throw new Error('Tree too large to display (5000 nodes max).'); return o.join('\n') } },
  { slug: 'json-to-yaml', name: 'JSON to YAML', category: 'Converters', description: 'Convert JSON to YAML.', example: '{"name":"ToolXier","tags":["a","b"],"n":1}',
    run: async t => { const { stringify } = await import('yaml'); return stringify(JSON.parse(t)) } },
  { slug: 'yaml-to-json', name: 'YAML to JSON', category: 'Converters', description: 'Convert YAML to JSON.', example: 'name: ToolXier\ntags:\n  - a\n  - b',
    run: async t => { const { parse } = await import('yaml'); let v; try { v = parse(t) } catch (e) { throw new Error('Invalid YAML: ' + e.message.split('\n')[0]) } return JSON.stringify(v, null, 2) } },
  { slug: 'xml-to-json', name: 'XML to JSON', category: 'Converters', description: 'Convert XML to JSON (attributes are prefixed with @_).', example: '<root><item id="1">A</item><item id="2">B</item></root>',
    run: async t => { const { XMLParser, XMLValidator } = await import('fast-xml-parser'); const v = XMLValidator.validate(t); if (v !== true) throw new Error('Invalid XML: ' + v.err.msg)
      return JSON.stringify(new XMLParser({ ignoreAttributes: false }).parse(t), null, 2) } },
  { slug: 'json-to-xml', name: 'JSON to XML', category: 'Converters', description: 'Convert JSON to XML. The JSON needs a single root key.', example: '{"root":{"item":["A","B"]}}',
    run: async t => { const { XMLBuilder } = await import('fast-xml-parser'); const o = JSON.parse(t); if (!o || Array.isArray(o) || Object.keys(o).length !== 1) throw new Error('JSON must be an object with exactly one root key.')
      return new XMLBuilder({ ignoreAttributes: false, format: true }).build(o) } },
  { slug: 'dns-lookup', name: 'DNS Lookup', category: 'API', description: 'Look up DNS records. Format: domain [A|AAAA|MX|TXT|NS|CNAME].', note: 'ℹ Privacy: this tool sends the domain you enter to Cloudflare’s public DNS-over-HTTPS service (cloudflare-dns.com). Nothing goes to ToolXier.', example: 'example.com A',
    run: async t => { const [name, type = 'A'] = t.trim().split(/\s+/), T = type.toUpperCase()
      if (!/^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(name || '')) throw new Error('Enter a valid domain like example.com.')
      if (!['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'].includes(T)) throw new Error('Record type must be A, AAAA, MX, TXT, NS or CNAME.')
      let r; try { r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${T}`, { headers: { accept: 'application/dns-json' }, signal: (c => { setTimeout(() => c.abort(), 10000); return c.signal })(new AbortController()) }); if (!r.ok) throw 0 } catch { throw new Error('DNS lookup failed (network error or timeout).') }
      const j = await r.json(); if (j.Status === 3) return 'NXDOMAIN — this domain does not exist.'; if (j.Status !== 0) return `DNS error status ${j.Status}.`
      return j.Answer?.length ? j.Answer.map(a => `${a.name} ${a.TTL}s ${a.data}`).join('\n') : 'No records of this type.' } },
  { slug: 'json-escape', name: 'JSON String Escape', category: 'JSON', description: 'Escape text so it can sit inside a JSON string (quotes, newlines, backslashes).', example: 'He said "hi"\nNew line', run: t => JSON.stringify(t).slice(1, -1) },
  { slug: 'json-unescape', name: 'JSON String Unescape', category: 'JSON', description: 'Turn an escaped JSON string back into plain text.', example: 'He said \\"hi\\"\\nNew line',
    run: t => { try { return JSON.parse('"' + t.replace(/\\.|"|\n/g, m => m === '"' ? '\\"' : m === '\n' ? '\\n' : m) + '"') } catch { throw new Error('Not a valid escaped JSON string.') } } },
  { slug: 'json-sorter', name: 'JSON Key Sorter', category: 'JSON', description: 'Sort all object keys alphabetically (recursively) and format the result.', example: '{"b":1,"a":{"z":1,"c":2}}', run: t => JSON.stringify(sortKeys(JSON.parse(t)), null, 2) },
  { slug: 'url-parser', name: 'URL Parser', category: 'API', description: 'Break a URL into protocol, host, path, query parameters and hash.', example: 'https://example.com:8080/a/b?x=1&y=two#top',
    run: t => { let u; try { u = new URL(t.trim()) } catch { throw new Error('Enter a full URL starting with http:// or https://.') }
      return [`Protocol: ${u.protocol}`, `Host: ${u.host}`, `Hostname: ${u.hostname}`, `Port: ${u.port || '(default)'}`, `Path: ${u.pathname}`, `Hash: ${u.hash || '(none)'}`, (u.username || u.password) ? 'Credentials: present (hidden)' : '', 'Query parameters:',
        ...([...u.searchParams].length ? [...u.searchParams].map(([k, v]) => `  ${k} = ${v}`) : ['  (none)'])].filter(Boolean).join('\n') } },
  { slug: 'color-converter', name: 'Color Converter (HEX/RGB/HSL)', category: 'Converters', description: 'Convert between #hex, rgb(r,g,b) and hsl(h,s%,l%).', example: 'rgb(37, 99, 235)',
    run: t => { const v = t.trim(); let rgb, m
      if (HEX.test(v)) rgb = toRgb(v); else if ((m = v.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i))) rgb = m.slice(1).map(Number)
      else if ((m = v.match(/^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i))) rgb = toRgb(fromHsl(+m[1], m[2] / 100, m[3] / 100)); else throw new Error('Use #2563eb, rgb(37, 99, 235) or hsl(221, 83%, 53%).')
      if (rgb.some(x => x > 255)) throw new Error('RGB values must be 0–255.'); const [h, s, l] = toHsl(rgb)
      return `HEX: ${rgb2hex(rgb)}\nRGB: rgb(${rgb.join(', ')})\nHSL: hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)` } },
  { slug: 'px-rem-converter', name: 'PX ⇄ REM Converter', category: 'Converters', description: 'Enter a number and an optional base font size (default 16).', example: '24 16',
    run: t => { const [n, b = 16] = t.trim().split(/\s+/).map(Number); if (!isFinite(n) || !isFinite(b) || b <= 0) throw new Error('Enter numbers like “24” or “24 16”.'); const f = x => +x.toFixed(4)
      return `${n}px = ${f(n / b)}rem\n${n}rem = ${f(n * b)}px\n(base font size: ${b}px)` } },
  { slug: 'reverse-text', name: 'Reverse Text', category: 'Text', description: 'Reverse the characters, or the order of lines.', example: 'Hello\nWorld',
    run: t => `Characters reversed:\n${[...t].reverse().join('')}\n\nLines reversed:\n${t.split('\n').reverse().join('\n')}` },
  { slug: 'sort-lines', name: 'Sort Lines', category: 'Text', description: 'Sort lines A→Z and Z→A (natural number-aware, case-insensitive).', example: 'banana\nApple\ncherry\nfile10\nfile2',
    run: t => { const a = t.split('\n').sort((x, y) => x.localeCompare(y, undefined, { numeric: true, sensitivity: 'base' })); return `A → Z:\n${a.join('\n')}\n\nZ → A:\n${[...a].reverse().join('\n')}` } },
  { slug: 'remove-line-breaks', name: 'Remove Line Breaks', category: 'Text', description: 'Join multi-line text into a single line.', example: 'one\ntwo\n\nthree', run: t => t.replace(/\r?\n+/g, ' ').replace(/ {2,}/g, ' ').trim() },
  { slug: 'character-frequency', name: 'Character Frequency', category: 'Text', description: 'Count how often each character appears (top 50).', example: 'hello world',
    run: t => { if (!t) throw new Error('Enter some text.'); const m = new Map(); for (const c of t) m.set(c, (m.get(c) || 0) + 1)
      return [...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 50).map(([c, n]) => `${JSON.stringify(c)}: ${n}`).join('\n') } },
  { slug: 'strip-html-tags', name: 'Strip HTML Tags', category: 'Text', description: 'Remove HTML tags (and script/style blocks), leaving plain text.', example: '<h1>Hi</h1><script>x()</script><p>Some <b>bold</b> text</p>',
    run: t => t.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]*>/g, ' ').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim() },
  { slug: 'regex-escape', name: 'Regex Escape', category: 'Text', description: 'Escape special regex characters so text matches literally.', example: 'price: $5.00 (approx.)', run: t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') },
  { slug: 'hex-encode', name: 'Text to Hex', category: 'Encoding', description: 'Convert text (UTF-8) to hexadecimal bytes.', example: 'Hello ✓', run: t => [...enc(t)].map(b => b.toString(16).padStart(2, '0')).join(' ') },
  { slug: 'hex-decode', name: 'Hex to Text', category: 'Encoding', description: 'Convert hexadecimal bytes back to text.', example: '48 65 6c 6c 6f',
    run: t => { const c = t.replace(/0x|[\s,]/gi, ''); if (!/^[0-9a-f]*$/i.test(c) || c.length % 2) throw new Error('Enter an even number of hex digits (0–9, a–f).'); return utf8((c.match(/../g) || []).map(h => parseInt(h, 16))) } },
  { slug: 'text-to-binary', name: 'Text to Binary', category: 'Encoding', description: 'Convert text (UTF-8) to 8-bit binary.', example: 'Hi', run: t => [...enc(t)].map(b => b.toString(2).padStart(8, '0')).join(' ') },
  { slug: 'binary-to-text', name: 'Binary to Text', category: 'Encoding', description: 'Convert 8-bit binary groups back to text.', example: '01001000 01101001',
    run: t => { const c = t.replace(/\s+/g, ''); if (!/^[01]+$/.test(c) || c.length % 8) throw new Error('Enter binary digits (0/1) in groups of 8.'); return utf8(c.match(/.{8}/g).map(b => parseInt(b, 2))) } },
  { slug: 'rot13', name: 'ROT13 Encoder / Decoder', category: 'Encoding', description: 'Apply ROT13 (running it twice restores the text). Not encryption.', example: 'Hello, World!',
    run: t => t.replace(/[a-z]/gi, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode((c.charCodeAt(0) - b + 13) % 26 + b) }) },
  { slug: 'morse-code-translator', name: 'Morse Code Translator', category: 'Encoding', description: 'Text → Morse or Morse → text (auto-detected). Separate letters with spaces and words with /.', example: 'SOS HELP',
    run: t => { const v = t.trim(); if (!v) throw new Error('Enter some text or Morse code.')
      if (/^[.\-\s/]+$/.test(v)) return v.split(/\s*\/\s*/).map(w => w.split(/\s+/).filter(Boolean).map(c => UNMORSE[c] ?? '?').join('')).join(' ')
      return v.toUpperCase().split(/\s+/).map(w => [...w].map(c => MORSE[c] ?? '?').join(' ')).join(' / ') } },
  { slug: 'roman-numeral-converter', name: 'Roman Numeral Converter', category: 'Converters', description: 'Convert 1–3999 to Roman numerals, or Roman numerals to numbers.', example: '2026',
    run: t => { const v = t.trim().toUpperCase(); if (/^\d+$/.test(v)) { const n = +v; if (n < 1 || n > 3999) throw new Error('Number must be 1–3999.'); return toRoman(n) }
      if (/^[MDCLXVI]+$/.test(v) && toRoman(fromRoman(v)) === v) return String(fromRoman(v)); throw new Error('Enter a number (1–3999) or a valid Roman numeral.') } },
  { slug: 'random-number-generator', name: 'Random Number Generator', category: 'Generators', description: 'Format: min max count — e.g. 1 100 5 (cryptographically random, max 100 numbers).', example: '1 100 5',
    run: t => { const [lo = 1, hi = 100, n = 1] = t.trim().split(/\s+/).filter(Boolean).map(Number); if (![lo, hi, n].every(Number.isInteger) || lo > hi || n < 1 || n > 100 || hi - lo > 2 ** 31) throw new Error('Use whole numbers: min max count (min ≤ max, count 1–100).')
      const a = new Uint32Array(n); crypto.getRandomValues(a); return [...a].map(x => lo + x % (hi - lo + 1)).join('\n') } },
  { slug: 'age-calculator', name: 'Age Calculator', category: 'Converters', description: 'Enter a birth date (YYYY-MM-DD) to see exact age in years, months and days.', example: '1995-08-24',
    run: t => { const b = dateOnly(t), now = new Date(), today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())); if (b > today) throw new Error('Birth date is in the future.'); return `${ymd(b, today)}\nTotal days: ${Math.round((today - b) / 864e5)}` } },
  { slug: 'date-difference-calculator', name: 'Date Difference Calculator', category: 'Converters', description: 'Two dates (YYYY-MM-DD) separated by a line containing only ---.', example: '2000-01-15\n---\n2000-03-10',
    run: t => { const [a, b] = two(t).map(dateOnly); const d = Math.round(Math.abs(b - a) / 864e5); return `${ymd(a, b)}\nTotal days: ${d}\nWeeks: ${(d / 7).toFixed(2)}\nHours: ${d * 24}` } },
  { slug: 'chmod-calculator', name: 'Chmod Calculator', category: 'Converters', description: 'Convert Unix permissions between numeric (755) and symbolic (rwxr-xr-x).', example: '755',
    run: t => { const v = t.trim(); let d
      if (/^[0-7]{3}$/.test(v)) d = [...v].map(Number); else if (/^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/.test(v)) d = [0, 3, 6].map(i => (v[i] === 'r') * 4 + (v[i + 1] === 'w') * 2 + (v[i + 2] === 'x')); else throw new Error('Enter 3 octal digits (e.g. 644) or 9 symbols (e.g. rw-r--r--).')
      return `Numeric: ${d.join('')}\nSymbolic: ${d.map(rwx).join('')}\nOwner: ${rwx(d[0])}  Group: ${rwx(d[1])}  Others: ${rwx(d[2])}\nCommand: chmod ${d.join('')} filename` } },
  { slug: 'cidr-calculator', name: 'IPv4 CIDR / Subnet Calculator', category: 'API', description: 'Calculate network, broadcast, mask and host range from an IPv4 CIDR block.', example: '192.168.1.10/24',
    run: t => { const m = t.trim().match(/^([\d.]+)\/(\d{1,2})$/); if (!m || +m[2] > 32) throw new Error('Enter an IPv4 CIDR like 192.168.1.10/24 (prefix 0–32).')
      const ip = ip2n(m[1]), n = +m[2], mask = n === 0 ? 0 : (0xFFFFFFFF << (32 - n)) >>> 0, net = (ip & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0, total = 2 ** (32 - n), two = n >= 31
      return [`Network: ${n2ip(net)}/${n}`, `Netmask: ${n2ip(mask)}`, `Wildcard: ${n2ip(~mask >>> 0)}`, `Broadcast: ${n2ip(bc)}`, `First host: ${n2ip(two ? net : net + 1)}`, `Last host: ${n2ip(two ? bc : bc - 1)}`, `Total addresses: ${total}`, `Usable hosts: ${two ? total : total - 2}`].join('\n') } },
  { slug: 'password-strength-checker', name: 'Password Strength Checker', category: 'Security', description: 'Estimate password strength locally. It is a rough estimate, not a guarantee.', note: 'ℹ Runs only in your browser. Still, avoid typing real passwords into any website you do not trust — test a similar one instead.', example: 'correct-Horse-battery-7',
    run: t => { if (!t) throw new Error('Enter a password to test.'); const pool = (/[a-z]/.test(t) * 26) + (/[A-Z]/.test(t) * 26) + (/\d/.test(t) * 10) + (/[ -/:-@[-`{-~]/.test(t) * 33) + (/[^\x20-\x7e]/.test(t) * 30)
      let bits = Math.round(t.length * Math.log2(pool || 1)); const w = []; if (t.length < 12) w.push('Shorter than 12 characters.'); if (/^(.)\1+$/.test(t)) { w.push('Only one repeated character.'); bits = Math.min(bits, 8) }
      if (/(0123|1234|2345|3456|abcd|qwer)/i.test(t)) { w.push('Contains an easy sequence.'); bits -= 10 } if (['password', '123456', 'qwerty', 'letmein', 'admin', 'welcome', 'iloveyou'].some(c => t.toLowerCase().includes(c))) { w.push('Contains a very common password.'); bits = Math.min(bits, 20) }
      bits = Math.max(0, bits); const r = bits < 28 ? 'Very weak' : bits < 36 ? 'Weak' : bits < 60 ? 'Fair' : bits < 80 ? 'Strong' : 'Very strong'
      return `Rating: ${r}\nEstimated entropy: ~${bits} bits\nLength: ${t.length}\n${w.length ? 'Warnings:\n- ' + w.join('\n- ') : 'No obvious weaknesses found.'}` } },
  { slug: 'uuid-validator', name: 'UUID Validator', category: 'Generators', description: 'Check whether a string is a valid UUID and see its version.', example: '123e4567-e89b-12d3-a456-426614174000',
    run: t => { const v = t.trim(), m = v.match(/^[0-9a-f]{8}-[0-9a-f]{4}-([1-8])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/i); if (/^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(v)) return 'Valid nil UUID ✔'
      if (!m) throw new Error('Not a valid UUID (expected 8-4-4-4-12 hex digits with a valid version and variant).'); return `Valid UUID ✔\nVersion: ${m[1]}\nVariant: RFC 4122` } },
  { slug: 'cron-expression-explainer', name: 'Cron Expression Explainer', category: 'Converters', description: 'Explain a 5-field cron expression (numbers, *, ranges, lists, steps) and list the next 5 runs in UTC.', example: '*/15 9-17 * * 1-5',
    run: t => { const f = t.trim().split(/\s+/); if (f.length !== 5) throw new Error('A cron expression has 5 fields: minute hour day-of-month month day-of-week.')
      const m = cronSet(f[0], 0, 59, 'Minute'), h = cronSet(f[1], 0, 23, 'Hour'), dm = cronSet(f[2], 1, 31, 'Day-of-month'), mo = cronSet(f[3], 1, 12, 'Month'), dw = new Set([...cronSet(f[4], 0, 7, 'Day-of-week')].map(x => x % 7))
      const show = (n, s) => `${n}: ${[...s].slice(0, 12).join(', ')}${s.size > 12 ? ', …' : ''}`, both = f[2] !== '*' && f[4] !== '*', runs = []
      let d = new Date(Math.floor(Date.now() / 6e4) * 6e4 + 6e4); for (let i = 0; i < 366 * 1440 && runs.length < 5; i++, d = new Date(d.getTime() + 6e4)) {
        const day = both ? dm.has(d.getUTCDate()) || dw.has(d.getUTCDay()) : dm.has(d.getUTCDate()) && dw.has(d.getUTCDay()); if (day && mo.has(d.getUTCMonth() + 1) && h.has(d.getUTCHours()) && m.has(d.getUTCMinutes())) runs.push(d.toISOString().replace(':00.000Z', 'Z')) }
      return [show('Minute', m), show('Hour', h), show('Day of month', dm), show('Month', mo), show('Day of week (0=Sun)', dw), '', 'Next runs (UTC):', ...(runs.length ? runs : ['none within the next year'])].join('\n') } },
  { slug: 'bmi-calculator', name: 'BMI Calculator', category: 'Calculators', description: 'Calculate Body Mass Index from weight (kg) and height (cm): “70 175”.', note: 'ℹ BMI is a general screening number, not a diagnosis. Ask a health professional for advice.', example: '70 175',
    run: t => { const [w, h] = nums(t, 2, 'Enter weight in kg and height in cm, e.g. 70 175.'); if (w <= 0 || h <= 0 || h > 300 || w > 700) throw new Error('Values look out of range.'); const b = w / (h / 100) ** 2
      return `BMI: ${b.toFixed(1)}\nCategory (WHO adult ranges): ${b < 18.5 ? 'Underweight' : b < 25 ? 'Normal weight' : b < 30 ? 'Overweight' : 'Obesity'}` } },
  { slug: 'gst-calculator', name: 'GST Calculator', category: 'Calculators', description: 'Add or remove GST/VAT: “amount rate [inclusive]”. Shows CGST/SGST split (intra-state India).', example: '1000 18',
    run: t => { const p = t.trim().split(/\s+/), a = +p[0], r = +p[1], inc = /^incl/i.test(p[2] || ''); if (!isFinite(a) || !isFinite(r) || a < 0 || r < 0 || r > 100) throw new Error('Use: amount rate [inclusive], e.g. 1000 18 or 1180 18 inclusive.')
      const base = inc ? a * 100 / (100 + r) : a, g = base * r / 100; return `Net amount: ${m2(base)}\nGST (${r}%): ${m2(g)}\n  CGST ${r / 2}%: ${m2(g / 2)}\n  SGST ${r / 2}%: ${m2(g / 2)}\nTotal: ${m2(base + g)}` } },
  { slug: 'emi-calculator', name: 'Loan EMI Calculator', category: 'Calculators', description: 'Monthly EMI from “principal annual_rate% months”.', example: '500000 8.5 60',
    run: t => { const [P, R, n] = nums(t, 3, 'Enter: principal annual-rate% months, e.g. 500000 8.5 60.'); if (P <= 0 || R < 0 || n < 1 || !Number.isInteger(n) || n > 1200) throw new Error('Principal > 0, rate ≥ 0, months a whole number 1–1200.')
      const r = R / 1200, e = r === 0 ? P / n : P * r * (1 + r) ** n / ((1 + r) ** n - 1); return `Monthly EMI: ${m2(e)}\nTotal payment: ${m2(e * n)}\nTotal interest: ${m2(e * n - P)}` } },
  { slug: 'simple-interest-calculator', name: 'Simple Interest Calculator', category: 'Calculators', description: '“principal annual_rate% years” → interest and total.', example: '10000 6 3',
    run: t => { const [P, R, y] = nums(t, 3, 'Enter: principal rate% years, e.g. 10000 6 3.'); if (P < 0 || R < 0 || y < 0) throw new Error('Values cannot be negative.'); const i = P * R * y / 100; return `Interest: ${m2(i)}\nTotal amount: ${m2(P + i)}` } },
  { slug: 'compound-interest-calculator', name: 'Compound Interest Calculator', category: 'Calculators', description: '“principal rate% years [compounds-per-year]” (default 1).', example: '10000 6 3 12',
    run: t => { const [P, R, y, n = 1] = nums(t, 3, 'Enter: principal rate% years [compounds per year].'); if (P < 0 || R < 0 || y < 0 || n < 1) throw new Error('Values must be positive.'); const A = P * (1 + R / 100 / n) ** (n * y); return `Final amount: ${m2(A)}\nInterest earned: ${m2(A - P)}` } },
  { slug: 'percentage-calculator', name: 'Percentage Calculator', category: 'Calculators', description: 'Enter two numbers “x y”: x% of y, x as % of y, and % change from x to y.', example: '15 200',
    run: t => { const [x, y] = nums(t, 2, 'Enter two numbers, e.g. 15 200.'); const f = v => isFinite(v) ? +v.toFixed(4) : 'undefined (division by zero)'; return `${x}% of ${y} = ${f(x * y / 100)}\n${x} is ${f(x / y * 100)}% of ${y}\nChange from ${x} to ${y}: ${f((y - x) / x * 100)}%` } },
  { slug: 'discount-calculator', name: 'Discount Calculator', category: 'Calculators', description: '“price discount% [tax%]” → final price and savings.', example: '2499 20 18',
    run: t => { const [p, d, tx = 0] = nums(t, 2, 'Enter: price discount% [tax%], e.g. 2499 20 18.'); if (p < 0 || d < 0 || d > 100 || tx < 0) throw new Error('Discount must be 0–100 and values positive.'); const s = p * d / 100, a = p - s; return `You save: ${m2(s)}\nPrice after discount: ${m2(a)}\nTax (${tx}%): ${m2(a * tx / 100)}\nFinal price: ${m2(a * (1 + tx / 100))}` } },
  { slug: 'tip-calculator', name: 'Tip Calculator', category: 'Calculators', description: '“bill tip% [people]” → tip, total and per-person amount.', example: '86.50 15 3',
    run: t => { const [b, tp, n = 1] = nums(t, 2, 'Enter: bill tip% [people], e.g. 86.50 15 3.'); if (b < 0 || tp < 0 || n < 1 || !Number.isInteger(n)) throw new Error('Bill/tip must be ≥ 0 and people a whole number ≥ 1.'); const tip = b * tp / 100; return `Tip: ${m2(tip)}\nTotal: ${m2(b + tip)}\nPer person (${n}): ${m2((b + tip) / n)}` } },
  { slug: 'statistics-calculator', name: 'Statistics / Average Calculator', category: 'Calculators', description: 'Mean, median, mode, range and standard deviation of a list of numbers.', example: '4, 8, 15, 16, 23, 42',
    run: t => { const a = nums(t, 1, 'Enter numbers separated by spaces or commas.'), n = a.length, s = [...a].sort((x, y) => x - y), mean = a.reduce((x, y) => x + y, 0) / n, med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2
      const c = {}; a.forEach(v => c[v] = (c[v] || 0) + 1); const mx = Math.max(...Object.values(c)), mode = mx > 1 ? Object.keys(c).filter(k => c[k] === mx).join(', ') : 'none', ss = a.reduce((x, y) => x + (y - mean) ** 2, 0), f = v => +v.toFixed(6)
      return `Count: ${n}\nSum: ${f(mean * n)}\nMean: ${f(mean)}\nMedian: ${f(med)}\nMode: ${mode}\nMin: ${s[0]}\nMax: ${s[n - 1]}\nRange: ${f(s[n - 1] - s[0])}\nStd dev (population): ${f(Math.sqrt(ss / n))}\nStd dev (sample): ${n > 1 ? f(Math.sqrt(ss / (n - 1))) : 'n/a'}` } },
  { slug: 'gcd-lcm-calculator', name: 'GCD & LCM Calculator', category: 'Calculators', description: 'Greatest common divisor and least common multiple of whole numbers.', example: '12 18 24',
    run: t => { const a = nums(t, 2, 'Enter two or more whole numbers.'); if (a.some(x => !Number.isInteger(x) || x <= 0 || x > 1e9)) throw new Error('Use positive whole numbers up to 1,000,000,000.'); const g = a.reduce(gcd), l = a.reduce((x, y) => x / gcd(x, y) * y); if (!Number.isSafeInteger(l)) throw new Error('LCM is too large.'); return `GCD: ${g}\nLCM: ${l}` } },
  { slug: 'prime-number-checker', name: 'Prime Number Checker', category: 'Calculators', description: 'Check if a number (up to 10¹²) is prime and see its prime factors.', example: '360',
    run: t => { const n = Number(t.trim()); if (!Number.isInteger(n) || n < 2 || n > 1e12) throw new Error('Enter a whole number from 2 to 1,000,000,000,000.'); let x = n; const f = []; for (let d = 2; d * d <= x; d++) while (x % d === 0) { f.push(d); x /= d } if (x > 1) f.push(x)
      return f.length === 1 ? `${n} is prime ✔` : `${n} is not prime.\nPrime factors: ${f.join(' × ')}` } },
  { slug: 'number-to-words', name: 'Number to Words Converter', category: 'Converters', description: 'Write a whole number (up to 999 billion) in English words.', example: '1250000',
    run: t => { const v = t.trim().replace(/,/g, ''); if (!/^-?\d+$/.test(v)) throw new Error('Enter a whole number like 1250000.'); const n = Math.abs(+v); if (n > 999999999999) throw new Error('Maximum is 999,999,999,999.'); return (v[0] === '-' ? 'minus ' : '') + words2(n) } },
  { slug: 'leap-year-checker', name: 'Leap Year Checker', category: 'Calculators', description: 'Check whether a year is a leap year.', example: '2100',
    run: t => { const y = Number(t.trim()); if (!Number.isInteger(y) || y < 1 || y > 9999) throw new Error('Enter a year from 1 to 9999.'); const l = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; return `${y} ${l ? 'is' : 'is not'} a leap year (${l ? 366 : 365} days).\nRule: divisible by 4, except century years unless divisible by 400.` } },
  { slug: 'day-of-week-finder', name: 'Day of the Week Finder', category: 'Converters', description: 'Find the weekday of any date (YYYY-MM-DD).', example: '2026-11-07',
    run: t => { const d = dateOnly(t), start = Date.UTC(d.getUTCFullYear(), 0, 0); return `${d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })}\nDay of year: ${Math.round((d - start) / 864e5)}` } },
  { slug: 'time-duration-converter', name: 'Time Duration Converter', category: 'Units', description: 'Seconds → days/hours/minutes, or “2h 30m” → seconds.', example: '93784',
    run: t => { const v = t.trim(); let s; if (/^\d+(\.\d+)?$/.test(v)) s = +v; else { const re = /(\d+(?:\.\d+)?)\s*([dhms])/gi; let m, tot = 0, any = false; while ((m = re.exec(v))) { any = true; tot += +m[1] * { d: 86400, h: 3600, m: 60, s: 1 }[m[2].toLowerCase()] } if (!any || v.replace(re, '').trim()) throw new Error('Enter seconds (93784) or a duration like “1d 2h 3m 4s”.'); s = tot }
      const r = Math.round(s); return `${Math.floor(r / 86400)}d ${Math.floor(r % 86400 / 3600)}h ${Math.floor(r % 3600 / 60)}m ${r % 60}s\nTotal seconds: ${r}\nTotal minutes: ${+(r / 60).toFixed(4)}\nTotal hours: ${+(r / 3600).toFixed(4)}` } },
  { slug: 'temperature-converter', name: 'Temperature Converter', category: 'Units', description: 'Convert Celsius, Fahrenheit and Kelvin: “100 C”.', example: '100 C',
    run: t => { const m = t.trim().match(/^(-?\d*\.?\d+)\s*°?\s*([cfk])$/i); if (!m) throw new Error('Enter a value and unit C, F or K, e.g. 100 C.'); const v = +m[1], u = m[2].toUpperCase(), c = u === 'C' ? v : u === 'F' ? (v - 32) * 5 / 9 : v - 273.15
      if (c < -273.15) throw new Error('That is below absolute zero.'); const f = x => +x.toFixed(4); return `Celsius: ${f(c)} °C\nFahrenheit: ${f(c * 9 / 5 + 32)} °F\nKelvin: ${f(c + 273.15)} K` } },
  { slug: 'length-converter', name: 'Length Converter', category: 'Units', description: 'Convert mm, cm, m, km, in, ft, yd, mi: “5 km”.', example: '5 km', run: unitTool({ mm: .001, cm: .01, m: 1, km: 1000, in: .0254, ft: .3048, yd: .9144, mi: 1609.344 }, '5 km') },
  { slug: 'weight-converter', name: 'Weight / Mass Converter', category: 'Units', description: 'Convert mg, g, kg, t, oz, lb: “70 kg”.', example: '70 kg', run: unitTool({ mg: 1e-6, g: .001, kg: 1, t: 1000, oz: .028349523125, lb: .45359237 }, '70 kg') },
  { slug: 'speed-converter', name: 'Speed Converter', category: 'Units', description: 'Convert m/s, km/h, mph and knots: “100 km/h”.', example: '100 km/h', run: unitTool({ 'm/s': 1, 'km/h': 1 / 3.6, mph: .44704, kn: .514444 }, '100 km/h') },
  { slug: 'area-converter', name: 'Area Converter', category: 'Units', description: 'Convert m², km², ha, acre, ft², in², yd²: write squares as m2, ft2…', example: '2 acre', run: unitTool({ m2: 1, km2: 1e6, ha: 1e4, acre: 4046.8564224, ft2: .09290304, in2: .00064516, yd2: .83612736 }, '2 acre') },
  { slug: 'volume-converter', name: 'Volume Converter', category: 'Units', description: 'Convert ml, l, m3, tsp, tbsp, cup, floz, gal (US units).', example: '2 cup', run: unitTool({ ml: .001, l: 1, m3: 1000, tsp: .00492892159375, tbsp: .01478676478125, floz: .0295735295625, cup: .2365882365, gal: 3.785411784 }, '2 cup') },
  { slug: 'title-case-converter', name: 'Title Case Converter', category: 'Text', description: 'Capitalize text as a title (small words stay lowercase except first and last).', example: 'the quick brown fox jumps over a lazy dog',
    run: t => { const sm = new Set('a an the and but or for nor on at to by of in as'.split(' ')), w = t.toLowerCase().split(/(\s+)/); const idx = w.map((x, i) => /\S/.test(x) ? i : -1).filter(i => i >= 0)
      return w.map((x, i) => /\S/.test(x) && (!sm.has(x) || i === idx[0] || i === idx[idx.length - 1]) ? x[0].toUpperCase() + x.slice(1) : x).join('') } },
]
export const bySlug = s => tools.find(t => t.slug === s)
export { mdHtml }
// tools whose example output varies by time, randomness, timezone or network — not shown as a fixed example
export const VOLATILE = ['uuid-generator', 'ulid-generator', 'password-generator', 'random-number-generator', 'dns-lookup', 'age-calculator', 'date-converter', 'cron-expression-explainer', 'unix-timestamp-converter']
