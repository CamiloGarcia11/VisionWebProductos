import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCOP(amount: number | string): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return "$ 0";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * Determina si un color HEX es claro u oscuro (Luminancia YIQ).
 * Retorna true si es un tono claro, false si es oscuro.
 */
export function isLightColor(hexColor: string): boolean {
  if (!hexColor) return false;
  let hex = hexColor.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  if (hex.length !== 6) return false;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140;
}

/**
 * Retorna '#0f172a' (texto oscuro) si el fondo es claro o '#ffffff' (texto claro) si el fondo es oscuro.
 */
export function getContrastTextColor(hexColor: string): string {
  return isLightColor(hexColor) ? "#0f172a" : "#ffffff";
}
