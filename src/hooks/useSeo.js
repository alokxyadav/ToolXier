import { useEffect } from 'react'
const SITE = (import.meta.env.VITE_SITE_URL || (typeof location !== 'undefined' ? location.origin : '')).replace(/\/$/, '')
export default function useSeo(s) {
  useEffect(() => { if (!s) return; document.title = s.title
    const set = (sel, make, attr, val) => { let el = document.head.querySelector(sel); if (!el) { el = make(); document.head.appendChild(el) } el.setAttribute(attr, val) }
    set('meta[name=description]', () => Object.assign(document.createElement('meta'), { name: 'description' }), 'content', s.description)
    set('link[rel=canonical]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', SITE + s.path)
    const ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-page'
    ld.textContent = JSON.stringify([{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Tools', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: s.name, item: SITE + s.path }] },
      { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: s.name, description: s.description, applicationCategory: 'DeveloperApplication', operatingSystem: 'Any (web browser)', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }])
    document.getElementById('ld-page')?.remove(); document.head.appendChild(ld); return () => ld.remove() }, [s?.path])
}
