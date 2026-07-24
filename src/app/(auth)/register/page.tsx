"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { ArrowRight, Lock, Mail, Store, Phone, User, Sparkles, AlertCircle, Clock, CheckCircle2, MessageSquare, CreditCard, Check, Copy, Eye, EyeOff } from "lucide-react";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/subscription-payment";

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "FREE_TRIAL";

  const [selectedPlan, setSelectedPlan] = useState<string>(
    initialPlan === "EMPRESA" ? "EMPRESA" : initialPlan === "PRO" ? "PRO" : initialPlan === "BASICO" ? "BASICO" : "FREE_TRIAL"
  );

  const [paymentMethod, setPaymentMethod] = useState<string>("Nequi (3052311490)");

  const [form, setForm] = useState({
    fullName: "",
    storeName: "",
    whatsapp: "",
    email: "",
    password: "",
    confirmPassword: "",
    niche: "GENERAL" as "ZAPATOS" | "ROPA" | "COMIDA" | "SALUD" | "TECNOLOGIA" | "GENERAL",
    currency: "COP" as "COP" | "USD"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(type);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor verifícalas.");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan: selectedPlan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar la cuenta.");
      }

      setRegisteredSuccess(true);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de Confirmación de Registro Pendiente de Aprobación
  if (registeredSuccess) {
    const adminPhone = ADMIN_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

    const planName = 
      selectedPlan === "EMPRESA" ? "Plan Empresa Élite VIP ($25.000 COP/mes)" :
      selectedPlan === "PRO" ? "Plan Negocio Pro ($20.000 COP/mes)" :
      selectedPlan === "BASICO" ? "Plan Emprendedor Express ($15.000 COP/mes)" :
      "Prueba Gratis (15 Días - $0 COP)";

    const waText = encodeURIComponent(
      `👋 Hola Administrador, me acabo de registrar en VisionWeb.\n\n` +
      `👤 *Nombre:* ${form.fullName}\n` +
      `🏬 *Tienda:* ${form.storeName}\n` +
      `📧 *Correo:* ${form.email}\n` +
      `📱 *WhatsApp:* ${form.whatsapp}\n` +
      `💎 *Plan Contratado:* ${planName}\n` +
      `💳 *Método de Pago Seleccionado:* ${paymentMethod}\n\n` +
      `Adjunto mi comprobante de pago / transferencia para la aprobación y activación del servicio.`
    );
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${waText}`;

    return (
      <div className="text-center py-2">
        <div className="h-14 w-14 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-3 border border-amber-500/30 animate-pulse">
          <Clock className="h-7 w-7" />
        </div>

        <h1 className="text-xl font-black text-white mb-1">¡Registro Recibido con Éxito!</h1>
        
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Tu cuenta para <strong className="text-white">"{form.storeName}"</strong> ha sido registrada. Está en <span className="text-amber-400 font-bold">espera de aprobación</span>.
        </p>

        {/* Tarjeta con Cuentas de Pago Nequi y Bancolombia */}
        <div className="mb-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#60A5FA] flex items-center gap-1.5">
              <CreditCard className="h-4 w-4" /> Cuentas para Pago / Transferencia
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">Oficial</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Plan seleccionado: <strong className="text-emerald-400">{planName}</strong>
          </p>

          {/* Selección del Método de Pago deseado */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Selecciona el Método de Pago con el que realizaste la transferencia *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("Nequi (3052311490)")}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                  paymentMethod.includes("Nequi")
                    ? "bg-pink-500/20 border-pink-500 text-pink-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span>Nequi</span>
                {paymentMethod.includes("Nequi") && <Check className="h-3.5 w-3.5 text-pink-400" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("Bancolombia (912-662699-31)")}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                  paymentMethod.includes("Bancolombia")
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span>Bancolombia</span>
                {paymentMethod.includes("Bancolombia") && <Check className="h-3.5 w-3.5 text-amber-400" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("Efectivo / Acuerdo por WhatsApp")}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                  paymentMethod.includes("Efectivo")
                    ? "bg-[#0052FF]/20 border-[#0052FF] text-[#60A5FA]"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span>Acuerdo / Otro</span>
                {paymentMethod.includes("Efectivo") && <Check className="h-3.5 w-3.5 text-[#60A5FA]" />}
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {/* Nequi */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <div>
                <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider block">Nequi</span>
                <span className="text-xs font-mono font-bold text-white">3052311490</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard("3052311490", "nequi")}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
              >
                {copiedBank === "nequi" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedBank === "nequi" ? "¡Copiado!" : "Copiar"}</span>
              </button>
            </div>

            {/* Bancolombia */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Bancolombia Ahorros</span>
                <span className="text-xs font-mono font-bold text-white">912-662699-31</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard("912-662699-31", "bancolombia")}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
              >
                {copiedBank === "bancolombia" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedBank === "bancolombia" ? "¡Copiado!" : "Copiar"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mensaje Urgente sobre Logo y Link al ingresar */}
        <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-left">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>⚠️ Configuración en tu Primer Ingreso</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Al ser aprobado e ingresar por primera vez al Dashboard, se te solicitará tu <strong>Logo</strong> (o continuar sin logo) y el <strong>Enlace de tu web</strong>.
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-lg shadow-[#25D366]/20 mb-3"
        >
          <MessageSquare className="h-4 w-4 fill-slate-950" /> Enviar Comprobante ({paymentMethod.split(" ")[0]}) por WhatsApp
        </a>

        <Link
          href="/login"
          className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition text-xs border border-slate-700"
        >
          Ir al Inicio de Sesión
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 rounded-2xl border border-[#0052FF]/30 bg-[#0052FF]/10 p-3.5 flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-[#0052FF] text-white flex items-center justify-center shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#60A5FA]">Crea Tu Tienda Online en Minutos</p>
          <p className="text-[11px] text-slate-400">Selecciona entre los 4 planes e ingresa tus datos.</p>
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-white">Crear Mi Tienda Web</h1>
        <p className="text-xs text-slate-400 mt-1">Completa tus datos y selecciona tu plan.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-3.5">
        {/* Selección entre los 4 Planes */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">Selecciona el Plan que Deseas Contratar *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedPlan("FREE_TRIAL")}
              className={`p-3 rounded-xl border text-left transition ${
                selectedPlan === "FREE_TRIAL"
                  ? "bg-emerald-500/15 border-emerald-500 text-white"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">1. Prueba Gratis</span>
                <span className="text-[10px] font-black text-emerald-400">$0 COP</span>
              </div>
              <span className="text-[10px] text-slate-400 block">15 Días de prueba sin costo</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan("BASICO")}
              className={`p-3 rounded-xl border text-left transition ${
                selectedPlan === "BASICO"
                  ? "bg-[#0052FF]/15 border-[#0052FF] text-white"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">2. Emprendedor</span>
                <span className="text-[10px] font-black text-[#60A5FA]">$15.000/mes</span>
              </div>
              <span className="text-[10px] text-slate-400 block">WhatsApp + Stock + Métricas</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan("PRO")}
              className={`p-3 rounded-xl border text-left transition ${
                selectedPlan === "PRO"
                  ? "bg-blue-500/15 border-blue-500 text-white"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">3. Negocio Pro</span>
                <span className="text-[10px] font-black text-blue-400">$20.000/mes</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Branding + Métricas Pro</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan("EMPRESA")}
              className={`p-3 rounded-xl border text-left transition ${
                selectedPlan === "EMPRESA"
                  ? "bg-purple-600/15 border-purple-500 text-white"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">4. Empresa Élite</span>
                <span className="text-[10px] font-black text-amber-400">$25.000/mes</span>
              </div>
              <span className="text-[10px] text-purple-300 block">Pasarelas + Dominio VIP</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Completo *</label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              required
              placeholder="Carlos Mendoza"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Nombre de Tu Tienda *</label>
          <div className="relative">
            <Store className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              required
              placeholder="Mi Tienda Estilo"
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Número de WhatsApp (57...) *</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="tel"
              required
              placeholder="573001234567"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Correo Electrónico *</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="email"
              required
              placeholder="emprendedor@visionweb.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
            />
          </div>
        </div>

        {/* Contraseña con Botón de Ojo 👀 */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Contraseña *</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition"
              title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirmar Contraseña con Botón de Ojo 👀 */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Confirmar Contraseña *</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition"
              title={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0052FF] hover:bg-[#0043D6] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#0052FF]/20 mt-2"
        >
          {loading ? "Registrando en BD..." : "Registrar Cuenta y Solicitar Activación"} <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-400">
          ¿Ya tienes una cuenta activada?{" "}
          <Link href="/login" className="text-[#0052FF] font-bold hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 selection:bg-[#0052FF]">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden my-8">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#0052FF]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-center mb-6">
          <Link href="/">
            <Logo className="h-14" variant="dark" />
          </Link>
        </div>

        <Suspense fallback={<div className="text-center text-slate-500 text-sm py-10">Cargando...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
