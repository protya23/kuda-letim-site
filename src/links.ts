// Single source of truth for all exit points.
// NOTE: manager username uses a CAPITAL LATIN "I" -> traveI_j  (not lowercase L)
export const TG_CHANNEL = 'https://t.me/zxockerwobk'
export const TG_MANAGER_USERNAME = 'traveI_j'
export const TG_MANAGER = `https://t.me/${TG_MANAGER_USERNAME}`

// Prefilled message a user can copy (Telegram direct links to a *user* don't
// reliably prefill text, so we also expose the raw text for a copy button).
export const bookingMessage = (hotel: string) => `Хочу проверить цену на ${hotel}`

// Best-effort link with text param (ignored by some clients — copy is the fallback).
export const tgManagerWithOffer = (hotel: string) =>
  `${TG_MANAGER}?text=${encodeURIComponent(bookingMessage(hotel))}`
