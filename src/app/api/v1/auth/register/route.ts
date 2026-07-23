import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, storeName, whatsapp, email, password, plan } = body;

    if (!fullName || !storeName || !whatsapp || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben ser completados." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verificar si el correo ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El correo electrónico ya se encuentra registrado." },
        { status: 400 }
      );
    }

    // Generar slug para la tienda
    const slugBase = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${slugBase || "tienda"}-${randomSuffix}`;

    const hashedPassword = await hashPassword(password);

    // Crear usuario como INACTIVO (pendiente de aprobación por el Super Admin)
    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash: hashedPassword,
        fullName: fullName.trim(),
        phoneNumber: whatsapp.trim(),
        role: "MERCHANT_OWNER",
        isActive: false, // Requiere aprobación del administrador en la BD
        stores: {
          create: {
            storeName: storeName.trim(),
            slug: slug,
            whatsappNumber: whatsapp.trim(),
            enableWhatsapp: true,
            enableGateway: false,
            paymentKeysJson: {
              modulesEnabled: {
                whatsapp: true,
                gateway: false,
                metrics: true,
                inventory: true,
                customDomain: false,
              },
            },
          },
        },
        subscriptions: {
          create: {
            plan: plan === "PRO" ? "PRO" : plan === "EMPRENDEDOR" ? "EMPRENDEDOR" : "FREE",
            status: "PAST_DUE", // Pendiente de activación por pago/acuerdo
            amount: plan === "PRO" ? 79000 : plan === "EMPRENDEDOR" ? 39000 : 0,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Periodo inicial
          },
        },
      },
      include: {
        stores: true,
      },
    });

    // NO iniciamos sesión automáticamente. Retornamos respuesta de registro exitoso pendiente de aprobación.
    return NextResponse.json({
      success: true,
      pendingApproval: true,
      message: "Registro realizado con éxito. Tu cuenta ha quedado guardada en la base de datos y se reflejará en el panel del administrador para su revisión y activación.",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        storeName: newUser.stores[0]?.storeName,
        whatsapp: newUser.phoneNumber,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al registrar el usuario", details: error.message },
      { status: 500 }
    );
  }
}
