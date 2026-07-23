import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createSessionToken, setSessionCookie, ensureSuperAdminExists } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Asegurar que exista super admin por defecto si es primera ejecución
    await ensureSuperAdminExists();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son requeridos." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Buscar usuario en base de datos
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { stores: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas. El usuario no está registrado en la base de datos." },
        { status: 401 }
      );
    }

    // Verificar hash de contraseña antes de rechazar por inactividad
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas. Contraseña incorrecta." },
        { status: 401 }
      );
    }

    // Si el usuario no está activo (pendiente de aprobación)
    if (!user.isActive) {
      return NextResponse.json(
        { 
          error: "Tu cuenta se encuentra registrada pero aún no ha sido activada o aprobada por el Administrador. Contacta a soporte vía WhatsApp para acordar la activación de tu plan de prueba.",
          pendingApproval: true 
        },
        { status: 403 }
      );
    }

    // Crear token de sesión y establecer cookie para usuarios activos
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        stores: user.stores,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al procesar el inicio de sesión", details: error.message },
      { status: 500 }
    );
  }
}
