export interface SubscriptionPlanDetails {
  id: "FREE_TRIAL" | "BASICO" | "PRO" | "EMPRESA";
  name: string;
  priceCOP: number;
  trialDays: number;
  features: string[];
}

export const SAAS_PLANS: Record<string, SubscriptionPlanDetails> = {
  FREE_TRIAL: {
    id: "FREE_TRIAL",
    name: "Plan Prueba Starter (1 Mes Gratis)",
    priceCOP: 0,
    trialDays: 30,
    features: [
      "Prueba Completa de 1 Mes (30 Días)",
      "Tienda Web Híbrida con Subdominio",
      "Checkout Directo a WhatsApp",
      "Catálogo de Productos Ilimitado",
    ],
  },
  BASICO: {
    id: "BASICO",
    name: "Plan Emprendedor Express",
    priceCOP: 15000,
    trialDays: 0,
    features: [
      "Todo lo del Plan Gratuito",
      "Pedidos por WhatsApp Ilimitados",
      "Control de Stock e Inventario",
      "Soporte Estándar",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Plan Negocio Pro (Personalizado)",
    priceCOP: 20000,
    trialDays: 0,
    features: [
      "Carga de Logo Oficial Elegante",
      "Personalización de 2 Colores de Marca",
      "Productos con Especificaciones Avanzadas",
      "Guía Rápida Paso a Paso",
      "Reportes de Ventas y Métricas",
    ],
  },
  EMPRESA: {
    id: "EMPRESA",
    name: "Plan Empresa Élite VIP",
    priceCOP: 25000,
    trialDays: 0,
    features: [
      "Todo lo del Plan Negocio Pro",
      "Pasarela de Pago Directa (Wompi / MP)",
      "Dominio Personalizado (.com / .co)",
      "Soporte Prioritario VIP 24/7",
    ],
  },
};

/**
 * Número de WhatsApp por defecto del Administrador de la plataforma para recibir solicitudes de arriendo/pago.
 */
export const ADMIN_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "573000000000";

/**
 * Genera el enlace directo a WhatsApp especificando exactamente el plan que desea contratar la persona.
 */
export function generateWhatsAppSaaSLink(
  planId: "FREE_TRIAL" | "BASICO" | "PRO" | "EMPRESA" | string,
  userEmail?: string,
  storeName?: string,
  phone?: string
): string {
  const plan = SAAS_PLANS[planId] || SAAS_PLANS.PRO;
  const adminPhone = ADMIN_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

  let message = `🚀 *SOLICITUD DE CONTRATACIÓN VISIONWEB*\n\n`;
  message += `Hola, me interesa contratar/activar el *${plan.name}* por valor de *$${plan.priceCOP.toLocaleString("es-CO")} COP/mes*.\n\n`;
  if (storeName) message += `📌 *Nombre de Tienda:* ${storeName}\n`;
  if (userEmail) message += `📧 *Correo:* ${userEmail}\n`;
  if (phone) message += `📱 *Teléfono:* ${phone}\n`;
  message += `\nQuisiera acordar el método de pago y la activación del servicio. ¡Gracias!`;

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
}
