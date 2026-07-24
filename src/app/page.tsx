"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { 
  Store, 
  Zap, 
  CreditCard, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  TrendingUp,
  ShoppingCart,
  Check,
  Palette,
  Image as ImageIcon,
  Star,
  Instagram,
  Megaphone
} from "lucide-react";
import { formatCOP } from "@/lib/utils";
import { generateWhatsAppSaaSLink } from "@/lib/subscription-payment";

export default function LandingPage() {
  // Demo interactivo de la Hero Section
  const [demoMode, setDemoMode] = useState<"WHATSAPP" | "WOMPI">("WHATSAPP");
  const [demoCart, setDemoCart] = useState([
    { title: "Chaqueta Denim Vintage", price: 120000, qty: 1 },
    { title: "Camiseta Oversize Algodón", price: 55000, qty: 2 },
  ]);

  const [testUserPhone, setTestUserPhone] = useState("");
  const demoTotal = demoCart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleTestOrderToMyPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testUserPhone.trim()) {
      alert("Por favor ingresa tu número de WhatsApp para enviarte el pedido de prueba.");
      return;
    }
    const cleanPhone = testUserPhone.replace(/[^0-9]/g, "");
    const targetPhone = cleanPhone.startsWith("57") ? cleanPhone : `57${cleanPhone}`;

    let msg = `🛍️ *PEDIDO DE PRUEBA EN VIVO - VISIONWEB*\n\n`;
    demoCart.forEach((item) => {
      msg += `• *${item.qty}x* ${item.title} - ${formatCOP(item.price * item.qty)}\n`;
    });
    msg += `\n💰 *Total del Pedido:* ${formatCOP(demoTotal)}\n\n`;
    msg += `📍 *Cliente:* Tu Nombre / Demo\n`;
    msg += `✨ *¡Así de fácil y organizado recibirás los pedidos de tus clientes directamente en tu WhatsApp!*`;

    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-[#0052FF] selection:text-white font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#07090e]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <Logo className="h-10" variant="dark" />
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#demo" className="text-sm font-semibold text-slate-300 transition hover:text-white hover:text-[#60A5FA]">Demo Interactivo</a>
            <a href="#modos" className="text-sm font-semibold text-slate-300 transition hover:text-white hover:text-[#60A5FA]">Modos Híbridos</a>
            <a href="#pricing" className="text-sm font-semibold text-slate-300 transition hover:text-white hover:text-[#60A5FA]">Planes de Arriendo</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register?plan=FREE_TRIAL"
              className="glow-button rounded-xl px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-extrabold text-white transition shrink-0"
            >
              Crear Mi Tienda Web
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 hero-gradient-mesh">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0052FF]/40 bg-[#0052FF]/10 px-4 py-1.5 text-xs font-bold text-[#60A5FA] mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(0,82,255,0.2)]">
                <Sparkles className="h-4 w-4 text-[#0052FF]" /> Prueba Gratis de 15 Días en Todos los Registros
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
                Crea tu tienda web y vende por{" "}
                <span className="bg-gradient-to-r from-[#60A5FA] via-[#0052FF] to-blue-400 bg-clip-text text-transparent">
                  WhatsApp o Pasarela
                </span>
              </h1>

              <p className="text-lg leading-relaxed text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Plataforma de e-commerce híbrido para Colombia. Personaliza tu tienda con tu propio Logo, elige tus 2 Colores de Marca y vende por WhatsApp o pasarelas electrónicas.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/register?plan=FREE_TRIAL"
                  className="glow-button w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-extrabold text-white shadow-xl"
                >
                  Activar 15 Días Gratis <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-7 py-4 text-base font-bold text-white transition hover:bg-slate-800 hover:border-slate-700"
                >
                  Ver Tienda Demo
                </Link>
              </div>
            </div>

            {/* Hero Right Card */}
            <div id="demo" className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden text-left">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <span className="text-xs font-bold text-slate-400">Demostración en Vivo</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded-full">PROBAR AHORA</span>
                </div>

                <div className="space-y-2.5 mb-4">
                  {demoCart.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-white font-medium">{item.title} (x{item.qty})</span>
                      <span className="text-[#60A5FA] font-bold">{formatCOP(item.price * item.qty)}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-black text-sm text-white">
                    <span>Total del Carrito:</span>
                    <span className="text-emerald-400 font-mono">{formatCOP(demoTotal)}</span>
                  </div>
                </div>

                {/* Formulario de prueba en vivo para enviar al propio WhatsApp del usuario */}
                <form onSubmit={handleTestOrderToMyPhone} className="space-y-3 pt-3 border-t border-slate-800">
                  <label className="block text-[11px] font-bold text-slate-300">
                    Ingresa TU número de WhatsApp para recibir este pedido de ejemplo:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="3001234567"
                      value={testUserPhone}
                      onChange={(e) => setTestUserPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs font-mono text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0052FF]"
                    />
                    <button
                      type="submit"
                      className="bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black px-4 py-2.5 rounded-xl transition text-xs shadow-lg flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <MessageSquare className="h-4 w-4 fill-slate-950" /> Probar en Mi WhatsApp
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center font-medium">
                    Te redirigirá a WhatsApp con la plantilla de pedido armada para tu número.
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section with 4 Plans & WhatsApp Direct Links */}
      <section id="pricing" className="py-24 border-t border-slate-900 bg-[#07090e]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white">Planes de Suscripción (Arriendo)</h2>
            <p className="mt-4 text-slate-400 text-sm">Elige el plan ideal para tu negocio. Haz clic en cualquier plan para acordar la contratación directo por WhatsApp con nosotros.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Plan 1: Gratis 15 Días */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between relative border border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-[#60A5FA] mb-4 border border-blue-500/20">
                  <Clock className="h-3.5 w-3.5" /> 15 Días Gratis
                </div>
                <h3 className="text-lg font-bold text-white">Prueba Starter</h3>
                <p className="text-xs text-slate-400 mt-1">15 días de prueba sin costo</p>
                <div className="mt-5">
                  <span className="text-3xl font-black text-white">$0</span>
                  <span className="text-slate-400 text-xs"> / 15 días gratis</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0052FF] shrink-0" /> 15 Días Acceso Total</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0052FF] shrink-0" /> Checkout por WhatsApp</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0052FF] shrink-0" /> Catálogo de Productos</li>
                </ul>
              </div>
              <a
                href={generateWhatsAppSaaSLink("FREE_TRIAL")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block text-center rounded-xl bg-slate-800 hover:bg-slate-700 py-3 font-bold text-white transition text-xs border border-slate-700"
              >
                Solicitar 15 Días Gratis
              </a>
            </div>

            {/* Plan 2: $15.000 COP */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between relative border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Emprendedor Express</h3>
                <p className="text-xs text-slate-400 mt-1">Para ventas activas por WhatsApp</p>
                <div className="mt-5">
                  <span className="text-3xl font-black text-white">$15.000</span>
                  <span className="text-slate-400 text-xs"> COP / mes</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Pedidos por WhatsApp Ilimitados</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Gestor de Stock e Inventario</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Soporte Estándar 24/7</li>
                </ul>
              </div>
              <a
                href={generateWhatsAppSaaSLink("BASICO")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block text-center rounded-xl bg-[#25D366] hover:bg-[#20bd5a] py-3 font-black text-slate-950 transition text-xs shadow-lg shadow-[#25D366]/20"
              >
                Contratar Plan ($15.000)
              </a>
            </div>

            {/* Plan 3: $20.000 COP (Logo + 2 Colores + Métricas) */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between relative border border-slate-800 hover:border-slate-700 transition">
              <div>
                <h3 className="text-lg font-bold text-white">Negocio Pro</h3>
                <p className="text-xs text-slate-400 mt-1">Con personalización de Marca</p>
                <div className="mt-5">
                  <span className="text-3xl font-black text-white">$20.000</span>
                  <span className="text-slate-400 text-xs"> COP / mes</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-[#60A5FA] shrink-0" /> Logo Oficial Personalizado</li>
                  <li className="flex items-center gap-2"><Palette className="h-4 w-4 text-[#60A5FA] shrink-0" /> Elección de 2 Colores de Marca</li>
                  <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#25D366] shrink-0" /> Métricas & Estadísticas de Ventas</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0052FF] shrink-0" /> Tipografías Google Fonts de Lujo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0052FF] shrink-0" /> Pedidos por WhatsApp Ilimitados</li>
                </ul>
              </div>
              <a
                href={generateWhatsAppSaaSLink("PRO")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block text-center rounded-xl bg-slate-800 hover:bg-slate-700 py-3 font-bold text-white transition text-xs border border-slate-700"
              >
                Contratar Plan ($20.000)
              </a>
            </div>

            {/* Plan 4: $25.000 COP (ÉLITE VIP - PLAN PREMIUM RECOMENDADO CON MÁXIMA LABIA) */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between relative border-2 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.3)] bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-900">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-3 py-0.5 text-[10px] font-black text-white uppercase tracking-wider shadow-lg">
                🌟 ÉLITE VIP - TODO INCLUIDO
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" /> Empresa Élite VIP
                </h3>
                <p className="text-xs text-purple-300 font-bold mt-1">El plan definitivo para facturar más</p>
                <div className="mt-5">
                  <span className="text-3xl font-black text-white">$25.000</span>
                  <span className="text-slate-400 text-xs"> COP / mes</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-200 font-medium">
                  <li className="flex items-center gap-2 font-bold text-amber-400">
                    <Sparkles className="h-4 w-4 shrink-0" /> Acceso Total sin Restricciones
                  </li>
                  <li className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-purple-400 shrink-0" /> Generador de Banners & Anuncios HD
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" /> Resumen Financiero (Ventas vs Gastos)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" /> Descuentos Masivos a Todo en 1 Clic
                  </li>
                  <li className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-[#60A5FA] shrink-0" /> Branding Completo (Logo + Colores)
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400 shrink-0" /> Alertas Automáticas de Reposición
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" /> Soporte Prioritario VIP 24/7 Directo
                  </li>
                </ul>
              </div>
              <a
                href={generateWhatsAppSaaSLink("EMPRESA")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block text-center rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 py-3.5 font-black text-white transition text-xs shadow-xl shadow-purple-500/25 transform hover:scale-[1.02]"
              >
                Contratar Plan Élite VIP ($25.000)
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#05070a] py-12 text-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <Logo className="h-9" variant="dark" />

          {/* Enlace Animado de Instagram de Alta Visibilidad */}
          <a
            href="https://www.instagram.com/visionwebs.co?utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white font-extrabold text-xs shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/30 whitespace-nowrap max-w-full"
          >
            <Instagram className="h-5 w-5 animate-pulse text-white shrink-0" />
            <div className="flex flex-col text-left leading-tight shrink-0">
              <span className="text-[10px] uppercase tracking-wider font-bold text-white/90">Síguenos en Instagram</span>
              <span className="font-mono text-xs font-black text-white">@visionwebs.co</span>
            </div>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform shrink-0" />
          </a>
        </div>
        <p>© 2026 VisionWeb. Plataforma SaaS E-commerce Híbrido para Colombia & Latinoamérica.</p>
      </footer>
    </div>
  );
}
