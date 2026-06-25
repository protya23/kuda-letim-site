// Lightweight, pluggable analytics (Task 3).
// Canonical events (per spec): view_offer, click_telegram, click_booking,
// submit_lead, filter_change. Sends to GA4 (gtag) and Plausible if present;
// always keeps a local counter (localStorage) so events are visible without a provider.
export type AnalyticsEvent =
  | 'view_offer'
  | 'click_telegram'
  | 'click_booking'
  | 'click_whatsapp'
  | 'submit_lead'
  | 'filter_change'

export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}) {
  try {
    const w = window as unknown as {
      gtag?: (...a: unknown[]) => void
      plausible?: (e: string, o?: { props?: Record<string, unknown> }) => void
    }
    w.gtag?.('event', event, props)
    w.plausible?.(event, { props })
    const key = 'kl_analytics'
    const store = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, number>
    store[event] = (store[event] || 0) + 1
    localStorage.setItem(key, JSON.stringify(store))
  } catch {
    /* analytics must never break the UI */
  }
  if (import.meta.env.DEV) console.debug('[analytics]', event, props)
}

export function getLocalStats(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem('kl_analytics') || '{}') } catch { return {} }
}
