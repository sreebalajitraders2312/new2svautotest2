import { buildWhatsAppUrl } from "@/lib/whatsappUtils";

const WHATSAPP_PHONE = "+91 98765 43210";
const WHATSAPP_MESSAGE =
  "Hello SV Enterprises, I want to enquire about spare parts availability.";

export function FloatingWhatsApp() {
  return (
    <a
      className="floating-wa"
      href={buildWhatsAppUrl(WHATSAPP_PHONE, WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open WhatsApp enquiry"
    >
      WA
    </a>
  );
}
