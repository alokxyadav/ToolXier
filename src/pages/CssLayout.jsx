import { useState, useEffect } from 'react'
const Sel = ({ l, v, set, opts }) => <label>{l} <select value={v} onChange={e => set(e.target.value)}>{opts.map(o => <option key={o}>{o}</option>)}</select></label>
export default function CssLayout() {
  const [mode, setMode] = useState('flex'), [o, setO] = useState({ dir: 'row', jc: 'flex-start', ai: 'stretch', wrap: 'nowrap', gap: 8, cols: 3 }), [msg, setMsg] = useState('')
  useEffect(() => { document.title = 'Flexbox & CSS Grid Playground | ToolXier' }, [])
  const s = k => v => setO(p => ({ ...p, [k]: v }))
  const style = mode === 'flex' ? { display: 'flex', flexDirection: o.dir, justifyContent: o.jc, alignItems: o.ai, flexWrap: o.wrap, gap: o.gap } : { display: 'grid', gridTemplateColumns: `repeat(${o.cols}, 1fr)`, gap: o.gap }
  const css = mode === 'flex' ? `display: flex;\nflex-direction: ${o.dir};\njustify-content: ${o.jc};\nalign-items: ${o.ai};\nflex-wrap: ${o.wrap};\ngap: ${o.gap}px;` : `display: grid;\ngrid-template-columns: repeat(${o.cols}, 1fr);\ngap: ${o.gap}px;`
  return (<article><h1>Flexbox &amp; Grid Playground</h1>
    <div className="row"><button aria-pressed={mode === 'flex'} className={mode === 'flex' ? 'primary' : ''} onClick={() => setMode('flex')}>Flexbox</button><button aria-pressed={mode === 'grid'} className={mode === 'grid' ? 'primary' : ''} onClick={() => setMode('grid')}>Grid</button></div>
    <div className="row">{mode === 'flex' ? <><Sel l="direction" v={o.dir} set={s('dir')} opts={['row', 'row-reverse', 'column', 'column-reverse']} /><Sel l="justify" v={o.jc} set={s('jc')} opts={['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']} />
      <Sel l="align" v={o.ai} set={s('ai')} opts={['stretch', 'flex-start', 'center', 'flex-end', 'baseline']} /><Sel l="wrap" v={o.wrap} set={s('wrap')} opts={['nowrap', 'wrap', 'wrap-reverse']} /></>
      : <label>columns <input type="number" min="1" max="8" value={o.cols} onChange={e => s('cols')(Math.min(8, Math.max(1, +e.target.value || 1)))} style={{ width: 80 }} /></label>}
      <label>gap <input type="number" min="0" max="48" value={o.gap} onChange={e => s('gap')(Math.min(48, Math.max(0, +e.target.value || 0)))} style={{ width: 80 }} /></label></div>
    <div style={{ ...style, minHeight: 180, padding: 8, border: '1px dashed var(--bd)', borderRadius: 10 }} aria-label="Layout preview">{[1, 2, 3, 4, 5, 6].map(n => <div key={n} style={{ background: 'var(--ac)', color: '#fff', padding: '12px 18px', borderRadius: 8, height: n % 2 ? 40 : 64 }}>{n}</div>)}</div>
    <h2>CSS</h2><pre>{css}</pre><div className="row"><button onClick={async () => { try { await navigator.clipboard.writeText(css); setMsg('Copied') } catch { setMsg('Copy failed') } }}>Copy CSS</button><span role="status">{msg}</span></div></article>)
}
