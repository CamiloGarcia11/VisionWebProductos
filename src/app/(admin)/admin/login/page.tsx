"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
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

      if (data.user.role !== "SUPER_ADMIN") {
        throw new Error("Acceso denegado: Esta cuenta no posee permisos de Super Admin.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al ingresar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 selection:bg-[#0052FF]">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0052FF]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <Link href="/" className="mb-4">
            <Logo className="h-12" variant="dark" />
          </Link>
          <span className="inline-flex items-center gap-1.5 bg-[#0052FF]/20 border border-[#0052FF]/40 text-[#60A5FA] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" /> Acceso Super Admin
          </span>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Correo de Administrador</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="Correo electrónico..."
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
            {loading ? "Verificando en Base de Datos..." : "Ingresar al Panel Admin"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
