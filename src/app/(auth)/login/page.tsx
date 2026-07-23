"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "FREE_TRIAL";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
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

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-white">Iniciar Sesión</h1>
        <p className="text-xs text-slate-400 mt-2">
          {selectedPlan === "FREE" || selectedPlan === "FREE_TRIAL"
            ? "Accede a tu cuenta para activar tu Plan Gratis (2 Meses)"
            : `Accede a tu cuenta para contratar el Plan ${selectedPlan}`}
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
            Regístrate y activa 2 Meses Gratis
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
