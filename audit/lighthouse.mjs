// Lighthouse (mobile emulation) on key pages using the same bundled Chromium. Usage: cd audit && npm i && npm run lighthouse
import chromium from '@sparticuz/chromium'; import puppeteer from 'puppeteer-core'; import lighthouse from 'lighthouse'
const O = process.env.ORIGIN || 'http://localhost:4173', b = await puppeteer.launch({ args: [...chromium.args, '--remote-debugging-port=9333'], executablePath: await chromium.executablePath(), headless: 'shell' })
for (const u of ['/', '/tools/json-formatter', '/tools/jwt-decoder', '/category/calculators', '/api-tester', '/privacy']) {
  const r = await lighthouse(O + u, { port: 9333, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }); const c = r.lhr.categories
  console.log(u.padEnd(24), Object.entries(c).map(([k, v]) => `${k.slice(0, 4)}:${Math.round(v.score * 100)}`).join(' '), `LCP:${Math.round(r.lhr.audits['largest-contentful-paint'].numericValue)}ms CLS:${r.lhr.audits['cumulative-layout-shift'].numericValue.toFixed(3)} TBT:${Math.round(r.lhr.audits['total-blocking-time'].numericValue)}ms`)
  for (const [k, v] of Object.entries(r.lhr.audits)) if (!/insight|mainthread|unused|layout-shifts/.test(k) && v.score !== null && v.score < 0.9 && v.scoreDisplayMode !== 'informative' && v.scoreDisplayMode !== 'notApplicable' && v.scoreDisplayMode !== 'manual') console.log('   ✗', k, v.score, (v.displayValue || '').slice(0, 60)) }
await b.close()
