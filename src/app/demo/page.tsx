"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { 
  ShoppingBag, 
  ShoppingCart, 
  ArrowLeft, 
  Check, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Star,
  Plus,
  Minus,
  X,
  ArrowRight,
  Instagram
} from "lucide-react";
import { formatCOP } from "@/lib/utils";

const DEMO_PRODUCTS = [
  {
    id: "demo-1",
    title: "Chaqueta Denim Vintage Edición Especial",
    price: 120000,
    comparePrice: 160000,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    category: "Chaquetas",
    description: "Chaqueta de jean estilo vintage con acabados premium y costuras reforzadas.",
  },
  {
    id: "demo-2",
    title: "Camiseta Oversize Algodón Orgánico 240g",
    price: 55000,
    comparePrice: 75000,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    category: "Camisetas",
    description: "Camiseta pesada 100% algodón de horma oversize cómoda y elegante.",
  },
  {
    id: "demo-3",
    title: "Tenis Urban White Limited Edition",
    price: 185000,
    comparePrice: 220000,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
    category: "Calzado",
    description: "Tenis urbanos de cuero sintético con suela acolchada para máxima durabilidad.",
  },
  {
    id: "demo-4",
    title: "Gafas de Sol Polarizadas UV400 Dark Black",
    price: 48000,
    comparePrice: 65000,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
    category: "Accesorios",
    description: "Gafas de sol unisex con protección UV400 y marco ultraliviano.",
  },
];

export default function StaticDemoStore() {
  const [cart, setCart] = useState<{ id: string; title: string; price: number; qty: number; imageUrl: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const addToCart = (prod: typeof DEMO_PRODUCTS[0]) => {
    const existing = cart.find((item) => item.id === prod.id);
    if (existing) {
      setCart(cart.map((item) => item.id === prod.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { id: prod.id, title: prod.title, price: prod.price, qty: 1, imageUrl: prod.imageUrl }]);
    }
    triggerToast(`¡${prod.title} añadido al carrito!`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as typeof cart
    );
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleSendTestOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone) {
      alert("Por favor ingresa tu número de WhatsApp.");
      return;
    }

    const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("57") ? cleanPhone : `57${cleanPhone}`;

    let msg = `🛍️ *NUEVO PEDIDO DE PRUEBA (TIENDA DEMO VISIONWEB)*\n\n`;
    cart.forEach((item) => {
      msg += `• *${item.qty}x* ${item.title} - ${formatCOP(item.price * item.qty)}\n`;
    });
    msg += `\n💰 *Total del Pedido:* ${formatCOP(totalPrice)}\n\n`;
    msg += `📌 *Cliente:* ${customerName || "Cliente Demo"}\n`;
    msg += `📍 *Dirección:* ${customerAddress || "Dirección de Ejemplo"}\n\n`;
    msg += `✨ *¡Este es el ejemplo de cómo se verá una orden real recibida en tu negocio!*`;

    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    setIsCheckoutModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-[#0052FF]">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce text-xs font-bold">
          <Check className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner Demo Disclaimer */}
      <div className="bg-gradient-to-r from-[#0052FF] to-blue-600 text-white text-center py-2 px-4 text-xs font-black flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4" />
        <span>TIENDA DE EJEMPLO ESTÁTICA - Así lucirá la página web de tu negocio</span>
        <Link href="/register?plan=FREE_TRIAL" className="underline bg-white/20 hover:bg-white/30 px-3 py-0.5 rounded-full font-bold ml-2">
          Crear Mi Tienda Ahora
        </Link>
      </div>

      {/* Store Header Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#07090e]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-white p-2 rounded-xl border border-slate-800 bg-slate-900 transition">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-10 w-10 rounded-xl bg-[#0052FF] text-white font-black flex items-center justify-center text-sm shadow-md">
              ML
            </div>
            <div>
              <h1 className="font-extrabold text-white text-sm sm:text-base leading-tight">Moda & Estilo LatAm</h1>
              <p className="text-[11px] text-slate-400 font-mono">visionweb.app/demo</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-[#0052FF] px-4 py-2 rounded-xl text-xs font-bold transition"
          >
            <ShoppingCart className="h-4 w-4 text-[#25D366]" />
            <span>Carrito</span>
            {totalItems > 0 && (
              <span className="bg-[#0052FF] text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center ml-1">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Store Hero Banner */}
      <section className="relative bg-slate-900/50 border-b border-slate-800 py-12 px-6 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] px-3 py-1 rounded-full text-xs font-bold mb-4">
            <Star className="h-3.5 w-3.5 fill-[#25D366]" /> Colección Primavera / Verano 2026
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">Moda Urbana & Accesorios Lujo</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Envío exprés a todo el país. Elige tus productos, agrégalos al carrito y haz tu pedido directamente por WhatsApp.
          </p>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#0052FF]" /> Catálogo de Productos ({DEMO_PRODUCTS.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">Demostración interactiva de cliente</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEMO_PRODUCTS.map((prod) => (
            <div key={prod.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition group shadow-lg">
              <div>
                <div className="relative aspect-square overflow-hidden bg-slate-950">
                  <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute top-3 left-3 bg-[#0052FF] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                    {prod.category}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-white text-sm mb-1 leading-snug line-clamp-2">{prod.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">{prod.description}</p>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-black text-emerald-400">{formatCOP(prod.price)}</span>
                    {prod.comparePrice && (
                      <span className="text-xs text-slate-500 line-through">{formatCOP(prod.comparePrice)}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => addToCart(prod)}
                  className="w-full bg-[#0052FF] hover:bg-[#0043D6] text-white text-xs font-extrabold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#0052FF]/20"
                >
                  <Plus className="h-4 w-4" /> Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-[#25D366]" /> Mi Carrito de Compras
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-3">
                  <ShoppingCart className="h-12 w-12 mx-auto text-slate-600" />
                  <p className="text-xs">Tu carrito de compras está vacío.</p>
                  <p className="text-[11px] text-slate-500">Agrega un producto para simular el proceso de compra.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.title} className="h-12 w-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-white max-w-[170px] truncate">{item.title}</h4>
                          <span className="text-xs text-emerald-400 font-mono font-bold">{formatCOP(item.price)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1 text-slate-400 hover:text-white">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-white px-1">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1 text-slate-400 hover:text-white">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-sm font-black text-white">
                  <span>Total Acumulado:</span>
                  <span className="text-emerald-400 font-mono text-base">{formatCOP(totalPrice)}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutModalOpen(true);
                  }}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black py-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="h-4 w-4 fill-slate-950" /> Probar Envío de Pedido a WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL DE PRUEBA */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#25D366]" /> Probar Enviar Pedido a Tu WhatsApp
              </h3>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              Ingresa tu propio número de teléfono para enviarte a ti mismo el resumen de este pedido de prueba y comprobar exactamente cómo le llegarán los pedidos a tu negocio.
            </p>

            <form onSubmit={handleSendTestOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tu Número de WhatsApp (ej. 3001234567) *</label>
                <input
                  type="text"
                  required
                  placeholder="3001234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white font-mono rounded-xl p-3 focus:outline-none focus:border-[#0052FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Pérez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-[#0052FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Dirección de Entrega (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. Calle 100 # 15-20, Bogotá"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-[#0052FF]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black px-6 py-2.5 rounded-xl transition text-xs shadow-lg flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4 fill-slate-950" /> Enviar Pedido a Mi WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {totalItems > 0 && !isCartOpen && !isCheckoutModalOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-2.5 pr-5 rounded-2xl shadow-2xl text-white transition transform hover:scale-105"
          >
            <div className="h-10 w-10 rounded-xl bg-[#25D366] text-slate-950 font-black flex items-center justify-center relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-slate-950 text-white font-mono text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border border-slate-700">
                {totalItems}
              </span>
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Ver Carrito</span>
              <span className="font-mono text-xs font-black text-emerald-400">{formatCOP(totalPrice)}</span>
            </div>
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}

      {/* Footer Demo */}
      <footer className="border-t border-slate-800 bg-[#05070a] py-10 text-center text-xs text-slate-500 mt-16">
        <div className="flex flex-col items-center justify-center gap-4 mb-4">
          <Logo className="h-8" variant="dark" />
          <a
            href="https://www.instagram.com/visionwebs.co?utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white font-extrabold text-xs shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/20"
          >
            <Instagram className="h-5 w-5 animate-pulse text-white" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[9px] uppercase tracking-wider opacity-90 font-bold">Síguenos en Instagram</span>
              <span className="font-mono text-xs font-black text-white">@visionwebs.co</span>
            </div>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <p>© 2026 VisionWeb. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
