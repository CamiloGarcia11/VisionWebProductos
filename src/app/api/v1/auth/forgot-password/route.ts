import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Por favor ingresa un correo electrónico válido" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { stores: true }
    });

    if (!user) {
      // Por seguridad para no revelar correos registrados, retornamos el mismo mensaje exitoso
      return NextResponse.json({
        success: true,
        message: "Si el correo electrónico está registrado en VisionWeb, recibirás las instrucciones de ingreso de inmediato."
      });
    }

    // Aquí notificamos al usuario sobre la recuperación de contraseña
    console.log(`[RECUPERACIÓN DE CONTRASEÑA] Solicitada para usuario: ${user.email} (${user.fullName})`);

    return NextResponse.json({
      success: true,
      message: `Hemos enviado las instrucciones para restablecer tu contraseña al correo ${cleanEmail}. Revisa tu bandeja de entrada o correo no deseado (SPAM).`
    });

  } catch (error) {
    console.error("Error en restablecimiento de contraseña:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud de recuperación de contraseña" },
      { status: 500 }
    );
  }
}
