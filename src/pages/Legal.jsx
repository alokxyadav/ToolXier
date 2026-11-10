import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LEGAL } from './legal.js'
export default function Legal({ page }) {
  const p = LEGAL[page]; useEffect(() => { document.title = `${p.title} | ToolXier` }, [page])
  return <article><h1>{p.title}</h1>{p.body.map((t, i) => <p key={i}>{t}</p>)}</article>
}
