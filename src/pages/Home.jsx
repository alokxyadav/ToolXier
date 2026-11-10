import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ITEMS, CATS, ICON, POPULAR, byId } from '../tools/items.js'
import { read } from '../hooks/useStore.js'
const Card = ({ it }) => <Link className="card tile" to={it.path}><span className="ico" aria-hidden="true">{ICON[it.category]}</span><span className="ctext"><b>{it.name}</b><span>{it.description}</span></span></Link>
const slug = c => `cat-${c.toLowerCase()}`
export default function Home() {
  const [q, setQ] = useState(''), [active, setActive] = useState(''), [view, setView] = useState(() => { try { return localStorage.getItem('tx:view') || 'grid' } catch { return 'grid' } })
  useEffect(() => { document.title = 'ToolXier — Free Online Developer Tools & Calculators' }, [])
  useEffect(() => { try { localStorage.setItem('tx:view', view) } catch { /* ignore */ } }, [view])
  useEffect(() => { if (!('IntersectionObserver' in window)) return; const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-15% 0px -75% 0px' })
    document.querySelectorAll('section[data-cat]').forEach(s => io.observe(s)); return () => io.disconnect() }, [q])
  const s = q.trim().toLowerCase(), hits = s ? ITEMS.filter(i => `${i.name} ${i.description} ${i.category}`.toLowerCase().includes(s)) : []
  const strip = (title, k) => { const l = read(k).map(byId).filter(Boolean); return l.length ? <section><h2>{title}</h2><div className="row chips">{l.map(t => <Link key={t.id} to={t.path}><button>{t.name}</button></Link>)}</div></section> : null }
  const list = items => <div className={view === 'grid' ? 'grid' : 'list'}>{items.map(i => <Card key={i.id} it={i} />)}</div>
  return (<>
    <section className="hero"><h1>Everything Developers Need. In One Place.</h1>
      <p>{ITEMS.length} free, open-source tools — developer utilities, calculators, converters and image tools — that run in your browser. No sign-up.</p>
      <label htmlFor="s" className="sr">Search tools</label><input id="s" type="search" placeholder="Search tools (e.g. JSON, JWT, UUID, BMI)…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="stats" aria-label="Site facts"><span><b>{ITEMS.length}</b> tools</span><span><b>{CATS.length}</b> categories</span><span><b>0</b> uploads</span><span><b>Offline</b> ready</span></div></section>
    <div className="dash">
      <aside className="side"><nav aria-label="Categories">{CATS.map(c => <a key={c} href={`#${slug(c)}`} className={active === slug(c) ? 'on' : ''}><span className="ico" aria-hidden="true">{ICON[c]}</span>{c}<small>{ITEMS.filter(i => i.category === c).length}</small></a>)}</nav></aside>
      <div className="dmain">
        <div className="row toolbar"><span role="status">{s ? `${hits.length} result${hits.length === 1 ? '' : 's'}` : 'All tools'}</span><span className="row" role="group" aria-label="Layout">
          <button aria-pressed={view === 'grid'} className={view === 'grid' ? 'primary' : ''} onClick={() => setView('grid')}>Grid</button><button aria-pressed={view === 'list'} className={view === 'list' ? 'primary' : ''} onClick={() => setView('list')}>List</button></span></div>
        {s ? (hits.length ? list(hits) : <p>No tools match “{q}”.</p>) : <>
          {strip('★ Favorites', 'tx:fav')}{strip('Recently used', 'tx:recent')}
          <section><h2>Popular</h2>{list(POPULAR.map(byId).filter(Boolean))}</section>
          {CATS.map(c => { const items = ITEMS.filter(i => i.category === c); return (<section key={c} id={slug(c)} data-cat aria-labelledby={`h-${slug(c)}`}>
            <div className="sechead"><h2 id={`h-${slug(c)}`}><span className="ico" aria-hidden="true">{ICON[c]}</span> {c} <small>({items.length})</small></h2><Link to={`/category/${c.toLowerCase()}`}>View all {c} →</Link></div>{list(items)}</section>) })}</>}
      </div></div>
  </>)
}
