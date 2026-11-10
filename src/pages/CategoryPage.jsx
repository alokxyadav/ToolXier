import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ITEMS, CATS } from '../tools/items.js'
export default function CategoryPage() {
  const { cat } = useParams(), name = CATS.find(c => c.toLowerCase() === cat), list = ITEMS.filter(t => t.category === name)
  useEffect(() => { document.title = name ? `Free Online ${name} Tools | ToolXier` : '404 — Not found | ToolXier' }, [cat])
  if (!name) return <><h1>Category not found</h1><Link to="/">All tools</Link></>
  return (<article><nav aria-label="Breadcrumb"><Link to="/">Tools</Link> › {name}</nav><h1>Free Online {name} Tools</h1><p>{list.length} free {name.toLowerCase()} tools that run in your browser — no sign-up, no uploads.</p>
    <div className="grid">{list.map(t => <Link key={t.id} className="card" to={t.path}><h2 style={{ fontSize: '1.1rem', margin: 0 }}>{t.name}</h2><p>{t.description}</p></Link>)}</div></article>)
}
