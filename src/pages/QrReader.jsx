import { useState, useEffect } from 'react'
export default function QrReader() {
  const [out, setOut] = useState(''), [err, setErr] = useState('')
  useEffect(() => { document.title = 'QR Code Reader / Decoder (Private) | ToolXier' }, [])
  const onFile = async e => { const f = e.target.files[0]; setOut(''); setErr(''); if (!f) return
    if (!/^image\/(png|jpeg|webp|gif)$/.test(f.type) || f.size > 15 * 1024 * 1024) return setErr('Use a PNG, JPEG, WebP or GIF under 15 MB.')
    try { const b = await createImageBitmap(f), c = document.createElement('canvas'); c.width = b.width; c.height = b.height; const x = c.getContext('2d'); x.drawImage(b, 0, 0)
      const { default: jsQR } = await import('jsqr'), r = jsQR(x.getImageData(0, 0, c.width, c.height).data, c.width, c.height); r ? setOut(r.data) : setErr('No QR code found. Try a sharper, well-lit image.') } catch { setErr('Could not read this image.') } }
  return (<article><h1>QR Code Reader</h1><p>Decode a QR code from an image. Processed locally — nothing is uploaded. Links are shown as text and are never opened automatically.</p>
    <label htmlFor="qf"><b>QR image</b></label><input id="qf" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onFile} />
    <div aria-live="polite">{err && <p className="err" role="alert">{err}</p>}</div>{out && <><h2>Decoded text</h2><pre>{out}</pre><button onClick={() => navigator.clipboard.writeText(out)}>Copy</button></>}</article>)
}
