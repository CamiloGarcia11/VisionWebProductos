import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAuthUser, hashPassword } from "@/lib/auth";
import { getModulesForPlan } from "@/lib/subscription-payment";

// Helper para calcular total pagado según el plan
function calculatePlanAmount(plan: string): number {
  switch (plan) {
    case "BASICO":
      return 15000;
    case "PRO":
      return 20000;
    case "EMPRESA":
      return 25000;
    case "EMPRENDEDOR":
      return 20000;
    default:
      return 0;
  }
}

// GET: Obtiene la lista de todos los usuarios y sus tiendas registradas
export async function GET() {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser || authUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de Super Admin." },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      include: {
        stores: true,
        subscriptions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedUsers = users.map((u) => {
      const mainStore = u.stores[0];
      const activeSub = u.subscriptions[0];
      
      const now = new Date();
      const endDate = activeSub?.currentPeriodEnd ? new Date(activeSub.currentPeriodEnd) : now;
      const diffTime = endDate.getTime() - now.getTime();
      const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      const keysJson = (mainStore?.paymentKeysJson as any) || {};
      const modulesEnabled = keysJson.modulesEnabled || {
        whatsapp: mainStore?.enableWhatsapp ?? true,
        gateway: mainStore?.enableGateway ?? false,
        metrics: true,
        inventory: true,
        customDomain: false,
      };

      const planName = activeSub?.plan || "FREE";

      return {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        phoneNumber: u.phoneNumber,
        role: u.role,
        isActive: u.isActive,
        storeId: mainStore?.id || "",
        storeName: mainStore?.storeName || "Sin Tienda",
        slug: mainStore?.slug || "",
        logoUrl: mainStore?.logoUrl || "",
        themeColor: keysJson.themeColor || mainStore?.themeColor || "#0052FF",
        secondaryColor: keysJson.secondaryColor || "#25D366",
        whatsappNumber: mainStore?.whatsappNumber || u.phoneNumber,
        enableWhatsapp: mainStore?.enableWhatsapp ?? true,
        enableGateway: mainStore?.enableGateway ?? false,
        modulesEnabled,
        plan: planName,
        status: activeSub?.status || (u.isActive ? "ACTIVE" : "PAST_DUE"),
        startDate: activeSub?.currentPeriodStart ? activeSub.currentPeriodStart.toISOString().split("T")[0] : u.createdAt.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        daysLeft: u.isActive ? daysLeft : 0,
        totalPaidCOP: calculatePlanAmount(planName),
        createdAt: u.createdAt,
      };
    });

    return NextResponse.json({ success: true, users: formattedUsers });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener usuarios de la base de datos", details: error.message },
      { status: 500 }
    );
  }
}

// POST: El Super Admin crea un nuevo usuario directamente activado
export async function POST(request: Request) {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser || authUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de Super Admin." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      fullName, 
      email, 
      password, 
      phoneNumber, 
      role, 
      storeName, 
      plan, 
      isActive,
      trialDays,
      enableWhatsapp,
      enableGateway,
      modules
    } = body;

    if (!fullName || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { error: "Los campos Nombre, Email, Teléfono y Contraseña son obligatorios." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (existing) {
      return NextResponse.json(
        { error: "El correo electrónico ya está registrado en la base de datos." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const storeTitle = storeName?.trim() || `Tienda de ${fullName.trim()}`;
    const slugBase = storeTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${slugBase || "tienda"}-${randomSuffix}`;

    const days = trialDays ? parseInt(trialDays, 10) : 15;
    const userActive = isActive !== undefined ? Boolean(isActive) : true;
    const targetPlan = plan || "FREE";
    const autoModules = modules || getModulesForPlan(targetPlan);

    const createdUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash: hashedPassword,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "MERCHANT_OWNER",
        isActive: userActive,
        stores: {
          create: {
            storeName: storeTitle,
            slug: slug,
            whatsappNumber: phoneNumber.trim(),
            enableWhatsapp: enableWhatsapp !== undefined ? Boolean(enableWhatsapp) : autoModules.whatsapp,
            enableGateway: enableGateway !== undefined ? Boolean(enableGateway) : autoModules.gateway,
            paymentKeysJson: {
              modulesEnabled: autoModules,
            },
          },
        },
        subscriptions: {
          create: {
            plan: targetPlan as any,
            status: userActive ? "ACTIVE" : "PAST_DUE",
            amount: calculatePlanAmount(targetPlan),
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        stores: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Usuario creado y configurado exitosamente en la base de datos",
      user: createdUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear usuario en la base de datos", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar aprobación, tiempo de actividad, plan y módulos asignados
export async function PATCH(request: Request) {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser || authUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de Super Admin." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      userId, 
      action, 
      daysToAdd,
      isActive,
      plan,
      activeDays,
      enableWhatsapp,
      enableGateway,
      modules
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "El ID del usuario es requerido." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { stores: true, subscriptions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    if (action === "configure_permissions" || action === "approve_user") {
      const isNowActive = isActive !== undefined ? Boolean(isActive) : true;
      const targetPlan = plan || (user.subscriptions[0]?.plan || "FREE");
      const days = activeDays ? parseInt(activeDays, 10) : 15;
      const autoModules = modules || getModulesForPlan(targetPlan);

      const newEndDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: userId },
        data: { isActive: isNowActive },
      });

      const sub = user.subscriptions[0];
      if (sub) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: {
            plan: targetPlan as any,
            status: isNowActive ? "ACTIVE" : "PAST_DUE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: newEndDate,
            amount: calculatePlanAmount(targetPlan),
          },
        });
      } else {
        await prisma.subscription.create({
          data: {
            userId,
            plan: targetPlan as any,
            status: isNowActive ? "ACTIVE" : "PAST_DUE",
            amount: calculatePlanAmount(targetPlan),
            currentPeriodStart: new Date(),
            currentPeriodEnd: newEndDate,
          },
        });
      }

      const store = user.stores[0];
      if (store) {
        const existingKeys = (store.paymentKeysJson as any) || {};
        const updatedModules = modules || autoModules;

        await prisma.store.update({
          where: { id: store.id },
          data: {
            enableWhatsapp: enableWhatsapp !== undefined ? Boolean(enableWhatsapp) : updatedModules.whatsapp,
            enableGateway: enableGateway !== undefined ? Boolean(enableGateway) : updatedModules.gateway,
            paymentKeysJson: {
              ...existingKeys,
              modulesEnabled: updatedModules,
            },
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: `Cuenta ${isNowActive ? "aprobada y activada" : "actualizada"} correctamente por ${days} días.`,
      });
    }

    return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar permisos del usuario en la base de datos", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una cuenta/negocio permanentemente de la BD por el Super Admin
export async function DELETE(request: Request) {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser || authUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de Super Admin." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "El ID del usuario es requerido para eliminar." }, { status: 400 });
    }

    // No permitir que el Super Admin se elimine a sí mismo
    if (userId === authUser.id) {
      return NextResponse.json({ error: "No puedes eliminar tu propia cuenta de Super Admin principal." }, { status: 400 });
    }

    const userToDelete = await prisma.user.findUnique({ where: { id: userId } });
    if (!userToDelete) {
      return NextResponse.json({ error: "El usuario a eliminar no existe en la base de datos." }, { status: 404 });
    }

    // Eliminación en cascada gracias a las relaciones Prisma
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: `La cuenta de ${userToDelete.fullName} (${userToDelete.email}) fue eliminada permanentemente de la base de datos.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al eliminar la cuenta de la base de datos", details: error.message },
      { status: 500 }
    );
  }
}
