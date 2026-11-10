import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { bySlug, tools, VOLATILE } from '../tools/registry.js'
import useSeo from '../hooks/useSeo.js'
import { read, toggle, pushRecent } from '../hooks/useStore.js'
export default function ToolPage() {
  const { slug } = useParams(), tool = bySlug(slug)
  useSeo(tool && { title: `${tool.name} Online — Free | ToolXier`, description: `${tool.description} Free, private, runs in your browser.`, path: `/tools/${slug}`, name: tool.name })
  const fileRef = useRef(), [ex, setEx] = useState(null), [fav, setFav] = useState(() => read('tx:fav').includes(slug)), [input, setInput] = useState(''), [out, setOut] = useState(''), [err, setErr] = useState(''), [msg, setMsg] = useState('')
  useEffect(() => { setInput(''); setOut(''); setErr(''); setMsg('')
    setFav(read('tx:fav').includes(slug)); if (tool) { pushRecent(slug); } }, [slug])
  useEffect(() => { setEx(null); if (!tool || VOLATILE.includes(slug) || !tool.example) return; let off = false
    Promise.resolve().then(() => tool.run(tool.example)).then(o => !off && setEx({ ok: true, o })).catch(e => !off && setEx({ ok: false, o: e.message })); return () => { off = true } }, [slug])
  if (!tool) return <><h1>Tool not found</h1><Link to="/">Back to all tools</Link></>
  const run = async () => { setErr(''); setMsg('')
    if (input.length > 2_000_000) { setOut(''); return setErr('Input is too large (2 MB max). Split it into smaller parts.') }
    try { setOut(await tool.run(input)); setMsg('Done') } catch (e) { setOut(''); setErr(e.message || 'Invalid input') } }
  const copy = async () => { try { await navigator.clipboard.writeText(out); setMsg('Copied') } catch { setErr('Copy failed — select the text manually.') } }
  const download = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([out])); a.download = `${tool.slug}.txt`; a.click(); URL.revokeObjectURL(a.href) }
  const related = tools.filter(t => t.category === tool.category && t.slug !== slug).slice(0, 4)
  return (<article>
    <nav aria-label="Breadcrumb"><Link to="/">Tools</Link> › {tool.category} › {tool.name}</nav>
    <h1>{tool.name} <button aria-pressed={fav} aria-label={fav ? 'Remove from favorites' : 'Add to favorites'} onClick={() => setFav(toggle('tx:fav', slug).includes(slug))}>{fav ? '★' : '☆'}</button></h1><p>{tool.description}</p>
    {tool.note && <p className="warn" role="note">{tool.note}</p>}
    <div className="panes"><div><label htmlFor="in"><b>Input</b></label>
      <textarea id="in" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run() }} spellCheck="false" aria-describedby="hint" />
      <small id="hint">Tip: Ctrl/⌘ + Enter runs the tool.</small></div>
      <div><label htmlFor="out"><b>Output</b></label><textarea id="out" readOnly value={out} /></div></div>
    <div className="row"><button className="primary" onClick={run}>Run</button>
      <button onClick={() => setInput(tool.example)}>Example</button>
      <button onClick={() => fileRef.current.click()}>Open file</button><input ref={fileRef} type="file" hidden aria-label="Open a text file" accept=".txt,.json,.csv,.xml,.yaml,.yml,.md,.html,.css,.js,.log,text/*" onChange={e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; if (f.size > 2_000_000) return setErr('File is larger than 2 MB.'); const r = new FileReader(); r.onload = () => { setInput(String(r.result)); setErr(''); setMsg('File loaded') }; r.onerror = () => setErr('Could not read that file.'); r.readAsText(f) }} />
      <button onClick={copy} disabled={!out}>Copy</button><button onClick={download} disabled={!out}>Download</button>
      <button onClick={() => { setInput(''); setOut(''); setErr(''); setMsg('') }}>Clear</button>
      <button onClick={() => { setInput(out); setOut(''); setMsg('') }} disabled={!out}>Use output as input</button></div>
    <div aria-live="polite">{err && <p className="err" role="alert">{err}</p>}{msg && <p className="ok">{msg}</p>}</div>
    {ex && <section aria-labelledby="exh"><h2 id="exh">Example</h2><p>Input:</p><pre>{tool.example}</pre><p>{ex.ok ? 'Result:' : 'This input produces an error:'}</p><pre>{ex.o}</pre></section>}
    {!!related.length && <><h2>Related tools</h2><div className="grid">{related.map(t => <Link key={t.slug} className="card" to={`/tools/${t.slug}`}><b>{t.name}</b><p>{t.description}</p></Link>)}</div></>}
  </article>)
}
