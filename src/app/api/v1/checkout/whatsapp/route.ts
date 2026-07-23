import { NextResponse } from "next/server";
import { buildWhatsAppUrl } from "@/lib/whatsapp-formatter";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { whatsappNumber, storeName, items, totalAmount, customer } = body;

    if (!whatsappNumber || !storeName || !items || !customer) {
      return NextResponse.json(
        { error: "Faltan parámetros obligatorios para el checkout de WhatsApp." },
        { status: 400 }
      );
    }

    const whatsappUrl = buildWhatsAppUrl(
      whatsappNumber,
      storeName,
      items,
      totalAmount,
      customer
    );

    return NextResponse.json({
      success: true,
      whatsappUrl,
      message: "Orden formateada exitosamente.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al generar la orden de WhatsApp", details: error.message },
      { status: 500 }
    );
  }
}
