import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, storeName, customSlug, logoUrl, whatsapp, email, password, plan } = body;

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

    // Formatear y validar el slug / enlace deseado para la tienda
    const desiredSlug = (customSlug || storeName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slug = desiredSlug || `tienda-${Math.floor(1000 + Math.random() * 9000)}`;

    // Verificar si el enlace (slug) de la tienda ya está ocupado
    const existingStoreSlug = await prisma.store.findUnique({
      where: { slug },
    });

    if (existingStoreSlug) {
      return NextResponse.json(
        { error: `El enlace de página "${slug}" ya se encuentra reservado por otra tienda. Por favor ingresa un enlace diferente.` },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const finalLogoUrl = logoUrl && typeof logoUrl === "string" && logoUrl.trim() !== "" ? logoUrl.trim() : null;
    const targetPlan = plan === "PRO" ? "PRO" : plan === "EMPRENDEDOR" ? "EMPRENDEDOR" : "FREE";

    // Asignar módulos según el plan seleccionado
    const initialModules = targetPlan === "PRO" 
      ? { whatsapp: true, gateway: true, metrics: true, inventory: true, customDomain: true }
      : targetPlan === "EMPRENDEDOR"
      ? { whatsapp: true, gateway: false, metrics: true, inventory: true, customDomain: false }
      : { whatsapp: true, gateway: false, metrics: false, inventory: true, customDomain: false };

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
            logoUrl: finalLogoUrl,
            whatsappNumber: whatsapp.trim(),
            enableWhatsapp: initialModules.whatsapp,
            enableGateway: initialModules.gateway,
            paymentKeysJson: {
              modulesEnabled: initialModules,
            },
          },
        },
        subscriptions: {
          create: {
            plan: targetPlan as any,
            status: "PAST_DUE", // Pendiente de activación por pago/acuerdo
            amount: targetPlan === "PRO" ? 25000 : targetPlan === "EMPRENDEDOR" ? 20000 : 0,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días de prueba gratis
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
