# ToolXier

A browser-first collection of 79 practical utilities for developers, creators and problem-solvers.

## Stack
- React 19
- Vite 8
- Lucide React
- Browser APIs and Web Crypto for local processing

## Development
```bash
npm ci
npm run dev
```

## Production
```bash
npm run build
npm run preview
```

## Included categories
Developer, Text, Encoding, Security, Web & SEO, Calculators, Images & Files, Formatting & Utilities.

## Implementation notes
- Most tools run locally in the browser; no application backend is required.
- JWT decoding does not verify signatures.
- The cron helper provides field breakdown, not a complete scheduler.
- YAML support is intentionally limited to simple key/value mappings.
- JavaScript/CSS minifiers and SQL/HTML formatters are lightweight helpers, not compiler-grade parsers.
- Image metadata, resizing, compression and Data URL conversion run locally using browser APIs.
- MD5 is not offered; SHA-1, SHA-256 and SHA-384 are available through Web Crypto.
- QR helper opens a third-party QR generation URL; do not use it for sensitive content.
- Never paste credentials or private tokens into tools you do not trust.
