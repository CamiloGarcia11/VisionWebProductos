import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VisionWeb - Plataforma SaaS E-commerce LatAm",
  description: "Crea tu tienda online en minutos. Vende directo por WhatsApp.",
  icons: {
    icon: [
      { url: "/vw-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/vw-logo.png",
    apple: "/vw-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
