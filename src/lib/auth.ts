import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "visionweb_super_secret_jwt_key_latam_2026";
const COOKIE_NAME = "visionweb_session";

// Hashea la contraseña con bcrypt
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Compara la contraseña plana con el hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Firma un payload básico usando HMAC SHA-256 (Web Crypto API)
export async function createSessionToken(payload: { userId: string; email: string; role: string }): Promise<string> {
  const encoder = new TextEncoder();
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 días
  const body = btoa(JSON.stringify({ ...payload, exp }));
  
  const unsignedToken = `${header}.${body}`;
  
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(unsignedToken)
  );

  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${unsignedToken}.${base64Signature}`;
}

// Verifica el token JWT y devuelve el payload
export async function verifySessionToken(token: string): Promise<{ userId: string; email: string; role: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const unsignedToken = `${header}.${body}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Convert base64url back to Uint8Array
    const base64Sig = signature.replace(/-/g, "+").replace(/_/g, "/");
    const padLen = (4 - (base64Sig.length % 4)) % 4;
    const paddedSig = base64Sig + "=".repeat(padLen);
    const binarySig = atob(paddedSig);
    const sigArray = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigArray[i] = binarySig.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigArray,
      encoder.encode(unsignedToken)
    );

    if (!isValid) return null;

    const payload = JSON.parse(atob(body));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expirado
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    return null;
  }
}

// Establece la cookie de sesión HTTP-Only
export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 días
    path: "/",
  });
}

// Borra la cookie de sesión
export function removeSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
}

// Obtiene el usuario autenticado actual desde las cookies o lanza null
export async function getCurrentAuthUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const verified = await verifySessionToken(token);
    if (!verified) return null;

    const user = await prisma.user.findUnique({
      where: { id: verified.userId },
      include: { stores: true, subscriptions: true },
    });

    if (!user || !user.isActive) return null;

    // Verificar vencimiento de 15 días de prueba gratis para comerciantes
    if (user.role !== "SUPER_ADMIN") {
      const activeSub = user.subscriptions[0];
      if (activeSub && activeSub.currentPeriodEnd) {
        const isExpired = new Date(activeSub.currentPeriodEnd) < new Date();
        if (isExpired) {
          // Si los 15 días expiraron, marcar inactivo y borrar cookie de sesión
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { isActive: false },
            });
            await prisma.subscription.update({
              where: { id: activeSub.id },
              data: { status: "PAST_DUE" },
            });
          } catch (e) {
            // Ignorar errores en auto-update si fallara conexion
          }
          removeSessionCookie();
          return null;
        }
      }
    }

    return user;
  } catch (error) {
    return null;
  }
}

// Asegura que exista al menos un Super Admin en la BD (Seed automático)
export async function ensureSuperAdminExists() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@visionweb.com";
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "SUPER_ADMIN" },
    });

    if (!existingAdmin) {
      const defaultPassword = process.env.ADMIN_PASSWORD || "admin123456";
      const hashedPassword = await hashPassword(defaultPassword);

      await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash: hashedPassword,
          fullName: "Super Admin VisionWeb",
          phoneNumber: "573052311490",
          role: "SUPER_ADMIN",
          isActive: true,
          stores: {
            create: {
              storeName: "Plataforma VisionWeb Admin",
              slug: "visionweb-admin",
              whatsappNumber: "573052311490",
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("[Seed Error]", error);
  }
}
