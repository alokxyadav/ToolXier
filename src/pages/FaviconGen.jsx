import { useState, useEffect } from 'react'
const SIZES = [16, 32, 48, 180, 192, 512]
export default function FaviconGen() {
  const [icons, setIcons] = useState([]), [err, setErr] = useState('')
  useEffect(() => { document.title = 'Favicon Generator (PNG sizes, Private) | ToolXier' }, [])
  useEffect(() => () => icons.forEach(i => URL.revokeObjectURL(i.url)), [icons])
  const onFile = async e => { const f = e.target.files[0]; setErr(''); setIcons([]); if (!f) return
    if (!/^image\/(png|jpeg|webp|gif)$/.test(f.type) || f.size > 10 * 1024 * 1024) return setErr('Use a PNG, JPEG, WebP or GIF under 10 MB.')
    try { const b = await createImageBitmap(f), side = Math.min(b.width, b.height), out = []
      for (const n of SIZES) { const c = document.createElement('canvas'); c.width = c.height = n; c.getContext('2d').drawImage(b, (b.width - side) / 2, (b.height - side) / 2, side, side, 0, 0, n, n)
        const blob = await new Promise(r => c.toBlob(r, 'image/png')); out.push({ n, url: URL.createObjectURL(blob) }) } setIcons(out) } catch { setErr('Could not read this image.') } }
  return (<article><h1>Favicon Generator</h1><p>Creates square PNG icons (center-cropped) in your browser. Nothing is uploaded. Use a square image of at least 512×512 for best results.</p>
    <label htmlFor="ff"><b>Image</b></label><input id="ff" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onFile} />
    <div aria-live="polite">{err && <p className="err" role="alert">{err}</p>}</div>
    <div className="grid">{icons.map(i => <div key={i.n} className="card"><img src={i.url} alt={`${i.n} pixel icon`} width={Math.min(i.n, 96)} /><p>{i.n}×{i.n}</p><a href={i.url} download={`icon-${i.n}.png`}>Download</a></div>)}</div></article>)
}
