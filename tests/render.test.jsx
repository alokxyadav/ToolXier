// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App.jsx'
import { tools, categories } from '../src/tools/registry.js'
import { EXTRA } from '../src/pages/extra.js'
import { LEGAL } from '../src/pages/legal.js'

beforeEach(() => { vi.stubGlobal('fetch', () => Promise.reject(new Error('offline'))) })
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
const at = path => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
const noCrash = () => expect(screen.queryByText('Something went wrong')).toBeNull()

describe('every tool page renders, runs its example and never crashes', () => {
  for (const t of tools) it(t.slug, async () => {
    at(`/tools/${t.slug}`)
    expect((await screen.findByRole('heading', { level: 1 })).textContent).toContain(t.name)
    fireEvent.click(screen.getByRole('button', { name: 'Example' })); fireEvent.click(screen.getByRole('button', { name: 'Run' }))
    await waitFor(() => { expect(screen.getByLabelText('Output').value !== '' || screen.queryByRole('alert') !== null).toBe(true) }, { timeout: 3000 })
    fireEvent.click(screen.getByRole('button', { name: 'Clear' })); expect(screen.getByLabelText('Output').value).toBe('')
    noCrash()
  })
})
describe('other pages', () => {
  for (const p of EXTRA) it(`renders ${p.path}`, async () => { at(p.path); expect((await screen.findByRole('heading', { level: 1 })).textContent.length).toBeGreaterThan(2); noCrash() })
  for (const k of Object.keys(LEGAL)) it(`renders /${k}`, async () => { at('/' + k); expect((await screen.findByRole('heading', { level: 1 })).textContent).toBe(LEGAL[k].title) })
  for (const c of categories) it(`renders category ${c}`, async () => { at('/category/' + c.toLowerCase()); expect((await screen.findByRole('heading', { level: 1 })).textContent).toContain(c); noCrash() })
  it('home search filters and shows count', async () => { at('/'); expect((await screen.findByText(/free, open-source tools/)).textContent).toContain(String(tools.length + EXTRA.length))
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'jwt' } }); expect(await screen.findByRole('link', { name: /JWT Decoder/ })).toBeTruthy(); expect(screen.queryByRole('link', { name: /BMI Calculator/ })).toBeNull()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzzqq' } }); expect(await screen.findByText(/No tools match/)).toBeTruthy() })
  it('unknown routes show 404, unknown tool and category are handled', async () => { at('/nope'); expect((await screen.findByRole('heading', { level: 1 })).textContent).toContain('404'); cleanup()
    at('/tools/does-not-exist'); expect((await screen.findByRole('heading', { level: 1 })).textContent).toContain('not found'); cleanup()
    at('/category/zzz'); expect((await screen.findByRole('heading', { level: 1 })).textContent).toContain('not found') })
  it('oversized input is rejected instead of freezing the UI', async () => { at('/tools/json-formatter'); await screen.findByRole('heading', { level: 1 })
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'x'.repeat(2_100_000) } }); fireEvent.click(screen.getByRole('button', { name: 'Run' }))
    expect((await screen.findByRole('alert')).textContent).toContain('too large') })
  it('JWT page warns that decoding is not verification', async () => { at('/tools/jwt-decoder'); expect((await screen.findByRole('note')).textContent).toContain('NOT proven authentic') })
  it('favorites persist and show on home', async () => { at('/tools/sha-256-generator'); fireEvent.click(await screen.findByRole('button', { name: /Add to favorites/ })); cleanup(); at('/'); expect(await screen.findByText('★ Favorites')).toBeTruthy() })
  it('Ctrl+K command palette finds a tool and navigates with the keyboard', async () => { at('/'); await screen.findByRole('heading', { level: 1 }); fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    const box = within(await screen.findByRole('dialog')).getByRole('combobox'); fireEvent.change(box, { target: { value: 'jwt' } }); expect(await screen.findByRole('option', { name: /JWT Decoder/ })).toBeTruthy(); fireEvent.keyDown(box, { key: 'Enter' })
    expect((await screen.findByRole('heading', { level: 1 })).textContent).toContain('JWT Decoder'); expect(screen.queryByRole('dialog')).toBeNull() })
  it('palette closes on Escape', async () => { at('/'); await screen.findByRole('heading', { level: 1 }); fireEvent.keyDown(window, { key: 'k', metaKey: true }); const box = within(await screen.findByRole('dialog')).getByRole('combobox'); fireEvent.keyDown(box, { key: 'Escape' }); expect(screen.queryByRole('dialog')).toBeNull() })
  it('dashboard shows every tool and page once per category, with a category sidebar', async () => { const { ITEMS, CATS } = await import('../src/tools/items.js'); at('/'); await screen.findByRole('heading', { level: 1 })
    const hrefs = new Set([...document.querySelectorAll('a.tile')].map(a => a.getAttribute('href'))); for (const i of ITEMS) expect(hrefs.has(i.path)).toBe(true)
    expect(document.querySelectorAll('aside a[href^="#cat-"]').length).toBe(CATS.length); expect(document.querySelectorAll('section[data-cat]').length).toBe(CATS.length)
    fireEvent.click(screen.getByRole('button', { name: 'List' })); expect(document.querySelector('.list')).toBeTruthy() })
})
