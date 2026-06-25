import { useEffect } from 'react'

type Seo = { title: string; description?: string; image?: string; url?: string }

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  if (!href) return
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el) }
  el.setAttribute('href', href)
}

/** Client-side SEO/OG (works for JS crawlers; static per-offer HTML is also
 *  generated at build for the rest — see scripts/gen-offer-pages.mjs). */
export function useSeo({ title, description = '', image = '', url = '' }: Seo) {
  useEffect(() => {
    const prev = document.title
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    if (url) setMeta('property', 'og:url', url)
    if (image) { setMeta('property', 'og:image', image); setMeta('name', 'twitter:card', 'summary_large_image'); setMeta('name', 'twitter:image', image) }
    if (url) setCanonical(url)
    return () => { document.title = prev }
  }, [title, description, image, url])
}
