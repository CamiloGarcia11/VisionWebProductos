import { formatCOP } from "./utils";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

/**
 * Genera la URL codificada wa.me con el detalle estructurado del pedido.
 */
export function buildWhatsAppUrl(
  whatsappNumber: string,
  storeName: string,
  items: CartItem[],
  totalAmount: number,
  customer: CustomerDetails
): string {
  let message = `🛒 *¡NUEVO PEDIDO DESDE ${storeName.toUpperCase()}!*\n\n`;
  message += `👤 *Cliente:* ${customer.fullName}\n`;
  message += `📞 *Teléfono:* ${customer.phone}\n`;
  message += `📍 *Dirección de Entrega:* ${customer.address} (${customer.city})\n`;
  
  if (customer.notes && customer.notes.trim().length > 0) {
    message += `📝 *Notas:* ${customer.notes.trim()}\n`;
  }
  
  message += `\n📦 *PRODUCTOS SOLICITADOS:*\n`;

  items.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    message += `${index + 1}. *${item.title}*\n`;
    message += `   Cantidad: ${item.quantity} x ${formatCOP(item.price)} = *${formatCOP(subtotal)}*\n`;
  });

  message += `\n💰 *TOTAL A PAGAR:* *${formatCOP(totalAmount)}*\n\n`;
  message += `Quedo a la espera de sus datos de pago o confirmación de despacho. ¡Muchas gracias!`;

  const cleanPhone = whatsappNumber.replace(/\D/g, "");
  const encodedText = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
