import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { tools } from '../tools/registry.js'
import { EXTRA } from '../pages/extra.js'
const ALL = [...EXTRA.map(p => ({ path: p.path, name: p.name, desc: p.desc })), ...tools.map(t => ({ path: `/tools/${t.slug}`, name: t.name, desc: t.description }))]
export default function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState(''), [i, setI] = useState(0), ref = useRef(), nav = useNavigate()
  useEffect(() => { if (!open) return; const prev = document.activeElement; setQ(''); setI(0); setTimeout(() => ref.current?.focus(), 0); return () => prev?.focus?.() }, [open])
  if (!open) return null
  const s = q.toLowerCase().trim(), list = (s ? ALL.filter(x => (x.name + ' ' + x.desc).toLowerCase().includes(s)) : ALL).slice(0, 8)
  const go = x => { nav(x.path); onClose() }
  const key = e => { if (e.key === 'Escape') onClose(); else if (e.key === 'ArrowDown') { e.preventDefault(); setI(v => Math.min(v + 1, list.length - 1)) } else if (e.key === 'ArrowUp') { e.preventDefault(); setI(v => Math.max(v - 1, 0)) } else if (e.key === 'Enter' && list[i]) go(list[i]) }
  return (<div className="pal-bg" onClick={onClose}><div role="dialog" aria-modal="true" aria-label="Search tools" className="pal" onClick={e => e.stopPropagation()} onKeyDown={key}>
    <input ref={ref} role="combobox" aria-expanded="true" aria-controls="pal-list" aria-activedescendant={list[i] ? `pal-${i}` : undefined} aria-label="Search tools" placeholder="Search 100+ tools…" value={q} onChange={e => { setQ(e.target.value); setI(0) }} />
    <ul id="pal-list" role="listbox">{list.map((x, n) => <li key={x.path} id={`pal-${n}`} role="option" aria-selected={n === i} onMouseEnter={() => setI(n)} onClick={() => go(x)}><b>{x.name}</b><span>{x.desc}</span></li>)}{!list.length && <li>No matches</li>}</ul></div></div>)
}
