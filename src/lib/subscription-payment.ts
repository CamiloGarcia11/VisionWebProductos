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
    name: "Plan Prueba Gratis (15 Días)",
    priceCOP: 0,
    trialDays: 15,
    features: [
      "Prueba Gratis por 15 Días",
      "Tienda Web con Enlace Personalizado",
      "Catálogo e Inventario de Productos",
      "Pedidos por WhatsApp Directos",
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
      "Métricas y Reportes Básicos",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Plan Negocio Pro",
    priceCOP: 20000,
    trialDays: 0,
    features: [
      "Logo y Colores de Marca Personalizados",
      "Módulos de Métricas e Inventario Avanzado",
      "Soporte Estándar",
    ],
  },
  EMPRESA: {
    id: "EMPRESA",
    name: "Plan Empresa Élite VIP",
    priceCOP: 25000,
    trialDays: 0,
    features: [
      "Pasarela de Pago Directa (Wompi / MercadoPago)",
      "Publicidad & Banners HD Gratuitos (Impulso VIP)",
      "Resumen Financiero Mensual (Entradas vs Salidas)",
      "Soporte Prioritario VIP 24/7",
    ],
  },
};

/**
 * Retorna los módulos activados automáticamente según el plan asignado/contratado.
 */
export function getModulesForPlan(plan: string) {
  const p = (plan || "FREE").toUpperCase();
  if (p === "EMPRESA" || p === "PRO_PLUS") {
    return {
      whatsapp: true,
      gateway: true, // Pasarelas de Pago
      metrics: true,
      inventory: true,
      customDomain: true,
    };
  } else if (p === "PRO" || p === "EMPRENDEDOR" || p === "BASICO") {
    return {
      whatsapp: true,
      gateway: false,
      metrics: true,
      inventory: true,
      customDomain: false,
    };
  } else {
    // FREE / FREE_TRIAL (Prueba gratis 15 días)
    return {
      whatsapp: true,
      gateway: false,
      metrics: false,
      inventory: true,
      customDomain: false,
    };
  }
}

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
