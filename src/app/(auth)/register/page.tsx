"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { ArrowRight, Lock, Mail, Store, Phone, User, Sparkles, AlertCircle, Clock, CheckCircle2, MessageSquare, Globe, Upload, Image as ImageIcon, X, Link as LinkIcon } from "lucide-react";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/subscription-payment";

function RegisterForm() {
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "FREE_TRIAL";

  const [form, setForm] = useState({
    fullName: "",
    storeName: "",
    customSlug: "",
    logoUrl: "",
    whatsapp: "",
    email: "",
    password: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleStoreNameChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setForm((prev) => ({
      ...prev,
      storeName: val,
      customSlug: slugEdited ? prev.customSlug : autoSlug,
    }));
  };

  const handleSlugChange = (val: string) => {
    setSlugEdited(true);
    const cleanSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    setForm((prev) => ({ ...prev, customSlug: cleanSlug }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          const result = evt.target.result as string;
          setLogoPreview(result);
          setForm((prev) => ({ ...prev, logoUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setForm((prev) => ({ ...prev, logoUrl: "" }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
    const waText = encodeURIComponent(
      `👋 Hola Administrador, me acabo de registrar en VisionWeb.\n\n` +
      `👤 *Nombre:* ${form.fullName}\n` +
      `🏬 *Tienda:* ${form.storeName}\n` +
      `🔗 *Enlace:* /${form.customSlug || "mi-tienda"}\n` +
      `📧 *Correo:* ${form.email}\n` +
      `📱 *WhatsApp:* ${form.whatsapp}\n\n` +
      `Me gustaría acordar el pago / activación de mi plan de prueba para ingresar a mi cuenta.`
    );
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${waText}`;

    return (
      <div className="text-center py-4">
        <div className="h-16 w-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30 animate-pulse">
          <Clock className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-black text-white mb-2">¡Registro Recibido con Éxito!</h1>
        
        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          Tu cuenta y tu tienda <strong className="text-white">"{form.storeName}"</strong> han quedado registradas en nuestra base de datos con el enlace <span className="text-[#60A5FA] font-mono font-bold">/{form.customSlug || "mi-tienda"}</span>.
          Actualmente se encuentra en <span className="text-amber-400 font-bold">espera de aprobación</span> por el administrador.
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2 mb-6">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> Registrado en Base de Datos PostgreSQL
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-[#0052FF] shrink-0" /> Enlace web reservado: /{form.customSlug || "mi-tienda"}
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-[#0052FF] shrink-0" /> {logoPreview ? "Logo personalizado guardado" : "Sin logo configurado por ahora"}
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#25D366]/20 mb-4"
        >
          <MessageSquare className="h-5 w-5 fill-slate-950" /> Hablar con el Admin por WhatsApp para Activar
        </a>

        <Link
          href="/login"
          className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition text-xs border border-slate-700"
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
          <p className="text-xs font-bold text-[#60A5FA]">Prueba de Plataforma con Configuración a Medida</p>
          <p className="text-[11px] text-slate-400">Regístrate gratis. Configura tu link y empieza a publicar productos.</p>
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-white">Crear Mi Tienda Web</h1>
        <p className="text-xs text-slate-400 mt-1">Completa tus datos para registrar tu negocio en la plataforma.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-3.5">
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
              onChange={(e) => handleStoreNameChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
            />
          </div>
        </div>

        {/* Enlace Personalizado de la Tienda (Slug) */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
            <span>Enlace de Tu Página Web *</span>
            <span className="text-[10px] text-[#60A5FA] font-normal">Personalizable</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-3 h-4 w-4 text-[#0052FF]" />
            <input
              type="text"
              required
              placeholder="mi-tienda"
              value={form.customSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono overflow-x-auto">
            <LinkIcon className="h-3 w-3 text-[#60A5FA] shrink-0" />
            <span>Link: visionweb.app/<strong className="text-white">{form.customSlug || "tu-tienda"}</strong></span>
          </p>
        </div>

        {/* Carga de Imagen de Logo (Opcional - Si no se deja sin logo) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
          <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-[#60A5FA]" /> Logo de Tu Tienda
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">Opcional</span>
          </label>
          
          <p className="text-[11px] text-slate-400 mb-2.5">
            Sube el logo de tu marca. Si no tienes uno por el momento, déjalo en blanco y tu tienda se creará <strong className="text-slate-300">sin logo</strong>.
          </p>

          {logoPreview ? (
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <div className="flex items-center gap-3">
                <img src={logoPreview} alt="Logo Preview" className="h-10 w-10 object-contain rounded-lg bg-slate-950 border border-slate-800 p-1" />
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  Logo cargado correctamente
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition"
                title="Quitar logo y dejar sin logo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 border border-dashed border-slate-700 hover:border-[#0052FF] bg-slate-900/50 hover:bg-slate-900 text-slate-300 px-4 py-3 rounded-xl cursor-pointer transition text-xs font-medium">
              <Upload className="h-4 w-4 text-[#60A5FA]" />
              <span>Subir Imagen de Logo desde mi dispositivo</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          )}
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

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Contraseña *</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
            />
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
