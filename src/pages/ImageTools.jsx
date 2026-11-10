import { useState, useEffect, useRef } from 'react'
const kb = n => (n / 1024).toFixed(1) + ' KB'
export default function ImageTools() {
  const [file, setFile] = useState(null), [w, setW] = useState(1024), [fmt, setFmt] = useState('image/webp'), [q, setQ] = useState(0.8)
  const [res, setRes] = useState(null), [err, setErr] = useState(''), [busy, setBusy] = useState(false), [msg, setMsg] = useState(''), url = useRef(null)
  useEffect(() => { document.title = 'Image Compressor, Resizer & Converter (Private) | ToolXier' }, [])
  useEffect(() => () => url.current && URL.revokeObjectURL(url.current), [])
  const pickFile = e => { const f = e.target.files[0]; setRes(null); setErr(''); setMsg('')
    if (!f) return setFile(null); if (!/^image\/(png|jpeg|webp|gif)$/.test(f.type)) { setFile(null); return setErr('Use a PNG, JPEG, WebP or GIF image.') }
    if (f.size > 25 * 1024 * 1024) { setFile(null); return setErr('File is larger than 25 MB.') } setFile(f) }
  const run = async () => { if (!file) return setErr('Choose an image first.'); if (!(w >= 16 && w <= 8000)) return setErr('Width must be 16–8000 px.')
    setBusy(true); setErr(''); setMsg('')
    try { const bmp = await createImageBitmap(file), s = Math.min(1, w / bmp.width), c = document.createElement('canvas'); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s)
      const ctx = c.getContext('2d'); if (fmt === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height) } ctx.drawImage(bmp, 0, 0, c.width, c.height)
      const blob = await new Promise(r => c.toBlob(r, fmt, q)); if (!blob) throw new Error('This browser cannot export that format.')
      url.current && URL.revokeObjectURL(url.current); url.current = URL.createObjectURL(blob); setRes({ blob, url: url.current, w: c.width, h: c.height })
    } catch (e) { setErr(e.message || 'Could not process this image.') } finally { setBusy(false) } }
  const ext = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' }[fmt]
  const b64 = () => { const r = new FileReader(); r.onload = async () => { try { await navigator.clipboard.writeText(r.result); setMsg('Base64 data URL copied') } catch { setErr('Copy failed.') } }; r.readAsDataURL(res.blob) }
  return (<article><h1>Image Compressor, Resizer &amp; Converter</h1><p>Runs entirely in your browser — images are never uploaded. Re-encoding removes metadata such as EXIF/GPS.</p>
    <label htmlFor="f"><b>Image</b></label><input id="f" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={pickFile} />
    <div className="row"><label>Max width (px) <input type="number" min="16" max="8000" value={w} onChange={e => setW(+e.target.value)} style={{ width: 110 }} /></label>
      <label>Format <select value={fmt} onChange={e => setFmt(e.target.value)}><option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option></select></label>
      <label>Quality {Math.round(q * 100)}% <input type="range" min="0.1" max="1" step="0.05" value={q} onChange={e => setQ(+e.target.value)} disabled={fmt === 'image/png'} /></label></div>
    <div className="row"><button className="primary" onClick={run} disabled={busy}>{busy ? 'Processing…' : 'Convert'}</button></div>
    <div aria-live="polite">{err && <p className="err" role="alert">{err}</p>}{msg && <p className="ok">{msg}</p>}</div>
    {res && <><p>{kb(file.size)} → <b>{kb(res.blob.size)}</b> ({res.w}×{res.h})</p><img src={res.url} alt="Converted result preview" style={{ maxWidth: '100%', maxHeight: 360 }} />
      <div className="row"><a href={res.url} download={`toolxier-image.${ext}`}><button>Download</button></a><button onClick={b64}>Copy Base64</button></div></>}
  </article>)
}
