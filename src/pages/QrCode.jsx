import { useState, useEffect } from 'react'
export default function QrCode() {
  const [text, setText] = useState('https://github.com/alokxyadav/ToolXier'), [size, setSize] = useState(256), [img, setImg] = useState(''), [err, setErr] = useState('')
  useEffect(() => { document.title = 'QR Code Generator (Free, Private) | ToolXier' }, [])
  const make = async () => { setErr(''); setImg(''); if (!text.trim()) return setErr('Enter some text or a URL.'); if (text.length > 1000) return setErr('Text is too long (max 1000 characters).')
    try { const { default: Q } = await import('qrcode'); setImg(await Q.toDataURL(text, { width: size, margin: 2, errorCorrectionLevel: 'M' })) } catch { setErr('Could not generate a QR code for this input.') } }
  return (<article><h1>QR Code Generator</h1><p>Generated locally in your browser. Nothing is uploaded.</p>
    <label htmlFor="q"><b>Text or URL</b></label><textarea id="q" value={text} onChange={e => setText(e.target.value)} style={{ minHeight: 100 }} />
    <div className="row"><label>Size <select value={size} onChange={e => setSize(+e.target.value)}>{[128, 256, 512, 1024].map(n => <option key={n} value={n}>{n}px</option>)}</select></label>
      <button className="primary" onClick={make}>Generate</button></div>
    <div aria-live="polite">{err && <p className="err" role="alert">{err}</p>}</div>
    {img && <><img src={img} alt="Generated QR code" width={Math.min(size, 320)} /><div className="row"><a href={img} download="toolxier-qr.png"><button>Download PNG</button></a></div></>}
  </article>)
}
