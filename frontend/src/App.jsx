import { useMemo, useState } from 'react'
import {
  Search, Code2, Braces, LockKeyhole, Link2, FileText, Fingerprint,
  KeyRound, Zap, ArrowUpRight, Copy, Check, Menu, X, Sparkles,
  ShieldCheck, Star, ChevronRight, WandSparkles,
  Download, RotateCcw, SlidersHorizontal
} from 'lucide-react'
import './App.css'

const tools = [
  {
    "id": "json-format",
    "name": "JSON Formatter",
    "category": "Developer"
  },
  {
    "id": "json-validator",
    "name": "JSON Validator",
    "category": "Developer"
  },
  {
    "id": "json-minify",
    "name": "JSON Minifier",
    "category": "Developer"
  },
  {
    "id": "xml-format",
    "name": "XML Formatter",
    "category": "Developer"
  },
  {
    "id": "yaml-json",
    "name": "YAML to JSON",
    "category": "Developer"
  },
  {
    "id": "json-yaml",
    "name": "JSON to YAML",
    "category": "Developer"
  },
  {
    "id": "csv-json",
    "name": "CSV to JSON",
    "category": "Developer"
  },
  {
    "id": "json-csv",
    "name": "JSON to CSV",
    "category": "Developer"
  },
  {
    "id": "sql-format",
    "name": "SQL Formatter",
    "category": "Developer"
  },
  {
    "id": "regex-tester",
    "name": "Regex Tester",
    "category": "Developer"
  },
  {
    "id": "diff-checker",
    "name": "Text Diff Checker",
    "category": "Developer"
  },
  {
    "id": "cron-parser",
    "name": "Cron Expression Helper",
    "category": "Developer"
  },
  {
    "id": "timestamp",
    "name": "Unix Timestamp Converter",
    "category": "Developer"
  },
  {
    "id": "uuid",
    "name": "UUID Generator",
    "category": "Developer"
  },
  {
    "id": "hash",
    "name": "Text Hash Generator",
    "category": "Developer"
  },
  {
    "id": "word-counter",
    "name": "Word Counter",
    "category": "Text"
  },
  {
    "id": "case-converter",
    "name": "Case Converter",
    "category": "Text"
  },
  {
    "id": "remove-duplicates",
    "name": "Remove Duplicate Lines",
    "category": "Text"
  },
  {
    "id": "sort-lines",
    "name": "Sort Lines",
    "category": "Text"
  },
  {
    "id": "reverse-text",
    "name": "Reverse Text",
    "category": "Text"
  },
  {
    "id": "lorem",
    "name": "Lorem Ipsum Generator",
    "category": "Text"
  },
  {
    "id": "slug",
    "name": "URL Slug Generator",
    "category": "Text"
  },
  {
    "id": "extract-emails",
    "name": "Extract Emails",
    "category": "Text"
  },
  {
    "id": "extract-urls",
    "name": "Extract URLs",
    "category": "Text"
  },
  {
    "id": "text-cleaner",
    "name": "Whitespace Cleaner",
    "category": "Text"
  },
  {
    "id": "base64",
    "name": "Base64 Encoder / Decoder",
    "category": "Encoding"
  },
  {
    "id": "url-encode",
    "name": "URL Encoder / Decoder",
    "category": "Encoding"
  },
  {
    "id": "html-encode",
    "name": "HTML Entity Encoder",
    "category": "Encoding"
  },
  {
    "id": "html-decode",
    "name": "HTML Entity Decoder",
    "category": "Encoding"
  },
  {
    "id": "unicode",
    "name": "Unicode Inspector",
    "category": "Encoding"
  },
  {
    "id": "binary",
    "name": "Text to Binary",
    "category": "Encoding"
  },
  {
    "id": "hex",
    "name": "Text to Hex",
    "category": "Encoding"
  },
  {
    "id": "rot13",
    "name": "ROT13 Encoder",
    "category": "Encoding"
  },
  {
    "id": "jwt-decode",
    "name": "JWT Decoder",
    "category": "Encoding"
  },
  {
    "id": "password",
    "name": "Password Generator",
    "category": "Security"
  },
  {
    "id": "passphrase",
    "name": "Passphrase Generator",
    "category": "Security"
  },
  {
    "id": "random-number",
    "name": "Random Number Generator",
    "category": "Security"
  },
  {
    "id": "random-string",
    "name": "Random String Generator",
    "category": "Security"
  },
  {
    "id": "sha256",
    "name": "SHA-256 Hash",
    "category": "Security"
  },
  {
    "id": "sha1",
    "name": "SHA-1 Hash",
    "category": "Security"
  },
  {
    "id": "sha384",
    "name": "SHA-384 Hash",
    "category": "Security"
  },
  {
    "id": "hmac",
    "name": "HMAC Generator",
    "category": "Security"
  },
  {
    "id": "meta-tags",
    "name": "Meta Tag Generator",
    "category": "Web & SEO"
  },
  {
    "id": "robots",
    "name": "Robots.txt Generator",
    "category": "Web & SEO"
  },
  {
    "id": "sitemap",
    "name": "XML Sitemap Builder",
    "category": "Web & SEO"
  },
  {
    "id": "canonical",
    "name": "Canonical URL Builder",
    "category": "Web & SEO"
  },
  {
    "id": "og-tags",
    "name": "Open Graph Tag Generator",
    "category": "Web & SEO"
  },
  {
    "id": "htaccess",
    "name": ".htaccess Redirect Generator",
    "category": "Web & SEO"
  },
  {
    "id": "url-parser",
    "name": "URL Parser",
    "category": "Web & SEO"
  },
  {
    "id": "user-agent",
    "name": "User-Agent Inspector",
    "category": "Web & SEO"
  },
  {
    "id": "html-preview",
    "name": "HTML Preview",
    "category": "Web & SEO"
  },
  {
    "id": "css-gradient",
    "name": "CSS Gradient Generator",
    "category": "Web & SEO"
  },
  {
    "id": "percentage",
    "name": "Percentage Calculator",
    "category": "Calculators"
  },
  {
    "id": "bmi",
    "name": "BMI Calculator",
    "category": "Calculators"
  },
  {
    "id": "age",
    "name": "Age Calculator",
    "category": "Calculators"
  },
  {
    "id": "loan",
    "name": "Loan EMI Calculator",
    "category": "Calculators"
  },
  {
    "id": "gst",
    "name": "GST Calculator",
    "category": "Calculators"
  },
  {
    "id": "discount",
    "name": "Discount Calculator",
    "category": "Calculators"
  },
  {
    "id": "unit",
    "name": "Unit Converter",
    "category": "Calculators"
  },
  {
    "id": "date-diff",
    "name": "Date Difference Calculator",
    "category": "Calculators"
  },
  {
    "id": "image-info",
    "name": "Image Metadata Inspector",
    "category": "Images & Files"
  },
  {
    "id": "image-resize",
    "name": "Image Resizer",
    "category": "Images & Files"
  },
  {
    "id": "image-compress",
    "name": "Image Compressor",
    "category": "Images & Files"
  },
  {
    "id": "image-to-data",
    "name": "Image to Data URL",
    "category": "Images & Files"
  },
  {
    "id": "data-to-image",
    "name": "Data URL to Image",
    "category": "Images & Files"
  },
  {
    "id": "qr-text",
    "name": "QR Code Text Helper",
    "category": "Images & Files"
  },
  {
    "id": "file-size",
    "name": "File Size Converter",
    "category": "Images & Files"
  },
  {
    "id": "mime",
    "name": "MIME Type Lookup",
    "category": "Images & Files"
  },
  {
    "id": "color-picker",
    "name": "Color Converter",
    "category": "Images & Files"
  },
  {
    "id": "svg-optimizer",
    "name": "SVG Cleaner",
    "category": "Images & Files"
  },
  {
    "id": "json-to-ts",
    "name": "JSON to TypeScript",
    "category": "Formatting & Utilities"
  },
  {
    "id": "json-to-go",
    "name": "JSON to Go Struct",
    "category": "Formatting & Utilities"
  },
  {
    "id": "html-format",
    "name": "HTML Formatter",
    "category": "Formatting & Utilities"
  },
  {
    "id": "css-format",
    "name": "CSS Formatter",
    "category": "Formatting & Utilities"
  },
  {
    "id": "css-minify",
    "name": "CSS Minifier",
    "category": "Formatting & Utilities"
  },
  {
    "id": "js-minify",
    "name": "JavaScript Minifier",
    "category": "Formatting & Utilities"
  },
  {
    "id": "markdown",
    "name": "Markdown Text Helper",
    "category": "Formatting & Utilities"
  },
  {
    "id": "number-base",
    "name": "Number Base Converter",
    "category": "Formatting & Utilities"
  },
  {
    "id": "aspect-ratio",
    "name": "Aspect Ratio Calculator",
    "category": "Formatting & Utilities"
  }
]
const categories = ['All tools', ...new Set(tools.map(t => t.category))]
const iconFor = category => ({Developer:Braces,Text:FileText,Encoding:Link2,Security:ShieldCheck,'Web & SEO':Code2,Calculators:SlidersHorizontal,'Images & Files':FileText,'Formatting & Utilities':WandSparkles}[category] || Code2)
const starter = {
  'json-format':'{"name":"ToolXier","type":"Developer Toolkit","openSource":true}',
  'json-validator':'{"valid":true,"tools":79}',
  'csv-json':'name,category\nToolXier,Developer Toolkit\n',
  'json-csv':'[{"name":"ToolXier","category":"Developer"}]',
  'xml-format':'<toolxier><name>ToolXier</name><free>true</free></toolxier>',
  'regex-tester':'/tool\\w+/gi\nToolXier makes developer workflows easier.',
  'timestamp':'1794000000',
  'url-encode':'https://toolxier.xyz/tools?q=developer toolkit',
  'base64':'ToolXier — build faster.',
  'meta-tags':'ToolXier | Free Developer Toolkit\nA practical collection of free online developer tools.\nhttps://toolxier.xyz',
  'robots':'User-agent: *\nAllow: /\nSitemap: https://toolxier.xyz/sitemap.xml',
  'sitemap':'https://toolxier.xyz/\nhttps://toolxier.xyz/about',
  'percentage':'250\n15',
  'bmi':'70\n1.75',
  'loan':'500000\n9\n5',
  'gst':'1000\n18',
  'discount':'2000\n15',
  'unit':'10',
  'date-diff':'2026-01-01\n2026-11-07',
  'color-picker':'#2D8CFF',
  'aspect-ratio':'1920\n1080',
  'number-base':'255\n10',
  'json-to-ts':'{"id":1,"name":"ToolXier","active":true}',
}
const description = {
  'json-format':'Format compact JSON with readable indentation.',
  'json-validator':'Validate JSON syntax and show a useful error location.',
  'json-minify':'Remove unnecessary JSON whitespace.',
  'xml-format':'Indent XML for easier reading.',
  'yaml-json':'Convert a basic YAML mapping or list into JSON.',
  'json-yaml':'Convert JSON objects into readable YAML.',
  'csv-json':'Convert CSV rows into JSON objects.',
  'json-csv':'Convert an array of JSON objects into CSV.',
  'sql-format':'Format common SQL clauses and keywords.',
  'regex-tester':'Test a JavaScript regular expression against text.',
  'diff-checker':'Compare two text blocks line by line.',
  'cron-parser':'Explain the fields in a five-field cron expression.',
  'timestamp':'Convert Unix seconds or milliseconds to a date.',
  'uuid':'Generate cryptographically random UUID values.',
  'hash':'Create a SHA-256 digest of text.',
  'word-counter':'Count words, characters, sentences and lines.',
  'case-converter':'Convert text into common letter cases.',
  'remove-duplicates':'Remove repeated lines while preserving order.',
  'sort-lines':'Sort lines alphabetically.',
  'reverse-text':'Reverse characters in text.',
  'lorem':'Generate placeholder Lorem Ipsum text.',
  'slug':'Create a URL-friendly slug.',
  'extract-emails':'Find email addresses in text.',
  'extract-urls':'Find HTTP and HTTPS links in text.',
  'text-cleaner':'Trim lines and collapse repeated whitespace.',
  'base64':'Encode or decode UTF-8 text as Base64.',
  'url-encode':'Encode or decode URL components.',
  'html-encode':'Encode HTML-sensitive characters.',
  'html-decode':'Decode common HTML entities.',
  'unicode':'Inspect Unicode code points in text.',
  'binary':'Convert text to binary and binary back to text.',
  'hex':'Convert text to hexadecimal and back.',
  'rot13':'Apply the ROT13 letter substitution.',
  'jwt-decode':'Decode a JWT header and payload locally (without verification).',
  'password':'Generate a strong random password in your browser.',
  'passphrase':'Generate a memorable random passphrase.',
  'random-number':'Generate secure random integers in a range.',
  'random-string':'Generate a random alphanumeric string.',
  'sha256':'Calculate a SHA-256 digest using Web Crypto.',
  'sha1':'Calculate a SHA-1 digest using Web Crypto.',
  'sha384':'Calculate a SHA-384 digest using Web Crypto.',
  'hmac':'Create an HMAC-SHA-256 signature with a supplied secret.',
  'meta-tags':'Generate SEO title, description and canonical meta tags.',
  'robots':'Generate a robots.txt file.',
  'sitemap':'Generate a simple XML sitemap from URLs.',
  'canonical':'Create a canonical link tag.',
  'og-tags':'Generate Open Graph metadata.',
  'htaccess':'Generate an Apache 301 redirect rule.',
  'url-parser':'Parse a URL into its components.',
  'user-agent':'Display this browser user-agent string.',
  'html-preview':'Prepare an HTML document for preview (copy output into a local HTML file).',
  'css-gradient':'Generate a CSS linear gradient.',
  'percentage':'Calculate a percentage of a value.',
  'bmi':'Calculate BMI from weight (kg) and height (m).',
  'age':'Calculate age from a date of birth.',
  'loan':'Calculate monthly loan EMI.',
  'gst':'Calculate GST amount and total.',
  'discount':'Calculate discount amount and final price.',
  'unit':'Convert common length units (m, km, cm, mm, mi, ft, in).',
  'date-diff':'Calculate the number of days between two dates.',
  'image-info':'Read image dimensions and file size from an uploaded image.',
  'image-resize':'Resize an image to custom dimensions using browser canvas.',
  'image-compress':'Compress an uploaded image to JPEG in your browser. Enter quality from 0.1 to 1.',
  'image-to-data':'Convert an uploaded image into a Data URL.',
  'data-to-image':'Validate a Data URL and return it for opening in a browser.',
  'qr-text':'Prepare text and a QR-code generator URL for the supplied content.',
  'file-size':'Convert a byte count into readable file-size units.',
  'mime':'Look up a MIME type by file extension.',
  'color-picker':'Convert a hex color into RGB and HSL.',
  'svg-optimizer':'Remove comments and redundant whitespace from SVG markup.',
  'json-to-ts':'Infer a TypeScript type from a JSON value.',
  'json-to-go':'Generate a basic Go struct from a JSON object.',
  'html-format':'Indent HTML markup.',
  'css-format':'Format CSS declarations.',
  'css-minify':'Minify CSS whitespace and comments.',
  'js-minify':'Basic whitespace minifier (not a replacement for a production bundler).',
  'markdown':'Clean Markdown text and report heading structure.',
  'number-base':'Convert an integer between binary, octal, decimal and hex.',
  'aspect-ratio':'Simplify a width-to-height aspect ratio.',
}
const sampleFor = id => starter[id] ?? ({
  'password':'',
  'uuid':'',
  'image-info':'',
  'image-resize':'800\\n600',
  'image-compress':'0.75',
  'image-to-data':'',
  'age':'2004-10-31',
  'canonical':'https://toolxier.xyz/tools/example',
  'og-tags':'ToolXier\nhttps://toolxier.xyz/\nA practical developer toolkit.',
  'htaccess':'https://old.example.com/page\nhttps://new.example.com/page',
  'url-parser':'https://toolxier.xyz/tools?q=developer',
  'html-preview':'<main><h1>Hello ToolXier</h1><p>Your HTML preview source.</p></main>',
  'css-gradient':'#2563eb\n#14b8a6\n135',
  'passphrase':'',
  'random-number':'1\n100\n5',
  'random-string':'24',
  'hmac':'message to sign\nreplace-with-your-secret',
  'mime':'pdf',
  'data-to-image':'data:image/png;base64,',
  'qr-text':'https://toolxier.xyz',
  'file-size':'1048576',
  'age':'2004-10-31',
}[id] ?? '')
const toBytes = s => new TextEncoder().encode(s)
const hex = bytes => [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('')
const digest = async (algo, value) => hex(await crypto.subtle.digest(algo, toBytes(value)))
const b64encode = s => btoa(Array.from(toBytes(s), b=>String.fromCharCode(b)).join(''))
const b64decode = s => new TextDecoder().decode(Uint8Array.from(atob(s.trim()), c=>c.charCodeAt(0)))
const escapeHtml = s => s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const lines = s => s.replace(/\r/g,'').split('\n')
const number = (s,label='value') => { const n=Number(s); if(!Number.isFinite(n)) throw Error(`Enter a valid ${label}.`); return n }
const secureRandom = max => { const a=new Uint32Array(1); crypto.getRandomValues(a); return a[0]%max }
const titleCase = s => s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())
const yamlScalar = v => typeof v==='string' ? JSON.stringify(v) : String(v)
const jsonToYaml = (obj, depth=0) => {
  const pad='  '.repeat(depth)
  if(Array.isArray(obj)) return obj.map(v=>`${pad}- ${v && typeof v==='object' ? '\n'+jsonToYaml(v,depth+1) : yamlScalar(v)}`).join('\n')
  if(obj && typeof obj==='object') return Object.entries(obj).map(([k,v])=>`${pad}${k}: ${v && typeof v==='object' ? '\n'+jsonToYaml(v,depth+1) : yamlScalar(v)}`).join('\n')
  return `${pad}${yamlScalar(obj)}`
}
const yamlToJson = s => {
  const out={}
  for(const line of lines(s)){ if(!line.trim()||line.trim().startsWith('#')) continue; const m=line.match(/^\s*([^:]+):\s*(.*)$/); if(!m) throw Error('This simple YAML converter supports key: value mappings.'); let v=m[2].trim(); if(v==='true'||v==='false') v=v==='true'; else if(v!==''&&!Number.isNaN(Number(v))) v=Number(v); else if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) v=v.slice(1,-1); out[m[1].trim()]=v }
  return JSON.stringify(out,null,2)
}
const csvParse = s => {
  const rows=[]; let row=[], cell='', quoted=false
  for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'&&quoted&&s[i+1]==='"'){cell+='"';i++}else if(c==='"')quoted=!quoted;else if(c===','&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&s[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x!==''))rows.push(row);row=[];cell=''}else cell+=c}
  row.push(cell);if(row.some(x=>x!==''))rows.push(row)
  if(!rows.length)return []
  const headers=rows.shift()
  return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])))
}
const csvString = rows => { const headers=[...new Set(rows.flatMap(o=>Object.keys(o)))]; const q=v=>`"${String(v??'').replace(/"/g,'""')}"`; return [headers.map(q).join(','),...rows.map(o=>headers.map(h=>q(o[h])).join(','))].join('\n') }
const prettyXml = s => {let level=0;return s.replace(/>\s*</g,'><').replace(/(>)(<)(\/?)/g,'$1\n$2$3').split('\n').map(line=>{const t=line.trim();if(/^<\/[^>]+>/.test(t))level=Math.max(0,level-1);const out='  '.repeat(level)+t;if(/^<[^!?/][^>]*[^/]?>$/.test(t)&&!/<\/[^>]+>$/.test(t))level++;return out}).join('\n')}
const prettyCss = s => s.replace(/\s*{\s*/g,' {\n  ').replace(/;\s*/g,';\n  ').replace(/\s*}\s*/g,'\n}\n').replace(/,\s*/g,',\n').replace(/[ \t]+\n/g,'\n').trim()
const prettyHtml = s => s.replace(/>\s*</g,'>\n<').split('\n').map((l,i)=>l.trim()).filter(Boolean).join('\n')
const simplifyRatio = (a,b) => {let x=Math.abs(a),y=Math.abs(b);while(y){[x,y]=[y,x%y]}return `${a/(x||1)}:${b/(x||1)}`}
const toolRun = async (id, raw) => {
  const s=raw.trim()
  switch(id){
    case 'json-format': return JSON.stringify(JSON.parse(s),null,2)
    case 'json-validator': JSON.parse(s); return 'Valid JSON ✓\nYour JSON syntax is valid.'
    case 'json-minify': return JSON.stringify(JSON.parse(s))
    case 'xml-format': return prettyXml(s)
    case 'yaml-json': return yamlToJson(s)
    case 'json-yaml': return jsonToYaml(JSON.parse(s))
    case 'csv-json': return JSON.stringify(csvParse(raw),null,2)
    case 'json-csv': {const v=JSON.parse(s);if(!Array.isArray(v)||!v.every(x=>x&&typeof x==='object'))throw Error('Input must be an array of objects.');return csvString(v)}
    case 'sql-format': return s.replace(/\s+/g,' ').replace(/\b(select|from|where|group by|order by|having|limit|insert into|values|update|set|delete|join|left join|right join|inner join|on|and|or)\b/gi,'\n$1').trim().replace(/\b(select|from|where|group by|order by|having|limit|insert into|values|update|set|delete|join|left join|right join|inner join|on|and|or)\b/gi,m=>m.toUpperCase())
    case 'regex-tester': {const [pattern,...rest]=lines(raw);const m=pattern.match(/^\/(.*)\/([gimsuy]*)$/);if(!m)throw Error('First line must be a regex like /word/gi.');const re=new RegExp(m[1],m[2].replace('g',''));const text=rest.join('\n');const matches=[...text.matchAll(new RegExp(m[1],m[2].includes('g')?m[2]:m[2]+'g'))];return `Pattern: ${re}\nMatches: ${matches.length}\n${matches.map(x=>`• ${x[0]} (index ${x.index})`).join('\n')||'No matches.'}`}
    case 'diff-checker': {const [a,b]=raw.split(/\n---+\n/);if(b===undefined)throw Error('Separate the two texts with a line containing ---');const aa=lines(a),bb=lines(b);return [...new Set([...aa.filter(x=>!bb.includes(x)).map(x=>`− ${x}`),...bb.filter(x=>!aa.includes(x)).map(x=>`+ ${x}`)])].join('\n')||'No line differences found.'}
    case 'cron-parser': {const p=s.split(/\s+/);if(p.length!==5)throw Error('Enter exactly five cron fields: minute hour day month weekday.');return ['Minute','Hour','Day of month','Month','Day of week'].map((n,i)=>`${n}: ${p[i]}`).join('\n')+'\n\nThis is a field breakdown, not a schedule guarantee.'}
    case 'timestamp': {const n=number(s,'timestamp');const d=new Date(Math.abs(n)<1e12?n*1000:n);if(Number.isNaN(d.getTime()))throw Error('Timestamp is outside the supported date range.');return `UTC: ${d.toISOString()}\nLocal: ${d.toString()}\nUnix seconds: ${Math.floor(d.getTime()/1000)}\nUnix milliseconds: ${d.getTime()}`}
    case 'uuid': return Array.from({length:10},()=>crypto.randomUUID()).join('\n')
    case 'hash': case 'sha256': return `SHA-256: ${await digest('SHA-256',raw)}`
    case 'word-counter': return `Words: ${s?s.split(/\s+/).length:0}\nCharacters: ${raw.length}\nCharacters without spaces: ${raw.replace(/\s/g,'').length}\nLines: ${raw?lines(raw).length:0}\nSentences: ${(raw.match(/[.!?]+/g)||[]).length}`
    case 'case-converter': return `UPPERCASE\n${raw.toUpperCase()}\n\nlowercase\n${raw.toLowerCase()}\n\nTitle Case\n${titleCase(raw)}\n\ncamelCase\n${raw.toLowerCase().replace(/[^a-z0-9]+(.)/g,(_,c)=>c.toUpperCase())}\n\nsnake_case\n${raw.trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')}\n\nkebab-case\n${raw.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`
    case 'remove-duplicates': return [...new Set(lines(raw))].join('\n')
    case 'sort-lines': return lines(raw).sort((a,b)=>a.localeCompare(b)).join('\n')
    case 'reverse-text': return [...raw].reverse().join('')
    case 'lorem': return Array.from({length:5},()=> 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.').join('\n\n')
    case 'slug': return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
    case 'extract-emails': return [...new Set(raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)||[])].join('\n')
    case 'extract-urls': return [...new Set(raw.match(/https?:\/\/[^\s<>"')]+/gi)||[])].join('\n')
    case 'text-cleaner': return lines(raw).map(x=>x.trim().replace(/\s+/g,' ')).filter(Boolean).join('\n')
    case 'base64': return raw.startsWith('decode:\n')?b64decode(raw.slice(8)):b64encode(raw)
    case 'url-encode': return raw.startsWith('decode:\n')?decodeURIComponent(raw.slice(8).trim()):encodeURIComponent(raw)
    case 'html-encode': return escapeHtml(raw)
    case 'html-decode': {const el=document.createElement('textarea');el.innerHTML=raw;return el.value}
    case 'unicode': return [...raw].map(c=>`${c}  U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}`).join('\n')
    case 'binary': return /^[01\s]+$/.test(s)&&s.includes(' ')?s.split(/\s+/).map(x=>String.fromCharCode(parseInt(x,2))).join(''):[...raw].map(c=>c.charCodeAt(0).toString(2).padStart(8,'0')).join(' ')
    case 'hex': return /^[0-9a-f\s]+$/i.test(s)&&s.includes(' ')?s.split(/\s+/).map(x=>String.fromCharCode(parseInt(x,16))).join(''):[...raw].map(c=>c.codePointAt(0).toString(16).padStart(2,'0')).join(' ')
    case 'rot13': return raw.replace(/[a-zA-Z]/g,c=>String.fromCharCode(c.charCodeAt(0)+(c.toLowerCase()<'n'?13:-13)))
    case 'jwt-decode': {const p=s.split('.');if(p.length<2)throw Error('JWT must contain header and payload sections.');const dec=x=>JSON.stringify(JSON.parse(b64decode(x.replace(/-/g,'+').replace(/_/g,'/'))),null,2);return `HEADER\n${dec(p[0])}\n\nPAYLOAD\n${dec(p[1])}\n\nWarning: signature is NOT verified.`}
    case 'password': {const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*_-+=';const a=new Uint32Array(24);crypto.getRandomValues(a);return Array.from(a,n=>chars[n%chars.length]).join('')}
    case 'passphrase': {const w='amber apple atlas bamboo beacon breeze cedar citrus cloud comet coral cosmic delta ember fern forest galaxy harbor ivory juniper lagoon maple meadow mint nebula ocean orbit pebble quartz river saffron silver solar summit tiger velvet willow zenith'.split(' ');return Array.from({length:5},()=>w[secureRandom(w.length)]).join('-')}
    case 'random-number': {const [lo=1,hi=100,count=1]=lines(raw).map(Number);if(![lo,hi,count].every(Number.isFinite)||hi<lo||count<1||count>1000)throw Error('Enter min, max and count (1–1000), one per line.');return Array.from({length:count},()=>lo+secureRandom(Math.floor(hi-lo+1))).join('\n')}
    case 'random-string': {const n=Math.min(256,Math.max(1,Number(s)||24)),chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';const a=new Uint32Array(n);crypto.getRandomValues(a);return Array.from(a,x=>chars[x%chars.length]).join('')}
    case 'sha1': return `SHA-1: ${await digest('SHA-1',raw)}`
    case 'sha384': return `SHA-384: ${await digest('SHA-384',raw)}`
    case 'hmac': {const [message,...secretParts]=lines(raw);const secret=secretParts.join('\n');if(!secret)throw Error('Enter message on line 1 and secret on line 2.');const key=await crypto.subtle.importKey('raw',toBytes(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',key,toBytes(message)))}
    case 'meta-tags': {const [title,desc,url]=lines(raw);return `<title>${escapeHtml(title||'Page title')}</title>\n<meta name="description" content="${escapeHtml(desc||'')}">\n<link rel="canonical" href="${escapeHtml(url||'')}">`}
    case 'robots': return raw||'User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml'
    case 'sitemap': return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines(raw).filter(Boolean).map(u=>`  <url><loc>${escapeHtml(u.trim())}</loc></url>`).join('\n')}\n</urlset>`
    case 'canonical': return `<link rel="canonical" href="${escapeHtml(new URL(s).href)}">`
    case 'og-tags': {const [title,url,desc]=lines(raw);return `<meta property="og:type" content="website">\n<meta property="og:title" content="${escapeHtml(title||'')}">\n<meta property="og:url" content="${escapeHtml(url||'')}">\n<meta property="og:description" content="${escapeHtml(desc||'')}">`}
    case 'htaccess': {const [from,to]=lines(raw);if(!from||!to)throw Error('Enter source URL and destination URL on separate lines.');return `RewriteEngine On\nRewriteCond %{HTTP_HOST} ^${new URL(from).host.replace(/\./g,'\\.')} [NC]\nRewriteRule ^${new URL(from).pathname.replace(/^\//,'')}?$ ${to} [R=301,L]`}
    case 'url-parser': {const u=new URL(s);return Object.entries({href:u.href,protocol:u.protocol,host:u.host,hostname:u.hostname,port:u.port,pathname:u.pathname,search:u.search,hash:u.hash}).map(([k,v])=>`${k}: ${v}`).join('\n')}
    case 'user-agent': return navigator.userAgent
    case 'html-preview': return `Save this HTML as preview.html and open it locally:\n\n${raw}`
    case 'css-gradient': {const [a='#2563eb',b='#14b8a6',deg='135']=lines(raw);return `background: linear-gradient(${Number(deg)||135}deg, ${a}, ${b});`}
    case 'percentage': {const [v,p]=lines(raw).map(Number);if(!Number.isFinite(v)||!Number.isFinite(p))throw Error('Enter value and percentage on separate lines.');return `${p}% of ${v} = ${(v*p/100).toFixed(4)}`}
    case 'bmi': {const [w,h]=lines(raw).map(Number);if(w<=0||h<=0)throw Error('Enter positive weight (kg) and height (m).');const bmi=w/(h*h);return `BMI: ${bmi.toFixed(2)}\nCategory: ${bmi<18.5?'Underweight':bmi<25?'Normal range':bmi<30?'Overweight':'Obesity range'}\nGeneral adult screening guide only.`}
    case 'age': {const d=new Date(s);if(Number.isNaN(d.getTime()))throw Error('Enter date of birth as YYYY-MM-DD.');const now=new Date();let y=now.getFullYear()-d.getFullYear(),m=now.getMonth()-d.getMonth(),day=now.getDate()-d.getDate();if(day<0)m--;if(m<0)y--;return `Age: ${y} years (approximately)\nBirth date: ${d.toDateString()}`}
    case 'loan': {const [principal,annual,years]=lines(raw).map(Number);if(principal<=0||years<=0||annual<0)throw Error('Enter principal, annual interest rate and years.');const r=annual/1200,n=years*12,emi=r===0?principal/n:principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);return `Monthly EMI: ${emi.toFixed(2)}\nTotal payment: ${(emi*n).toFixed(2)}\nTotal interest: ${(emi*n-principal).toFixed(2)}`}
    case 'gst': {const [base,rate]=lines(raw).map(Number);if(!Number.isFinite(base)||!Number.isFinite(rate))throw Error('Enter base amount and GST rate.');return `GST amount: ${(base*rate/100).toFixed(2)}\nTotal including GST: ${(base*(1+rate/100)).toFixed(2)}`}
    case 'discount': {const [price,rate]=lines(raw).map(Number);return `You save: ${(price*rate/100).toFixed(2)}\nFinal price: ${(price*(1-rate/100)).toFixed(2)}`}
    case 'unit': {const [v=0,u='m',target='km']=lines(raw);const f={m:1,km:1000,cm:.01,mm:.001,mi:1609.344,ft:.3048,in:.0254};if(!f[u]||!f[target])throw Error('Use supported units: m, km, cm, mm, mi, ft, in. Lines: value, from, to.');return `${v} ${u} = ${(Number(v)*f[u]/f[target]).toPrecision(8)} ${target}`}
    case 'date-diff': {const [a,b]=lines(raw).map(x=>new Date(x));if([a,b].some(d=>Number.isNaN(d.getTime())))throw Error('Enter two dates as YYYY-MM-DD.');return `${Math.abs(Math.round((b-a)/86400000))} days apart`}
    case 'image-info': case 'image-resize': case 'image-compress': case 'image-to-data': throw Error('Choose an image file using the upload control.')
    case 'data-to-image': if(!/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(s))throw Error('Enter a valid base64 image Data URL.');return `Valid image Data URL detected.\n${s.slice(0,90)}...`
    case 'qr-text': return `QR content:\n${raw}\n\nOpen QR generator:\nhttps://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(raw)}`
    case 'file-size': {const b=number(s,'byte count');return `${b} bytes\n${(b/1024).toFixed(2)} KB\n${(b/1048576).toFixed(2)} MB\n${(b/1073741824).toFixed(4)} GB`}
    case 'mime': {const ext=s.toLowerCase().replace(/^\./,'');const map={html:'text/html',css:'text/css',js:'text/javascript',json:'application/json',pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',svg:'image/svg+xml',webp:'image/webp',gif:'image/gif',txt:'text/plain',csv:'text/csv',xml:'application/xml',zip:'application/zip',mp4:'video/mp4',mp3:'audio/mpeg'};return map[ext]||'Unknown extension in built-in MIME list.'}
    case 'color-picker': {let h=s.replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');if(!/^[0-9a-f]{6}$/i.test(h))throw Error('Enter a 3- or 6-digit hex color.');const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16),max=Math.max(r,g,b)/255,min=Math.min(r,g,b)/255,l=(max+min)/2,d=max-min;let hue=0, sat=0;if(d){sat=d/(1-Math.abs(2*l-1));switch(max){case r/255:hue=60*(((g-b)/255/d)%6);break;case g/255:hue=60*((b-r)/255/d+2);break;default:hue=60*((r-g)/255/d+4)}}return `HEX: #${h.toUpperCase()}\nRGB: ${r}, ${g}, ${b}\nHSL: ${Math.round((hue+360)%360)}°, ${Math.round(sat*100)}%, ${Math.round(l*100)}%`}
    case 'svg-optimizer': return raw.replace(/<!--[\s\S]*?-->/g,'').replace(/>\s+</g,'><').replace(/\s{2,}/g,' ').trim()
    case 'json-to-ts': {const o=JSON.parse(s);const type=v=>Array.isArray(v)?`${v.length?type(v[0]):'unknown'}[]`:v===null?'null':typeof v==='object'?`{\n${Object.entries(v).map(([k,x])=>`  ${JSON.stringify(k)}: ${type(x)};`).join('\n')}\n}`:typeof v;return `export type Root = ${type(o)}`}
    case 'json-to-go': {const o=JSON.parse(s);if(!o||Array.isArray(o)||typeof o!=='object')throw Error('Enter a JSON object.');return `type Root struct {\n${Object.entries(o).map(([k,v])=>`  ${k[0].toUpperCase()+k.slice(1)} ${typeof v==='number'?(Number.isInteger(v)?'int':'float64'):typeof v==='boolean'?'bool':typeof v==='string'?'string':'interface{}'} \`json:"${k}"\``).join('\n')}\n}`}
    case 'html-format': return prettyHtml(raw)
    case 'css-format': return prettyCss(raw)
    case 'css-minify': return raw.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*([{}:;,])\s*/g,'$1').replace(/;}/g,'}').trim()
    case 'js-minify': return raw.replace(/\/\*[\s\S]*?\*\//g,'').replace(/(^|[^:])\/\/.*$/gm,'$1').replace(/\s+/g,' ').trim()
    case 'markdown': return `Headings: ${(raw.match(/^#{1,6}\s/gm)||[]).length}\nLinks: ${(raw.match(/\]\([^)]+\)/g)||[]).length}\nCode fences: ${(raw.match(/```/g)||[]).length/2}\n\n${raw.trim()}`
    case 'number-base': {const [v,from='10']=lines(raw);const n=parseInt(v,Number(from));if(!Number.isFinite(n)||![2,8,10,16].includes(Number(from)))throw Error('Enter integer and source base (2, 8, 10 or 16).');return `Binary: ${n.toString(2)}\nOctal: ${n.toString(8)}\nDecimal: ${n.toString(10)}\nHex: ${n.toString(16).toUpperCase()}`}
    case 'aspect-ratio': {const [w,h]=lines(raw).map(Number);if(w<=0||h<=0)throw Error('Enter positive width and height.');return `Aspect ratio: ${simplifyRatio(w,h)}\nDecimal: ${(w/h).toFixed(4)}`}
    default: throw Error('This tool is not available yet.')
  }
}

function App(){
  const [active,setActive]=useState('json-format')
  const [query,setQuery]=useState('')
  const [category,setCategory]=useState('All tools')
  const [input,setInput]=useState(sampleFor('json-format'))
  const [output,setOutput]=useState('')
  const [error,setError]=useState('')
  const [busy,setBusy]=useState(false)
  const [copied,setCopied]=useState(false)
  const [favorites,setFavorites]=useState(()=>JSON.parse(localStorage.getItem('tx-favorites')||'[]'))
  const [recent,setRecent]=useState(()=>JSON.parse(localStorage.getItem('tx-recent')||'[]'))
  const [mobileOpen,setMobileOpen]=useState(false)
  const [imageFile,setImageFile]=useState(null)
  const selected=tools.find(t=>t.id===active)||tools[0]
  const filtered=useMemo(()=>tools.filter(t=>(category==='All tools'||t.category===category)&&`${t.name} ${t.category} ${description[t.id]||''}`.toLowerCase().includes(query.toLowerCase())),[query,category])
  const choose=id=>{setActive(id);setInput(sampleFor(id));setOutput('');setError('');setImageFile(null);setMobileOpen(false);setRecent(old=>{const next=[id,...old.filter(x=>x!==id)].slice(0,8);localStorage.setItem('tx-recent',JSON.stringify(next));return next})}
  const toggleFavorite=id=>setFavorites(old=>{const next=old.includes(id)?old.filter(x=>x!==id):[...old,id];localStorage.setItem('tx-favorites',JSON.stringify(next));return next})
  const run=async()=>{setBusy(true);setError('');setOutput('');try{
    let result
    if(['image-info','image-resize','image-compress','image-to-data'].includes(active)){
      if(!imageFile) throw Error('Choose an image file first.')
      const image=await new Promise((resolve,reject)=>{const url=URL.createObjectURL(imageFile);const img=new Image();img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('The selected file is not a supported image.'))};img.src=url})
      if(active==='image-info') result=`File: ${imageFile.name}\\nType: ${imageFile.type||'Unknown'}\\nSize: ${imageFile.size} bytes (${(imageFile.size/1024).toFixed(2)} KB)\\nDimensions: ${image.naturalWidth} × ${image.naturalHeight}`
      else if(active==='image-to-data'){const reader=new FileReader();result=await new Promise((resolve,reject)=>{reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Could not read image file.'));reader.readAsDataURL(imageFile)})}
      else {const [w,h]=lines(input).map(Number);const canvas=document.createElement('canvas');canvas.width=active==='image-resize'&&w>0?Math.round(w):image.naturalWidth;canvas.height=active==='image-resize'&&h>0?Math.round(h):image.naturalHeight;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,canvas.width,canvas.height);const quality=active==='image-compress'?Math.min(1,Math.max(.1,Number(input)||.75)):.85;result=canvas.toDataURL('image/jpeg',quality);result=`Image processed\\nDimensions: ${canvas.width} × ${canvas.height}\\nOutput format: JPEG\\nData URL:\\n${result}`}
    } else result=await toolRun(active,input)
    setOutput(result)
  }catch(e){setError(e.message||'Unable to process this input.')}finally{setBusy(false)}}
  const copy=async()=>{try{await navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),1400)}catch{setError('Clipboard permission was not available. Select and copy the output manually.')}}
  const download=()=>{const blob=new Blob([output],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`toolxier-${active}.txt`;a.click();URL.revokeObjectURL(a.href)}
  const Icon=iconFor(selected.category)
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark"><Code2 size={21}/></span><span>Tool<span className="brand-accent">Xier</span></span></a>
      <nav className="top-links"><a href="#directory">Explore tools</a><a href="https://github.com/alokxyadav/ToolXier" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a></nav>
      <button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen?<X/>:<Menu/>}</button>
      <a className="github-button" href="https://github.com/alokxyadav/ToolXier" target="_blank" rel="noreferrer"><Code2 size={16}/> GitHub</a>
    </header>
    {mobileOpen&&<div className="mobile-links"><a href="#directory">Explore tools</a><a href="https://github.com/alokxyadav/ToolXier">GitHub</a></div>}
    <main>
      <section className="hero"><div className="hero-inner"><div className="eyebrow"><Sparkles size={14}/> THE COMPLETE DEVELOPER TOOLKIT</div><h1>Less busywork.<br/><span>More building.</span></h1><p className="hero-copy">79 practical browser-based utilities for developers, creators and problem-solvers. Fast, private and free to use.</p><a className="primary-button" href="#directory">Explore 79 tools <ArrowUpRight size={17}/></a><div className="hero-meta"><span><ShieldCheck size={15}/> Browser-first privacy</span><span><Zap size={15}/> Instant results</span><span><Code2 size={15}/> Open source</span></div></div><div className="hero-art"><div className="art-ring ring-a"/><div className="art-ring ring-b"/><div className="art-card"><Code2 size={48}/><span>TOOLXIER</span><small>79 TOOLS · ONE WORKSPACE</small></div></div></section>
      <section className="directory" id="directory"><div className="section-heading"><div><div className="eyebrow">TOOL DIRECTORY</div><h2>Find your next shortcut</h2><p>Search by name or browse by category.</p></div><div className="tool-count">{tools.length} tools</div></div>
        <div className="directory-controls"><label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search 79 tools..."/></label><div className="category-chips">{categories.map(c=><button key={c} className={category===c?'chip active':'chip'} onClick={()=>setCategory(c)}>{c}</button>)}</div></div>
        <div className="content-grid"><aside className="tool-list"><div className="list-heading">TOOLS <span>{filtered.length}</span></div>{filtered.map(t=>{const I=iconFor(t.category);return <button key={t.id} className={`tool-nav ${active===t.id?'active':''}`} onClick={()=>choose(t.id)}><I size={16}/><span>{t.name}</span>{favorites.includes(t.id)&&<Star size={13} className="favorite-indicator" fill="currentColor"/>}<ChevronRight size={14} className="nav-arrow"/></button>})}{filtered.length===0&&<p className="empty-search">No matching tools. Try another search.</p>}</aside>
          <section className="tool-panel"><div className="panel-top"><div className="tool-title"><span className="tool-icon"><Icon size={21}/></span><div><div className="tool-category">{selected.category}</div><h3>{selected.name}</h3><p>{description[active]||'A practical browser-based utility.'}</p></div></div><button className={`favorite-button ${favorites.includes(active)?'saved':''}`} onClick={()=>toggleFavorite(active)} aria-label="Toggle favorite"><Star size={17} fill={favorites.includes(active)?'currentColor':'none'}/></button></div>
            <div className="editor-head"><label htmlFor="tool-input">INPUT</label><button onClick={()=>{setInput(sampleFor(active));setOutput('');setError('')}}><RotateCcw size={13}/> Reset sample</button></div>
            {['image-info','image-resize','image-compress','image-to-data'].includes(active)&&<label className="upload-control">Choose image file<input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0]||null)}/><span>{imageFile?imageFile.name:'Select an image from your device'}</span></label>}
            <textarea id="tool-input" className="editor" value={input} onChange={e=>setInput(e.target.value)} placeholder={`Enter input for ${selected.name}...`} spellCheck="false"/>
            <div className="action-row"><button className="run-button" onClick={run} disabled={busy}><Zap size={16}/>{busy?'Working...':'Run tool'}</button><button className="clear-button" onClick={()=>{setInput('');setOutput('');setError('')}}>Clear</button></div>
            {error&&<div className="error-box" role="alert">{error}</div>}
            {output&&<div className="output-wrap"><div className="output-heading"><span>OUTPUT</span><div><button onClick={copy}>{copied?<Check size={14}/>:<Copy size={14}/>} {copied?'Copied':'Copy'}</button><button onClick={download}><Download size={14}/> Download</button></div></div><pre>{output}</pre></div>}
            <div className="privacy-note"><ShieldCheck size={14}/> Inputs are processed in your browser unless a tool explicitly opens an external service. Do not paste secrets into untrusted environments.</div>
          </section>
        </div>
      </section>
      <section className="feature-strip"><div><Sparkles size={18}/><b>Made for everyday work</b><span>Small utilities that save time.</span></div><div><ShieldCheck size={18}/><b>Privacy-conscious</b><span>Most processing stays on your device.</span></div><div><Code2 size={18}/><b>Open source</b><span>Explore and contribute on GitHub.</span></div></section>
    </main>
    <footer><a className="brand footer-brand" href="#"><span className="brand-mark"><Code2 size={18}/></span>Tool<span className="brand-accent">Xier</span></a><span>Free tools. Better workflows.</span><a href="https://github.com/alokxyadav/ToolXier" target="_blank" rel="noreferrer">Contribute on GitHub ↗</a><span>© {new Date().getFullYear()} ToolXier</span></footer>
  </div>
}
export default App
