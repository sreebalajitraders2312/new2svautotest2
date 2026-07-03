import type { Mode, Product } from "@/data/types";

export interface WhatsAppMessageInput {
  productName: string;
  oemNumber: string;
  category: string;
  mode: Mode;
}

export function normalizeWhatsAppPhone(phoneNumber: string): string {
  return phoneNumber.replace(/[^0-9]/g, "");
}

export function buildWhatsAppMessage(input: WhatsAppMessageInput): string {
  const productLabel =
    input.mode === "industrial" ? "industrial product" : "automobile part";

  return [
    `Hello SV Enterprises, I want to enquire about this ${productLabel}.`,
    `Product: ${input.productName}`,
    input.oemNumber ? `OEM/Spec: ${input.oemNumber}` : "",
    `Category: ${input.category}`,
    `Mode: ${input.mode}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildProductWhatsAppMessage(
  product: Product,
  mode: Mode,
): string {
  return buildWhatsAppMessage({
    productName: product.name,
    oemNumber: product.oemNumber,
    category: product.category,
    mode,
  });
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const phone = normalizeWhatsAppPhone(phoneNumber);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

export function buildProductWhatsAppUrl(
  phoneNumber: string,
  product: Product,
  mode: Mode,
): string {
  return buildWhatsAppUrl(
    phoneNumber,
    buildProductWhatsAppMessage(product, mode),
  );
}
