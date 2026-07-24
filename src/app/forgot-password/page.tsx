"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al solicitar la recuperación.");
      }

      setSuccessMessage(data.message || "Instrucciones enviadas con éxito a tu correo electrónico.");
    } catch (err: any) {
      setErrorMessage(err.message || "Error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-[#0052FF] selection:text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0052FF]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Logo className="h-10 mx-auto" variant="dark" />
          </Link>
          <h1 className="text-2xl font-black text-white flex items-center justify-center gap-2">
            <KeyRound className="h-6 w-6 text-[#60A5FA]" /> Recuperar Contraseña
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Ingresa tu correo electrónico registrado y te enviaremos el acceso seguro para ingresar a tu cuenta.
          </p>
        </div>

        {successMessage ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-white">¡Solicitud Enviada!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{successMessage}</p>
            <Link
              href="/login"
              className="w-full bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold py-3 px-4 rounded-xl text-xs inline-block transition shadow-lg mt-2"
            >
              Volver al Iniciar Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-[#60A5FA]" /> Correo Electrónico Registrado *
              </label>
              <input
                type="email"
                required
                placeholder="tu-correo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0052FF] hover:bg-[#0043D6] disabled:bg-slate-800 text-white font-black py-3.5 px-4 rounded-xl transition text-xs shadow-lg shadow-[#0052FF]/20 flex items-center justify-center gap-2"
            >
              {loading ? "Enviando Solicitud..." : "Recuperar Contraseña por Correo"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" /> Volver a Iniciar Sesión
          </Link>
        </div>

      </div>
    </div>
  );
}
