/**
 * Notification stub — in production this connects to Twilio / Interakt for
 * WhatsApp messages and an email provider (Phase 2 of the proposal).
 * For now it logs to the server console so the flow is visible in dev.
 */
export async function sendWhatsApp(phone: string | null | undefined, message: string) {
  console.log(`[WhatsApp → ${phone ?? "no number on file"}] ${message}`);
}

export async function sendEmail(email: string, subject: string, body: string) {
  console.log(`[Email → ${email}] ${subject}\n${body}`);
}
