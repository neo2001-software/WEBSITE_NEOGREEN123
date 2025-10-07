/**
 * WhatsApp Utility - Centralized WhatsApp link handling
 * Phone: +94 77 88 29 398 (E.164 format: 94778829398)
 */

const WHATSAPP_PHONE = "94778829398";

/**
 * Build a WhatsApp URL using wa.me format
 * @param message - The message to send (will be URL encoded)
 * @returns WhatsApp URL string
 */
export function buildWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp with popup-safe fallback
 * @param message - The message to send
 * @returns Object with { url, popup, isBlocked }
 */
export function openWhatsApp(message: string): {
  url: string;
  popup: Window | null;
  isBlocked: boolean;
} {
  const url = buildWhatsAppUrl(message);
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  const isBlocked = !popup || popup.closed || typeof popup.closed === "undefined";

  return { url, popup, isBlocked };
}
