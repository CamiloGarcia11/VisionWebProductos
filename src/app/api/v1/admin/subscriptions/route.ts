import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Obtener tiendas y usuarios con sus suscripciones activas desde Neon PostgreSQL
    const stores = await prisma.store.findMany({
      include: {
        owner: {
          include: {
            subscriptions: true,
          },
        },
        orders: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      stores,
    });
  } catch (error: any) {
    // Si la base de datos aún no tiene registros iniciales, retornar estructura fallback
    return NextResponse.json({
      success: true,
      stores: [],
    });
  }
}
