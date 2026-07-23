"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, CreditCard, ArrowLeft, ShieldCheck, CheckCircle2, Truck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatCOP } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp-formatter";

const MOCK_STORE = {
  storeName: "Moda & Estilo LatAm",
  slug: "moda-latam",
  whatsappNumber: "573001234567",
  enableWhatsapp: true,
  enableGateway: true,
};

export default function CheckoutPage({ params }: { params: { store_slug: string } }) {
  const { items, getTotalPrice, clearCart } = useCart();

  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "Bogotá",
    notes: "",
  });

  const [paymentMode, setPaymentMode] = useState<"WHATSAPP" | "GATEWAY">("WHATSAPP");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.address) {
      alert("Por favor completa los campos de entrega obligatorios.");
      return;
    }

    const url = buildWhatsAppUrl(
      MOCK_STORE.whatsappNumber,
      MOCK_STORE.storeName,
      items,
      getTotalPrice(),
      customer
    );

    // Abrir WhatsApp en una nueva pestaña
    window.open(url, "_blank");
    setOrderCompleted(true);
  };

  const handleGatewayCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.address) {
      alert("Por favor completa los campos de entrega obligatorios.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderCompleted(true);
      clearCart();
    }, 2000);
  };

  if (items.length === 0 && !orderCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-sm text-slate-500 mb-6">Regresa al catálogo para seleccionar tus productos.</p>
          <Link href={`/${MOCK_STORE.slug}`} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl inline-block text-sm">
            Volver a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full shadow-md">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">¡Pedido Procesado con Éxito!</h2>
          <p className="text-sm text-slate-600 mb-6">
            {paymentMode === "WHATSAPP"
              ? "Tu pedido ha sido enviado al WhatsApp del vendedor. Por favor confirma los datos en el chat."
              : "Pago recibido satisfactoriamente por Pasarela Directa (Wompi / Mercado Pago). El vendedor enviará el paquete pronto."}
          </p>
          <Link href={`/${MOCK_STORE.slug}`} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl inline-block text-sm w-full">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href={`/${MOCK_STORE.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>

        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-600" /> Información de Envío
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="3001234567"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad *</label>
                    <input
                      type="text"
                      required
                      placeholder="Bogotá"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dirección de Entrega *</label>
                  <input
                    type="text"
                    required
                    placeholder="Calle 123 # 45 - 67 Apt 201"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notas del Pedido (Opcional)</label>
                  <textarea
                    rows={2}
                    placeholder="Talla M, dejar en portería..."
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Hybrid Payment Selector */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" /> Método de Pago
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMode("WHATSAPP")}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    paymentMode === "WHATSAPP"
                      ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <MessageSquare className="h-6 w-6 text-emerald-600" />
                    {paymentMode === "WHATSAPP" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Pedido por WhatsApp</h3>
                  <p className="text-xs text-slate-500 mt-1">Acuerda el pago por Nequi, Daviplata o Contraentrega directamente.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode("GATEWAY")}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    paymentMode === "GATEWAY"
                      ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                    {paymentMode === "GATEWAY" && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Pasarela Directa</h3>
                  <p className="text-xs text-slate-500 mt-1">Paga en línea seguro con PSE, Tarjeta o Wompi / Mercado Pago.</p>
                </button>
              </div>

              {/* Dynamic CTA Button */}
              {paymentMode === "WHATSAPP" ? (
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-base shadow-md"
                >
                  <MessageSquare className="h-5 w-5" /> Enviar Pedido a WhatsApp
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGatewayCheckout}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-base shadow-md disabled:opacity-50"
                >
                  <CreditCard className="h-5 w-5" /> {isProcessing ? "Procesando Pago..." : "Pagar con Wompi / Mercado Pago"}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h2 className="font-bold text-lg text-slate-900 mb-4">Resumen del Pedido</h2>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-slate-500">Cant: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-emerald-700">{formatCOP(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{formatCOP(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío:</span>
                <span className="text-emerald-600 font-semibold">Por acordar</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total:</span>
                <span className="text-emerald-700">{formatCOP(getTotalPrice())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
