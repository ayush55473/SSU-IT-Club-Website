/**
 * ==============================================================================
 * SSU IT CLUB — DIGITAL EVENT PASS & TICKET QR CODE SERVICE
 * ==============================================================================
 * Provider: QR Server API (https://goqr.me/api/) & QuickChart Fallback
 * Auth: 100% FREE, NO API KEY REQUIRED, NO SUBSCRIPTION NEEDED.
 * Purpose: Generates real-time, high-contrast, scannable QR tickets for student
 *          event registrations and project proposal tracking receipts.
 * ==============================================================================
 */

/**
 * Builds a standardized verification payload for event tickets
 * @param {Object} ticket
 * @returns {string} Raw text encoded into QR
 */
export function buildTicketQrData(ticket) {
  return JSON.stringify({
    iss: 'SSU IT Club Verification Portal',
    code: ticket.ticketCode || ticket.id || 'N/A',
    event: ticket.eventTitle || 'Club Event',
    name: ticket.fullName || 'Student Attendee',
    email: ticket.email || '',
    venue: ticket.eventVenue || 'Main Campus',
    date: ticket.eventDate || '',
    issuedAt: ticket.registeredAt || new Date().toISOString()
  });
}

/**
 * Returns a high-definition image URL for the generated QR code
 * @param {string} rawData - Text or JSON payload to encode
 * @param {number} size - Pixel dimensions (default: 200)
 * @returns {string} Fully qualified image URL
 */
export function getQrCodeImageUrl(rawData, size = 200) {
  const encodedData = encodeURIComponent(typeof rawData === 'object' ? JSON.stringify(rawData) : String(rawData));
  // Primary: QR Server (Fast, high-uptime, free public utility)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&color=67-44-28&bgcolor=255-255-255&data=${encodedData}`;
}

/**
 * Secondary QuickChart fallback QR URL
 */
export function getBackupQrCodeImageUrl(rawData, size = 200) {
  const encodedData = encodeURIComponent(typeof rawData === 'object' ? JSON.stringify(rawData) : String(rawData));
  return `https://quickchart.io/qr?text=${encodedData}&size=${size}&dark=672C1C&margin=2`;
}
