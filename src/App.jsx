import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import { EXTRA } from './pages/extra.js'
const Home = lazy(() => import('./pages/Home.jsx'))
const ToolPage = lazy(() => import('./pages/ToolPage.jsx'))
const COMP = { '/api-tester': lazy(() => import('./pages/ApiTester.jsx')), '/image-tools': lazy(() => import('./pages/ImageTools.jsx')), '/qr-code': lazy(() => import('./pages/QrCode.jsx')),
  '/markdown-preview': lazy(() => import('./pages/MarkdownPreview.jsx')), '/css-layout': lazy(() => import('./pages/CssLayout.jsx')), '/favicon-generator': lazy(() => import('./pages/FaviconGen.jsx')), '/qr-reader': lazy(() => import('./pages/QrReader.jsx')) }
const Legal = lazy(() => import('./pages/Legal.jsx'))
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'))
const REPO = 'https://github.com/alokxyadav/ToolXier'
const NotFound = () => { useEffect(() => { document.title = '404 — Page not found | ToolXier' }, []); return <><h1>404 — Page not found</h1><Link to="/">Back to all tools</Link></> }
export default function App() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('tx:theme') || 'auto' } catch { return 'auto' } })
  useEffect(() => { const r = document.documentElement; theme === 'auto' ? r.removeAttribute('data-theme') : r.setAttribute('data-theme', theme); try { localStorage.setItem('tx:theme', theme) } catch { /* ignore */ } }, [theme])
  const [pal, setPal] = useState(false), [dp, setDp] = useState(null)
  useEffect(() => { const k = e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal(v => !v) } }, h = e => { e.preventDefault(); setDp(e) }
    window.addEventListener('keydown', k); window.addEventListener('beforeinstallprompt', h); return () => { window.removeEventListener('keydown', k); window.removeEventListener('beforeinstallprompt', h) } }, [])
  return (<>
    <a href="#main" className="sr">Skip to content</a>
    <header><nav className="wrap" aria-label="Main"><Link className="logo" to="/">ToolXier</Link><Link to="/">All Tools</Link>
      {EXTRA.slice(0, 3).map(p => <Link key={p.path} to={p.path}>{p.name.replace(' Generator', '')}</Link>)}
      <button onClick={() => setPal(true)} aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K">Search<kbd>Ctrl K</kbd></button>
      <a href={REPO} rel="noopener noreferrer">GitHub</a>
      <label className="sr" htmlFor="th">Theme</label><select id="th" value={theme} onChange={e => setTheme(e.target.value)}><option value="auto">Auto</option><option value="light">Light</option><option value="dark">Dark</option></select></nav></header>
    <CommandPalette open={pal} onClose={() => setPal(false)} />
    <main id="main" className="wrap"><ErrorBoundary><Suspense fallback={<p role="status">Loading…</p>}>
      <Routes><Route path="/" element={<Home />} />{EXTRA.map(p => { const C = COMP[p.path]; return <Route key={p.path} path={p.path} element={<C />} /> })}
        <Route path="/category/:cat" element={<CategoryPage />} />{['about', 'privacy', 'terms', 'disclaimer', 'contact'].map(k => <Route key={k} path={`/${k}`} element={<Legal page={k} />} />)}<Route path="/tools/:slug" element={<ToolPage />} /><Route path="*" element={<NotFound />} /></Routes>
    </Suspense></ErrorBoundary></main>
    <footer><div className="wrap">© {new Date().getFullYear()} ToolXier · Free &amp; open source · Your input is processed in your browser and never uploaded (except the DNS Lookup and API Tester, which contact the servers you choose).
      <div>{['about', 'privacy', 'terms', 'disclaimer', 'contact'].map(k => <Link key={k} to={`/${k}`} style={{ marginRight: 12 }}>{k[0].toUpperCase() + k.slice(1)}</Link>)}</div>
      <div>{['developer', 'calculators', 'units'].includes('x') ? null : ['json', 'encoding', 'security', 'generators', 'converters', 'text', 'frontend', 'api', 'calculators', 'units'].map(k => <Link key={k} to={`/category/${k}`} style={{ marginRight: 12 }}>{k[0].toUpperCase() + k.slice(1)} tools</Link>)}</div>
      <div>{dp && <button onClick={async () => { dp.prompt(); await dp.userChoice; setDp(null) }}>Install app</button>} <small>Install: on Android/desktop Chrome use the Install button; on iPhone tap Share → Add to Home Screen.</small></div>
      · <a href={REPO + '/issues'} rel="noopener noreferrer">Report an issue</a></div></footer>
  </>)
}
