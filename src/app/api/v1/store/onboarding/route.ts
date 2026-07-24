import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAuthUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Usuario no autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const { slug, logoUrl, initialSetupCompleted, tutorialSeen } = body;

    const userStore = authUser.stores[0];
    if (!userStore) {
      return NextResponse.json({ error: "No se encontró tienda asociada al usuario." }, { status: 404 });
    }

    const existingKeys = (userStore.paymentKeysJson as any) || {};

    const updatedKeys = {
      ...existingKeys,
      initialSetupCompleted: initialSetupCompleted !== undefined ? Boolean(initialSetupCompleted) : true,
      tutorialSeen: tutorialSeen !== undefined ? Boolean(tutorialSeen) : true,
    };

    const updateData: any = {
      paymentKeysJson: updatedKeys,
    };

    if (slug) {
      updateData.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
    }

    if (logoUrl !== undefined) {
      updateData.logoUrl = logoUrl;
    }

    const updatedStore = await prisma.store.update({
      where: { id: userStore.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      store: updatedStore,
      initialSetupCompleted: updatedKeys.initialSetupCompleted,
      tutorialSeen: updatedKeys.tutorialSeen,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al guardar configuración inicial en PostgreSQL", details: error.message },
      { status: 500 }
    );
  }
}
