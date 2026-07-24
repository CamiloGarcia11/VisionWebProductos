"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { ArrowRight, Lock, Mail, AlertCircle, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/subscription-payment";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "FREE_TRIAL";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [trialExpiredState, setTrialExpiredState] = useState<{
    isExpired: boolean;
    storeName?: string;
    email?: string;
  }>({ isExpired: false });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTrialExpiredState({ isExpired: false });
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.trialExpired) {
          setTrialExpiredState({
            isExpired: true,
            storeName: data.storeName,
            email: email,
          });
        }
        throw new Error(data.error || "Error al iniciar sesión.");
      }

      if (data.user.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  // Si la prueba gratis de 15 días ha expirado
  if (trialExpiredState.isExpired) {
    const adminPhone = ADMIN_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
    const waText = encodeURIComponent(
      `👋 Hola Administrador, mis 15 días de prueba gratis en VisionWeb han finalizado.\n\n` +
      `🏬 *Tienda:* ${trialExpiredState.storeName || "Mi Tienda"}\n` +
      `📧 *Correo registrado:* ${trialExpiredState.email || email}\n\n` +
      `Deseo renovar mi suscripción para continuar utilizando la plataforma y publicar productos.`
    );
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${waText}`;

    return (
      <div className="text-center py-2">
        <div className="h-14 w-14 bg-red-500/20 text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-3 border border-red-500/30">
          <Clock className="h-7 w-7 animate-pulse" />
        </div>

        <h1 className="text-xl font-black text-white mb-2">¡Tus 15 Días de Prueba Han Finalizado!</h1>
        
        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          Los 15 días gratis de prueba para tu tienda <strong className="text-white">"{trialExpiredState.storeName || "tu negocio"}"</strong> han culminado. Tu sesión ha finalizado.
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2 mb-5">
          <p className="text-slate-300 font-bold mb-1">Para reactivar tu tienda y seguir vendiendo:</p>
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Plan Emprendedor: $20.000 COP/mes (WhatsApp + Métricas)
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-[#0052FF] shrink-0" /> Plan Negocio Pro: $25.000 COP/mes (Pasarelas + Dominio)
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#25D366]/20 mb-3"
        >
          <MessageSquare className="h-5 w-5 fill-slate-950" /> Renovar Plan por WhatsApp con un Asesor
        </a>

        <button
          type="button"
          onClick={() => setTrialExpiredState({ isExpired: false })}
          className="text-xs text-slate-400 hover:text-white transition underline mt-2"
        >
          Intentar ingresar con otra cuenta
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-white">Iniciar Sesión</h1>
        <p className="text-xs text-slate-400 mt-2">
          Accede a tu cuenta de VisionWeb (Prueba gratis de 15 días)
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Correo Electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="email"
              required
              placeholder="emprendedor@visionweb.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0052FF] hover:bg-[#0043D6] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#0052FF]/20 mt-2"
        >
          {loading ? "Verificando..." : "Ingresar al Dashboard"} <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800/80 text-center flex flex-col gap-2">
        <p className="text-xs text-slate-400">
          ¿No tienes cuenta todavía?{" "}
          <Link
            href={`/register?plan=${selectedPlan}`}
            className="text-[#0052FF] font-bold hover:underline"
          >
            Regístrate y prueba 15 Días Gratis
          </Link>
        </p>
        <p className="text-[11px] text-slate-500">
          ¿Eres Administrador de la Plataforma?{" "}
          <Link href="/admin/login" className="text-[#60A5FA] font-semibold hover:underline">
            Ingreso Super Admin
          </Link>
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 selection:bg-[#0052FF]">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0052FF]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-center mb-6">
          <Link href="/">
            <Logo className="h-14" variant="dark" />
          </Link>
        </div>

        <Suspense fallback={<div className="text-center text-slate-500 text-sm py-10">Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
