import { useState, useEffect } from 'react'
import { mdHtml } from '../tools/registry.js'
export default function MarkdownPreview() {
  const [t, setT] = useState('# Hello\n\nType **Markdown** here.\n\n- fast\n- private')
  useEffect(() => { document.title = 'Markdown Previewer (Live, Safe) | ToolXier' }, [])
  const doc = `<style>body{font:16px/1.6 system-ui;padding:12px;color:#0f172a}code{background:#f1f5f9;padding:2px 4px;border-radius:4px}</style>${mdHtml(t)}`
  return (<article><h1>Markdown Preview</h1><p>Rendered inside a fully sandboxed frame; scripts cannot run. Supports headings, lists, bold, italic, code and http(s) links.</p>
    <div className="panes"><div><label htmlFor="md"><b>Markdown</b></label><textarea id="md" value={t} onChange={e => setT(e.target.value)} spellCheck="false" /></div>
      <div><b>Preview</b><iframe title="Markdown preview" sandbox="" srcDoc={doc} style={{ width: '100%', height: 200, minHeight: 180, border: '1px solid var(--bd)', borderRadius: 10, background: '#fff' }} /></div></div></article>)
}
