# Changelog
All notable changes are documented here. Format: [Keep a Changelog](https://keepachangelog.com/), versioning: [SemVer](https://semver.org/).

## [Unreleased]
### Added
- `npm run verify` (local end-to-end check of tests, build and all 125 pages) and `npm run ship` (one-command, tested publish to a new GitHub branch with legacy files preserved); PUBLISHING.md guide
### Added
- Dashboard home page: category sidebar with scroll tracking, Popular, Favorites, Recently used, grid/list toggle, category icons
- Unified `src/tools/items.js` catalog (tools + utility pages) powering dashboard, category hubs and sitemap; new Image category hub
- Home page `<noscript>` link index for crawlers

### Fixed
- Icon contrast (WCAG AA) and long-text overflow in cards

## [0.1.0] — initial React platform
### Added
- 101 browser-based tools + 7 dedicated utility pages (API Tester, Image Tools, QR generator/reader, Markdown preview, Flexbox/Grid playground, Favicon generator)
- Ctrl/⌘+K command palette, favorites, recently used, light/dark/auto theme, open-file input, install-app support
- Pre-rendered pages with per-page SEO (title, description, canonical, JSON-LD, no-JS content), category hubs, sitemap, robots.txt, real 404 status
- PWA: manifest, icons, offline precache of the whole app
- Tests: unit tests for every tool, simulated-browser render tests for every page, real-browser audit and Lighthouse scripts, Playwright specs, CI workflow
- Security: shared CSP/headers for Vercel, Cloudflare Pages and Netlify; input size cap; sandboxed Markdown preview
