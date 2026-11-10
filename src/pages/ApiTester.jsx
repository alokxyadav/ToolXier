import { useState, useEffect } from 'react'
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
export default function ApiTester() {
  const [method, setMethod] = useState('GET'), [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1')
  const [headers, setHeaders] = useState('Accept: application/json'), [body, setBody] = useState('')
  const [res, setRes] = useState(null), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => { document.title = 'Free Online API Tester (REST Client) | ToolXier' }, [])
  const send = async () => { setErr(''); setRes(null)
    let u; try { u = new URL(url); if (!/^https?:$/.test(u.protocol)) throw 0 } catch { return setErr('Enter a valid http(s) URL.') }
    const h = {}; for (const l of headers.split('\n').filter(x => x.trim())) { const i = l.indexOf(':'); if (i < 1) return setErr(`Bad header line: “${l}”. Use Key: Value.`); h[l.slice(0, i).trim()] = l.slice(i + 1).trim() }
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 20000), t0 = performance.now(); setBusy(true)
    try { const r = await fetch(u, { method, headers: h, body: ['GET', 'HEAD'].includes(method) || !body ? undefined : body, signal: ctl.signal })
      const text = await r.text(); let pretty = text; try { pretty = JSON.stringify(JSON.parse(text), null, 2) } catch { /* not JSON */ }
      setRes({ status: `${r.status} ${r.statusText}`, ms: Math.round(performance.now() - t0), headers: [...r.headers].map(([k, v]) => `${k}: ${v}`).join('\n'), body: pretty })
    } catch (e) { setErr(e.name === 'AbortError' ? 'Request timed out after 20 s.' : 'Request failed. Most often this is a CORS block: the target server must send Access-Control-Allow-Origin for this site. A browser cannot bypass CORS; try the API from a server or a CORS-enabled endpoint. It can also be a network error or a mixed-content (http from https) block.') }
    finally { clearTimeout(timer); setBusy(false) } }
  return (<article><h1>API Tester</h1><p>Send REST requests straight from your browser. Requests go directly to the target API — nothing passes through ToolXier servers and nothing is saved.</p>
    <p className="warn" role="note">Browser requests are subject to CORS. Put tokens only in the Authorization header (e.g. <code>Authorization: Bearer …</code>) and only for APIs you trust.</p>
    <div className="row"><label className="sr" htmlFor="m">Method</label><select id="m" value={method} onChange={e => setMethod(e.target.value)}>{METHODS.map(m => <option key={m}>{m}</option>)}</select>
      <label className="sr" htmlFor="u">URL</label><input id="u" style={{ flex: 1, minWidth: 200 }} value={url} onChange={e => setUrl(e.target.value)} />
      <button className="primary" onClick={send} disabled={busy}>{busy ? 'Sending…' : 'Send'}</button></div>
    <div className="panes"><div><label htmlFor="h"><b>Headers</b> (one per line)</label><textarea id="h" value={headers} onChange={e => setHeaders(e.target.value)} spellCheck="false" /></div>
      <div><label htmlFor="b"><b>Body</b></label><textarea id="b" value={body} onChange={e => setBody(e.target.value)} spellCheck="false" /></div></div>
    <div aria-live="polite">{err && <p className="err" role="alert">{err}</p>}</div>
    {res && <><p><b>{res.status}</b> · {res.ms} ms</p><h2>Response body</h2><pre>{res.body}</pre><div className="row"><button onClick={() => navigator.clipboard.writeText(res.body)}>Copy</button></div><h2>Response headers</h2><pre>{res.headers}</pre></>}
  </article>)
}
