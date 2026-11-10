// Unified catalog of everything that has its own page: registry tools + dedicated utility pages.
import { tools, categories } from './registry.js'
import { EXTRA } from '../pages/extra.js'
export const CATS = categories
export const ITEMS = [...tools.map(t => ({ id: t.slug, name: t.name, category: t.category, description: t.description, path: `/tools/${t.slug}` })),
  ...EXTRA.map(p => ({ id: p.path, name: p.name, category: p.cat, description: p.desc, path: p.path }))]
export const ICON = { JSON: '{ }', Encoding: '⇄', Security: '#', Generators: '✦', Converters: '↔', Text: 'Aa', Frontend: '</>', API: '↗', Calculators: '∑', Units: '㎏', Image: '▣' }
export const POPULAR = ['json-formatter', 'jwt-decoder', 'base64-encode', 'uuid-generator', 'regex-tester', 'sha-256-generator', '/api-tester', '/image-tools', 'css-gradient-generator', 'unix-timestamp-converter', '/qr-code', 'bmi-calculator']
export const byId = id => ITEMS.find(i => i.id === id)
