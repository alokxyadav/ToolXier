import { useMemo, useState } from 'react'
import {
  Search, Code2, Braces, LockKeyhole, Link2, FileText,
  Fingerprint, KeyRound, Zap, ArrowUpRight,
  Copy, Check, Menu, X, Sparkles, ShieldCheck
} from 'lucide-react'
import './App.css'

const tools = [
  { id: 'json', name: 'JSON Formatter', desc: 'Format, validate and beautify JSON.', category: 'Developer', icon: Braces },
  { id: 'base64', name: 'Base64 Encoder', desc: 'Encode and decode Base64 strings.', category: 'Encoder', icon: LockKeyhole },
  { id: 'url', name: 'URL Encoder', desc: 'Encode or decode URL components.', category: 'Encoder', icon: Link2 },
  { id: 'words', name: 'Word Counter', desc: 'Count words, characters and lines.', category: 'Text', icon: FileText },
  { id: 'uuid', name: 'UUID Generator', desc: 'Generate unique UUID identifiers.', category: 'Developer', icon: Fingerprint },
  { id: 'password', name: 'Password Generator', desc: 'Create strong random passwords.', category: 'Security', icon: KeyRound },
]

function App() {
  const [active, setActive] = useState('json')
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('{\n  "name": "ToolXier",\n  "type": "Developer Toolkit",\n  "openSource": true\n}')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('format')
  const [copied, setCopied] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [passwordLength, setPasswordLength] = useState(20)

  const selected = tools.find(t => t.id === active)
  const filtered = useMemo(() => tools.filter(t =>
    `${t.name} ${t.desc} ${t.category}`.toLowerCase().includes(query.toLowerCase())
  ), [query])

  function runTool() {
    setError('')
    setOutput('')
    try {
      let result = ''
      if (active === 'json') {
        const parsed = JSON.parse(input)
        result = mode === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2)
      } else if (active === 'base64') {
        result = mode === 'decode' ? decodeURIComponent(escape(atob(input.trim()))) : btoa(unescape(encodeURIComponent(input)))
      } else if (active === 'url') {
        result = mode === 'decode' ? decodeURIComponent(input) : encodeURIComponent(input)
      } else if (active === 'words') {
        const words = input.trim() ? input.trim().split(/\s+/).length : 0
        result = `Words: ${words}\nCharacters: ${input.length}\nCharacters (excluding spaces): ${input.replace(/\s/g, '').length}\nLines: ${input ? input.split(/\n/).length : 0}`
      } else if (active === 'uuid') {
        result = Array.from({ length: 5 }, () => crypto.randomUUID()).join('\n')
      } else if (active === 'password') {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*_-+='
        const bytes = new Uint32Array(passwordLength)
        crypto.getRandomValues(bytes)
        result = Array.from(bytes, n => chars[n % chars.length]).join('')
      }
      setOutput(result)
    } catch (e) {
      setError(active === 'json' ? `Invalid JSON: ${e.message}` : `Unable to process input: ${e.message}`)
    }
  }

  async function copyOutput() {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function chooseTool(id) {
    setActive(id)
    setOutput('')
    setError('')
    setMobileOpen(false)
    setMode(id === 'json' ? 'format' : 'encode')
    if (id === 'json') setInput('{\n  "name": "ToolXier",\n  "type": "Developer Toolkit",\n  "openSource": true\n}')
    else setInput('')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark"><Code2 size={21}/></span>
          <span>Tool<span className="brand-accent">Xier</span></span>
        </a>
        <nav className="top-links">
          <a href="#tools">Explore tools</a>
          <a href="https://github.com/alokxyadav/ToolXier" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a>
        </nav>
        <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X/> : <Menu/>}
        </button>
        <a className="github-button" href="https://github.com/alokxyadav/ToolXier" target="_blank" rel="noreferrer">
          <Code2 size={16}/> Star on GitHub
        </a>
      </header>

      {mobileOpen && <div className="mobile-links"><a href="#tools">Explore tools</a><a href="https://github.com/alokxyadav/ToolXier">GitHub</a></div>}

      <main>
        <section className="hero">
          <div className="eyebrow"><Sparkles size={14}/> YOUR EVERYDAY DEVELOPER TOOLKIT</div>
          <h1>Build faster.<br/><span>Work smarter.</span></h1>
          <p className="hero-copy">A collection of practical, free tools designed to simplify your workflow. Fast, reliable and accessible right from your browser.</p>
          <a className="primary-button" href="#tools">Explore all tools <ArrowUpRight size={17}/></a>
          <div className="hero-meta"><span><ShieldCheck size={15}/> Free to use</span><span><Zap size={15}/> Instant results</span><span><Code2 size={15}/> Developer-first</span></div>
          <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
        </section>

        <section className="workspace" id="tools">
          <div className="section-heading">
            <div><div className="eyebrow">TOOL DIRECTORY</div><h2>Find your tool</h2><p>Everything you need, in one place.</p></div>
            <div className="tool-count">{tools.length} tools available</div>
          </div>
          <div className="tool-layout">
            <aside className="tool-sidebar">
              <label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools..."/></label>
              <div className="sidebar-label">ALL TOOLS</div>
              {filtered.map(tool => {
                const Icon = tool.icon
                return <button key={tool.id} className={`tool-nav ${active === tool.id ? 'active' : ''}`} onClick={() => chooseTool(tool.id)}>
                  <Icon size={17}/><span>{tool.name}</span><ArrowUpRight size={14} className="nav-arrow"/>
                </button>
              })}
              {filtered.length === 0 && <p className="empty-search">No tools found.</p>}
            </aside>

            <section className="tool-panel">
              <div className="panel-top">
                <div className="tool-title">
                  <span className="tool-icon"><selected.icon size={21}/></span>
                  <div><h3>{selected.name}</h3><p>{selected.desc}</p></div>
                </div>
                <span className="category-tag">{selected.category}</span>
              </div>

              {active === 'json' && <div className="mode-row"><button className={mode === 'format' ? 'selected' : ''} onClick={() => setMode('format')}>Beautify</button><button className={mode === 'minify' ? 'selected' : ''} onClick={() => setMode('minify')}>Minify</button></div>}
              {active === 'base64' && <div className="mode-row"><button className={mode !== 'decode' ? 'selected' : ''} onClick={() => setMode('encode')}>Encode</button><button className={mode === 'decode' ? 'selected' : ''} onClick={() => setMode('decode')}>Decode</button></div>}
              {active === 'url' && <div className="mode-row"><button className={mode !== 'decode' ? 'selected' : ''} onClick={() => setMode('encode')}>Encode</button><button className={mode === 'decode' ? 'selected' : ''} onClick={() => setMode('decode')}>Decode</button></div>}

              {active === 'password' && <div className="range-control"><label>Password length <strong>{passwordLength}</strong></label><input type="range" min="8" max="64" value={passwordLength} onChange={e => setPasswordLength(Number(e.target.value))}/></div>}
              {active !== 'uuid' && <label className="editor-label">{active === 'words' ? 'YOUR TEXT' : 'INPUT'}<textarea value={input} onChange={e => setInput(e.target.value)} placeholder={active === 'json' ? 'Paste your JSON here...' : active === 'words' ? 'Start typing or paste your text...' : 'Enter your text here...'} spellCheck="false"/></label>}
              {active === 'uuid' && <div className="helper-box">Generate five cryptographically random UUIDs with one click.</div>}
              {active === 'password' && <div className="helper-box">Generate a random password using a mix of letters, numbers and symbols.</div>}
              <div className="action-row"><button className="run-button" onClick={runTool}><Zap size={16}/> {active === 'words' ? 'Count text' : active === 'uuid' ? 'Generate UUIDs' : active === 'password' ? 'Generate password' : 'Run tool'}</button><button className="clear-button" onClick={() => {setInput('');setOutput('');setError('')}}>Clear</button></div>
              {error && <div className="error-box">{error}</div>}
              {output && <div className="output-wrap"><div className="output-heading"><span>OUTPUT</span><button onClick={copyOutput}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy'}</button></div><pre>{output}</pre></div>}
              <div className="privacy-note"><ShieldCheck size={14}/> Processing happens in your browser. Your input is not sent to a server.</div>
            </section>
          </div>
        </section>
      </main>

      <footer><a className="brand footer-brand" href="#"><span className="brand-mark"><Code2 size={18}/></span>Tool<span className="brand-accent">Xier</span></a><span>Free tools. Better workflows.</span><span>© {new Date().getFullYear()} ToolXier</span></footer>
    </div>
  )
}

export default App
