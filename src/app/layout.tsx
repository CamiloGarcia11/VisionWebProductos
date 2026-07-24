import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VisionWeb - Plataforma SaaS E-commerce LatAm",
  description: "Crea tu tienda online en minutos. Vende directo por WhatsApp.",
  metadataBase: new URL("https://www.visionwebproductos.lat"),
  openGraph: {
    title: "VisionWeb - Plataforma SaaS E-commerce LatAm",
    description: "Crea tu tienda online en minutos. Vende directo por WhatsApp.",
    url: "https://www.visionwebproductos.lat",
    siteName: "VisionWeb",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VisionWeb - Plataforma SaaS E-commerce LatAm",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VisionWeb - Plataforma SaaS E-commerce LatAm",
    description: "Crea tu tienda online en minutos. Vende directo por WhatsApp.",
    images: ["/og-image.png"],
  },
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
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
