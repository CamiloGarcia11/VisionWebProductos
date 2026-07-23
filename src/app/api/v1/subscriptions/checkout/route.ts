import { NextResponse } from "next/server";
import { generateWhatsAppSaaSLink, SAAS_PLANS } from "@/lib/subscription-payment";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, userId, userEmail, storeName, phone } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "El plan es requerido para solicitar el arriendo." },
        { status: 400 }
      );
    }

    if (planId === "FREE_TRIAL") {
      return NextResponse.json({
        success: true,
        message: "Plan Gratuito de 2 Meses activado automáticamente.",
        checkoutUrl: "/dashboard",
      });
    }

    const whatsappUrl = generateWhatsAppSaaSLink(planId, userEmail, storeName, phone);

    return NextResponse.json({
      success: true,
      plan: SAAS_PLANS[planId],
      checkoutUrl: whatsappUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al procesar solicitud de arriendo por WhatsApp", details: error.message },
      { status: 500 }
    );
  }
}
