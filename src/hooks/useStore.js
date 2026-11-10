export const read = k => { try { return JSON.parse(localStorage.getItem(k)) || [] } catch { return [] } }
export const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }
export const toggle = (k, slug) => { const a = read(k), n = a.includes(slug) ? a.filter(x => x !== slug) : [...a, slug]; write(k, n); return n }
export const pushRecent = slug => write('tx:recent', [slug, ...read('tx:recent').filter(x => x !== slug)].slice(0, 6))
