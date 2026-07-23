import { NextResponse } from "next/server";
import { getCurrentAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentAuthUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
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
      { error: "Error al obtener usuario actual", details: error.message },
      { status: 500 }
    );
  }
}
