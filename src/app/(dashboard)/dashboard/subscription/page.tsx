"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowLeft,
  MessageSquare,
  Palette,
  Type,
  Zap,
  Check,
  ShieldCheck
} from "lucide-react";
import { useStoreConfig } from "@/hooks/use-store-config";
import { generateWhatsAppSaaSLink } from "@/lib/subscription-payment";

export default function SubscriptionBillingPage() {
  const { storeConfig } = useStoreConfig();

  // Mapear nombre normalizado del plan activo
  const activePlanKey = 
    storeConfig.plan?.toUpperCase().includes("EMPRESA") || storeConfig.plan?.toUpperCase().includes("VIP")
      ? "EMPRESA"
      : storeConfig.plan?.toUpperCase().includes("PRO") || storeConfig.plan?.toUpperCase().includes("NEGOCIO")
      ? "PRO"
      : "BASICO";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-10 selection:bg-[#0052FF] selection:text-white">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">Suscripción y Arriendo de Plataforma</h1>
            <p className="text-xs text-slate-400 mt-1">Elige o renueva tu plan directo por WhatsApp con el administrador oficial</p>
          </div>
        </div>

        {/* Current Active Plan Status Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 mb-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Plan Activo en Tu Cuenta
              </span>
              <h2 className="text-2xl font-black text-white">{storeConfig.plan || "PLAN NEGOCIO PRO"}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Tu tienda cuenta con acceso total a la plataforma, WhatsApp y soporte continuo.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-black text-white">{storeConfig.daysRemaining || 30} Días</p>
                <p className="text-[11px] text-slate-400">Restantes de Licencia Activa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Upgrade Grid */}
        <h2 className="text-xl font-black text-white mb-6">Planes de Arriendo Disponible</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* PLAN 1: BÁSICO ($15.000 COP/mes) */}
          <div className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
            activePlanKey === "BASICO"
              ? "bg-slate-900/90 border-emerald-500 shadow-2xl ring-2 ring-emerald-500/30"
              : "bg-slate-900 border-slate-800"
          }`}>
            <div>
              {activePlanKey === "BASICO" && (
                <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-3">
                  ✅ PLAN ADQUIRIDO (EN USO)
                </span>
              )}

              <h3 className="text-lg font-bold text-white">Plan Básico</h3>
              <p className="text-xs text-slate-400 mt-1">Para ventas activas por WhatsApp</p>
              
              <div className="my-5">
                <span className="text-3xl font-black text-white">$15.000</span>
                <span className="text-slate-400 text-xs"> COP / mes</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 font-medium mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Tienda Web Oficial (enlace /slug)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Pedidos Directos por WhatsApp</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Gestor de Productos e Inventario</li>
              </ul>
            </div>

            {activePlanKey === "BASICO" ? (
              <button
                disabled
                className="w-full bg-emerald-500/20 text-emerald-400 font-black py-3 px-4 rounded-xl text-xs border border-emerald-500/40 cursor-default flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" /> PLAN ACTUALMENTE ADQUIRIDO
              </button>
            ) : (
              <a
                href={generateWhatsAppSaaSLink("BASICO")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-1.5 text-xs border border-slate-700"
              >
                <MessageSquare className="h-4 w-4" /> Adquirir o Cambiar Plan ($15.000)
              </a>
            )}
          </div>

          {/* PLAN 2: NEGOCIO PRO ($20.000 COP/mes) */}
          <div className={`rounded-3xl border-2 p-6 flex flex-col justify-between relative shadow-xl ${
            activePlanKey === "PRO"
              ? "bg-slate-900/90 border-emerald-500 ring-2 ring-emerald-500/30"
              : "bg-slate-900 border-[#0052FF]"
          }`}>
            {activePlanKey !== "PRO" && (
              <div className="absolute -top-3.5 right-4 bg-[#0052FF] text-white px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
                MÁS POPULAR
              </div>
            )}

            <div>
              {activePlanKey === "PRO" && (
                <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-3">
                  ✅ PLAN ADQUIRIDO (EN USO)
                </span>
              )}

              <h3 className="text-lg font-bold text-white">Negocio Pro</h3>
              <p className="text-xs text-slate-400 mt-1">Logo + Colores + Tipografías Web</p>
              
              <div className="my-5">
                <span className="text-3xl font-black text-white">$20.000</span>
                <span className="text-slate-400 text-xs"> COP / mes</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 font-medium mb-6">
                <li className="flex items-center gap-2"><Palette className="h-4 w-4 text-[#60A5FA] shrink-0" /> Logo (Local/Link) + Colores Globales</li>
                <li className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                  <Type className="h-4 w-4 text-emerald-400 shrink-0" /> Cambiador de Tipografías Web (6 Fuentes)
                </li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0052FF] shrink-0" /> Métricas & Gestión de Stock</li>
              </ul>
            </div>

            {activePlanKey === "PRO" ? (
              <button
                disabled
                className="w-full bg-emerald-500/20 text-emerald-400 font-black py-3 px-4 rounded-xl text-xs border border-emerald-500/40 cursor-default flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" /> PLAN ACTUALMENTE ADQUIRIDO
              </button>
            ) : (
              <a
                href={generateWhatsAppSaaSLink("PRO")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0052FF] hover:bg-[#0043D6] text-white font-black py-3 px-4 rounded-xl transition flex items-center justify-center gap-1.5 text-xs shadow-lg"
              >
                <MessageSquare className="h-4 w-4" /> Adquirir / Renovar ($20.000)
              </a>
            )}
          </div>

          {/* PLAN 3: EMPRESA VIP ($25.000 COP/mes - Módulo Publicidad HD + Tipografías) */}
          <div className={`rounded-3xl border-2 p-6 flex flex-col justify-between relative shadow-xl ${
            activePlanKey === "EMPRESA"
              ? "bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-900 border-emerald-500 ring-2 ring-emerald-500/30"
              : "bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-900 border-purple-500/50"
          }`}>
            {activePlanKey !== "EMPRESA" && (
              <div className="absolute -top-3.5 right-4 bg-purple-600 text-white px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                MÁS COMPLETO
              </div>
            )}

            <div>
              {activePlanKey === "EMPRESA" && (
                <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-3">
                  ✅ PLAN ADQUIRIDO (EN USO)
                </span>
              )}

              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                Empresa VIP <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">Módulo Publicidad HD + Tipografías Web</p>
              
              <div className="my-5">
                <span className="text-3xl font-black text-white">$25.000</span>
                <span className="text-slate-400 text-xs"> COP / mes</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 font-medium mb-6">
                <li className="flex items-center gap-2 text-purple-300 font-bold bg-purple-500/10 p-2 rounded-xl border border-purple-500/20">
                  <Sparkles className="h-4 w-4 text-amber-400 shrink-0" /> Módulo de Publicidad & Banners HD Gratis
                </li>
                <li className="flex items-center gap-2"><Type className="h-4 w-4 text-purple-400 shrink-0" /> Cambiador de Tipografías Web Premium</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-purple-400 shrink-0" /> Soporte Prioritario VIP</li>
              </ul>
            </div>

            {activePlanKey === "EMPRESA" ? (
              <button
                disabled
                className="w-full bg-emerald-500/20 text-emerald-400 font-black py-3 px-4 rounded-xl text-xs border border-emerald-500/40 cursor-default flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" /> PLAN ACTUALMENTE ADQUIRIDO
              </button>
            ) : (
              <a
                href={generateWhatsAppSaaSLink("EMPRESA")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-3 px-4 rounded-xl transition flex items-center justify-center gap-1.5 text-xs shadow-lg shadow-purple-600/30"
              >
                <MessageSquare className="h-4 w-4" /> Adquirir VIP ($25.000)
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
