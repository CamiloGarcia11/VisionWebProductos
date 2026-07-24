"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { 
  ShieldCheck, 
  Store, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  AlertCircle, 
  ExternalLink,
  CreditCard,
  LogOut,
  UserPlus,
  X,
  Phone,
  Mail,
  Lock,
  User,
  Clock,
  Settings,
  MessageSquare,
  Zap,
  Globe,
  Sliders,
  Trash2,
  RotateCcw
} from "lucide-react";
import { formatCOP } from "@/lib/utils";

interface MerchantUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  storeId: string;
  storeName: string;
  slug: string;
  logoUrl?: string;
  themeColor?: string;
  secondaryColor?: string;
  whatsappNumber: string;
  enableWhatsapp: boolean;
  enableGateway: boolean;
  modulesEnabled: {
    whatsapp: boolean;
    gateway: boolean;
    metrics: boolean;
    inventory: boolean;
    customDomain: boolean;
  };
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
  totalPaidCOP: number;
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<any>(null);
  const [merchants, setMerchants] = useState<MerchantUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<"ALL" | "PENDING" | "ACTIVE" | "INACTIVE">("ALL");
  const [filterPlan, setFilterPlan] = useState<string>("ALL");

  // Modal para agregar nuevo usuario
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    storeName: "",
    role: "MERCHANT_OWNER",
    plan: "FREE",
    trialDays: "30",
    isActive: true,
  });
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  // Modal para configurar permisos y módulos
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configUser, setConfigUser] = useState<MerchantUser | null>(null);
  const [configForm, setConfigForm] = useState({
    isActive: true,
    plan: "FREE",
    activeDays: 30,
    enableWhatsapp: true,
    enableGateway: false,
    modules: {
      whatsapp: true,
      gateway: false,
      metrics: true,
      inventory: true,
      customDomain: false,
    },
  });
  const [configLoading, setConfigLoading] = useState(false);

  // Modal para confirmar eliminación de cuenta
  const [userToDelete, setUserToDelete] = useState<MerchantUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Cargar usuario autenticado y lista de usuarios desde la BD
  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      setLoading(true);
      const resMe = await fetch("/api/v1/auth/me");
      const dataMe = await resMe.json();

      if (!resMe.ok || !dataMe.authenticated || dataMe.user.role !== "SUPER_ADMIN") {
        router.push("/admin/login");
        return;
      }

      setAuthUser(dataMe.user);
      await fetchMerchants();
    } catch (err) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchants = async () => {
    try {
      const res = await fetch("/api/v1/admin/users");
      const data = await res.json();
      if (res.ok && data.users) {
        setMerchants(data.users);
      }
    } catch (error) {
      console.error("Error al cargar usuarios de BD:", error);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Crear usuario en BD
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalLoading(true);

    try {
      const res = await fetch("/api/v1/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al crear usuario en la BD.");
      }

      setShowAddModal(false);
      setNewUserData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        storeName: "",
        role: "MERCHANT_OWNER",
        plan: "FREE",
        trialDays: "30",
        isActive: true,
      });
      await fetchMerchants();
    } catch (err: any) {
      setModalError(err.message || "Error al registrar usuario.");
    } finally {
      setModalLoading(false);
    }
  };

  // Abrir Modal de Configuración
  const openConfigModal = (user: MerchantUser) => {
    setConfigUser(user);
    setConfigForm({
      isActive: user.isActive,
      plan: user.plan || "FREE",
      activeDays: user.daysLeft > 0 ? user.daysLeft : 30,
      enableWhatsapp: user.enableWhatsapp,
      enableGateway: user.enableGateway,
      modules: {
        whatsapp: user.modulesEnabled?.whatsapp ?? user.enableWhatsapp,
        gateway: user.modulesEnabled?.gateway ?? user.enableGateway,
        metrics: user.modulesEnabled?.metrics ?? true,
        inventory: user.modulesEnabled?.inventory ?? true,
        customDomain: user.modulesEnabled?.customDomain ?? false,
      },
    });
    setShowConfigModal(true);
  };

  // Guardar configuración
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configUser) return;
    setConfigLoading(true);

    try {
      const res = await fetch("/api/v1/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: configUser.id,
          action: "configure_permissions",
          isActive: configForm.isActive,
          plan: configForm.plan,
          activeDays: configForm.activeDays,
          enableWhatsapp: configForm.modules.whatsapp,
          enableGateway: configForm.modules.gateway,
          modules: configForm.modules,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar configuración.");
      }

      setShowConfigModal(false);
      setConfigUser(null);
      await fetchMerchants();
    } catch (err: any) {
      alert(err.message || "Error al actualizar permisos del usuario.");
    } finally {
      setConfigLoading(false);
    }
  };

  // Aprobar inmediatamente por 30 días
  const handleQuickApprove = async (id: string, days: number = 30) => {
    try {
      const res = await fetch("/api/v1/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: id,
          action: "approve_user",
          isActive: true,
          activeDays: days,
        }),
      });
      if (res.ok) await fetchMerchants();
    } catch (error) {
      console.error(error);
    }
  };

  // Eliminar usuario / negocio permanentemente de la BD
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/v1/admin/users?userId=${userToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al eliminar la cuenta.");
      }

      setUserToDelete(null);
      await fetchMerchants();
    } catch (err: any) {
      alert(err.message || "Error al eliminar usuario.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Métricas calculadas
  const [revenueResetOffset, setRevenueResetOffset] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("visionweb_admin_revenue_offset");
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });

  const handleResetRevenue = () => {
    const currentGross = merchants.reduce((acc, m) => acc + (m.isActive ? m.totalPaidCOP : 0), 0);
    setRevenueResetOffset(currentGross);
    if (typeof window !== "undefined") {
      localStorage.setItem("visionweb_admin_revenue_offset", currentGross.toString());
    }
  };

  const pendingUsersCount = merchants.filter((m) => !m.isActive).length;
  const activeUsersCount = merchants.filter((m) => m.isActive && m.daysLeft > 0).length;
  const grossRevenue = merchants.reduce((acc, m) => acc + (m.isActive ? m.totalPaidCOP : 0), 0);
  const totalRevenue = Math.max(0, grossRevenue - revenueResetOffset);

  // Filtrado de negocios
  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      m.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = filterPlan === "ALL" || m.plan === filterPlan;

    let matchesStatusTab = true;
    if (statusTab === "PENDING") matchesStatusTab = !m.isActive;
    if (statusTab === "ACTIVE") matchesStatusTab = m.isActive && m.daysLeft > 0;
    if (statusTab === "INACTIVE") matchesStatusTab = !m.isActive || m.daysLeft === 0;

    return matchesSearch && matchesPlan && matchesStatusTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Logo className="h-10 mx-auto animate-pulse" variant="dark" />
          <p className="text-xs text-slate-400">Cargando Panel Super Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[#0052FF] selection:text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Super Admin */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Logo className="h-10" variant="dark" />
            </Link>
            <div className="h-6 w-px bg-slate-800" />
            <span className="inline-flex items-center gap-1.5 bg-[#0052FF]/20 border border-[#0052FF]/40 text-[#60A5FA] px-3 py-1 rounded-full text-xs font-black uppercase">
              <ShieldCheck className="h-4 w-4" /> PANEL SUPER ADMIN (GESTIÓN & ELIMINACIÓN BD)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#0052FF] hover:bg-[#0043D6] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#0052FF]/20"
            >
              <UserPlus className="h-4 w-4" /> Agregar Usuario Directo
            </button>
            <Link href="/dashboard" className="text-xs font-bold text-slate-400 hover:text-white transition px-2">
              Dashboard Vendedor
            </Link>
            <button
              onClick={handleLogout}
              className="bg-slate-900 border border-slate-800 hover:bg-red-500/10 hover:border-red-500/40 text-red-400 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" /> Salir
            </button>
          </div>
        </header>

        {/* Global SaaS Platform Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Pendientes de Aprobación */}
          <div className={`p-6 rounded-3xl border transition relative overflow-hidden ${
            pendingUsersCount > 0 
              ? "bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]" 
              : "bg-slate-900 border-slate-800"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Pendientes de Aprobación
              </span>
              {pendingUsersCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                  ¡NUEVOS!
                </span>
              )}
            </div>
            <p className="text-3xl font-black text-white">{pendingUsersCount} Registros</p>
            <p className="text-xs text-slate-400 mt-1">Esperando permiso de acceso</p>
          </div>

          {/* Active Paid Subscribers */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Cuentas Activas</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white">{activeUsersCount} Negocios</p>
            <p className="text-xs text-emerald-400 mt-1 font-bold">Con licencias activas</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Recaudación por Arriendos</span>
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-emerald-400">{formatCOP(totalRevenue)}</p>
              <p className="text-xs text-slate-400 mt-1">Planes $15k, $20k, $25k</p>
            </div>
            <button
              onClick={handleResetRevenue}
              type="button"
              className="mt-3 text-[11px] text-slate-400 hover:text-red-400 font-bold border border-slate-800 hover:border-red-500/40 bg-slate-950 p-2 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restablecer Contador
            </button>
          </div>

          {/* Total Registered */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total en Base de Datos</span>
              <Users className="h-5 w-5 text-[#0052FF]" />
            </div>
            <p className="text-3xl font-black text-white">{merchants.length} Registros</p>
            <p className="text-xs text-slate-400 mt-1">Persistencia PostgreSQL</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
          
          {/* Status Tabs Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStatusTab("ALL")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                  statusTab === "ALL" 
                    ? "bg-[#0052FF] text-white shadow-md shadow-[#0052FF]/20" 
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                Todos los Registros ({merchants.length})
              </button>

              <button
                onClick={() => setStatusTab("PENDING")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                  statusTab === "PENDING" 
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20" 
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                Pendientes de Aprobación ({pendingUsersCount})
              </button>

              <button
                onClick={() => setStatusTab("ACTIVE")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                  statusTab === "ACTIVE" 
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Activos ({activeUsersCount})
              </button>

              <button
                onClick={() => setStatusTab("INACTIVE")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                  statusTab === "INACTIVE" 
                    ? "bg-red-500 text-white shadow-md shadow-red-500/20" 
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                Inactivos / Vencidos ({merchants.filter(m => !m.isActive || m.daysLeft === 0).length})
              </button>
            </div>

            {/* Search & Plan Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar tienda, nombre o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                />
              </div>

              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="w-full sm:w-auto bg-slate-950 border border-slate-800 text-xs font-bold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#0052FF]"
              >
                <option value="ALL">Todos los Planes</option>
                <option value="FREE">Prueba Starter (1 Mes Gratis)</option>
                <option value="BASICO">Emprendedor Express ($15.000)</option>
                <option value="PRO">Negocio Pro ($20.000)</option>
                <option value="EMPRESA">Empresa Élite VIP ($25.000)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Tienda & Dueño (BD)</th>
                  <th className="p-4">Estado de Cuenta</th>
                  <th className="p-4">Plan Asignado</th>
                  <th className="p-4">Módulos Activos</th>
                  <th className="p-4">Días Restantes</th>
                  <th className="p-4 text-right">Acciones Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMerchants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                      No hay registros que coincidan con el filtro seleccionado.
                    </td>
                  </tr>
                ) : (
                  filteredMerchants.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-950/50 transition">
                      
                      {/* Tienda y Dueño */}
                      <td className="p-4">
                        <div>
                          <a 
                            href={`/${m.slug || ""}`} 
                            target="_blank" 
                            className="font-bold text-white text-sm hover:text-[#60A5FA] inline-flex items-center gap-1.5"
                          >
                            {m.storeName} <ExternalLink className="h-3 w-3 text-slate-500" />
                          </a>
                          <p className="text-slate-400 mt-0.5">{m.fullName} • {m.email}</p>
                          <a 
                            href={`https://wa.me/${m.phoneNumber.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#25D366] font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
                          >
                            <Phone className="h-3 w-3" /> WhatsApp: {m.phoneNumber}
                          </a>
                        </div>
                      </td>

                      {/* Estado de Cuenta */}
                      <td className="p-4">
                        {!m.isActive ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-[11px] animate-pulse">
                            <Clock className="h-3.5 w-3.5" /> Pendiente Aprobación
                          </span>
                        ) : m.daysLeft > 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Activo & Aprobado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-400 font-bold bg-red-500/10 px-2.5 py-1 rounded-full text-[11px]">
                            <AlertCircle className="h-3.5 w-3.5" /> Vencido / Inactivo
                          </span>
                        )}
                      </td>

                      {/* Plan Asignado */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-extrabold px-2.5 py-1 rounded-full text-[10px] ${
                          m.plan === "FREE"
                            ? "bg-blue-500/20 text-[#60A5FA]"
                            : m.plan === "BASICO"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : m.plan === "PRO"
                            ? "bg-[#0052FF]/30 text-white"
                            : "bg-purple-500/20 text-purple-400"
                        }`}>
                          {m.plan === "FREE" ? "Prueba Starter (1 Mes)" : m.plan === "BASICO" ? "Express ($15k)" : m.plan === "PRO" ? "Pro ($20k)" : "Élite VIP ($25k)"}
                        </span>
                      </td>

                      {/* Módulos Habilitados */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(m.modulesEnabled?.whatsapp ?? m.enableWhatsapp) && (
                            <span className="bg-[#25D366]/20 text-[#25D366] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" /> WhatsApp
                            </span>
                          )}
                          {(m.modulesEnabled?.gateway ?? m.enableGateway) && (
                            <span className="bg-[#0052FF]/20 text-[#60A5FA] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                              <CreditCard className="h-3 w-3" /> Pasarela
                            </span>
                          )}
                          {m.modulesEnabled?.metrics && (
                            <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded">
                              Métricas
                            </span>
                          )}
                          {m.modulesEnabled?.inventory && (
                            <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">
                              Inventario
                            </span>
                          )}
                          {m.modulesEnabled?.customDomain && (
                            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                              <Globe className="h-3 w-3" /> Dominio
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Tiempo / Días Restantes */}
                      <td className="p-4">
                        <div>
                          <span className={`font-black text-sm ${m.daysLeft <= 5 || !m.isActive ? "text-amber-400" : "text-white"}`}>
                            {m.isActive ? `${m.daysLeft} días` : "0 días (Inactivo)"}
                          </span>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Vence: {m.endDate}</p>
                        </div>
                      </td>

                      {/* Acciones Admin */}
                      <td className="p-4 text-right space-x-2">
                        {!m.isActive && (
                          <button
                            onClick={() => handleQuickApprove(m.id, 30)}
                            title="Aprobar inmediatamente por 30 Días"
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 inline-flex items-center gap-1"
                          >
                            <Zap className="h-3.5 w-3.5 fill-slate-950" /> Aprobar (30 Días)
                          </button>
                        )}

                        <button
                          onClick={() => openConfigModal(m)}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition border border-slate-700 inline-flex items-center gap-1.5"
                        >
                          <Sliders className="h-3.5 w-3.5 text-[#60A5FA]" /> Permisos
                        </button>

                        <button
                          onClick={() => setUserToDelete(m)}
                          title="Eliminar cuenta permanentemente de la BD"
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold p-2 rounded-xl text-xs transition inline-flex items-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Configurar Permisos, Tiempo y Módulos */}
        {showConfigModal && configUser && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div>
                  <span className="text-[10px] font-bold text-[#60A5FA] uppercase tracking-wider">CONFIGURACIÓN DE CUENTA & LICENCIA</span>
                  <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                    <Sliders className="h-5 w-5 text-[#0052FF]" /> Permisos de "{configUser.storeName}"
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-5">
                
                {/* 1. Estado de Aprobación */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-2">1. Estado de Acceso a la Plataforma</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setConfigForm({ ...configForm, isActive: true })}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        configForm.isActive 
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:text-white"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" /> APROBADA / ACTIVA
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfigForm({ ...configForm, isActive: false })}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        !configForm.isActive 
                          ? "bg-amber-500/20 border-amber-500 text-amber-400" 
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:text-white"
                      }`}
                    >
                      <Clock className="h-4 w-4" /> PENDIENTE / INACTIVA
                    </button>
                  </div>
                </div>

                {/* 2. Seleccionar Plan (4 opciones con auto-activación de módulos) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">2. Asignar Plan de Arriendo (Auto-activa Módulos)</label>
                  <select
                    value={configForm.plan}
                    onChange={(e) => {
                      const selPlan = e.target.value;
                      let autoMods = {
                        whatsapp: true,
                        gateway: false,
                        metrics: false,
                        inventory: true,
                        customDomain: false,
                      };

                      const p = selPlan.toUpperCase();
                      if (p === "EMPRESA" || p === "VIP") {
                        autoMods = { whatsapp: true, gateway: true, metrics: true, inventory: true, customDomain: true };
                      } else if (p === "PRO" || p === "BASICO" || p === "EMPRENDEDOR") {
                        autoMods = { whatsapp: true, gateway: false, metrics: true, inventory: true, customDomain: false };
                      }

                      setConfigForm({
                        ...configForm,
                        plan: selPlan,
                        modules: autoMods,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 text-xs font-bold text-white rounded-xl p-3 focus:outline-none focus:border-[#0052FF]"
                  >
                    <option value="FREE_TRIAL">1. Plan Prueba Gratis (15 Días - $0 COP)</option>
                    <option value="BASICO">2. Plan Emprendedor Express ($15.000 COP/mes)</option>
                    <option value="PRO">3. Plan Negocio Pro ($20.000 COP/mes)</option>
                    <option value="EMPRESA">4. Plan Empresa Élite VIP ($25.000 COP/mes)</option>
                  </select>
                </div>

                {/* 3. Tiempo / Días de Prueba o Arriendo */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">3. Tiempo de Actividad Asignado (Días)</label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[7, 15, 30, 60].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setConfigForm({ ...configForm, activeDays: d })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          configForm.activeDays === d 
                            ? "bg-[#0052FF] border-[#0052FF] text-white" 
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {d} Días
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={3650}
                    value={configForm.activeDays}
                    onChange={(e) => setConfigForm({ ...configForm, activeDays: parseInt(e.target.value, 10) || 30 })}
                    className="w-full bg-slate-950 border border-slate-800 text-xs font-mono text-white rounded-xl p-3 focus:outline-none focus:border-[#0052FF]"
                    placeholder="Número de días personalizado..."
                  />
                </div>

                {/* 4. Módulos Permitidos */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-3">4. Módulos Permitidos para el Cliente</label>
                  
                  <div className="space-y-3 text-xs">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.modules.whatsapp}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          modules: { ...configForm.modules, whatsapp: e.target.checked }
                        })}
                        className="h-4 w-4 rounded accent-[#0052FF]"
                      />
                      <div>
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" /> Módulo Pedidos por WhatsApp
                        </span>
                        <p className="text-[11px] text-slate-500">Envío de pedidos directamente al número de WhatsApp del vendedor</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.modules.gateway}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          modules: { ...configForm.modules, gateway: e.target.checked }
                        })}
                        className="h-4 w-4 rounded accent-[#0052FF]"
                      />
                      <div>
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5 text-[#60A5FA]" /> Módulo Pasarela Directa (Wompi / Mercado Pago)
                        </span>
                        <p className="text-[11px] text-slate-500">Permite configurar llaves de cobro en línea en planes $25k</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.modules.metrics}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          modules: { ...configForm.modules, metrics: e.target.checked }
                        })}
                        className="h-4 w-4 rounded accent-[#0052FF]"
                      />
                      <div>
                        <span className="font-bold text-white">Módulo Reportes de Ventas & Métricas</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.modules.inventory}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          modules: { ...configForm.modules, inventory: e.target.checked }
                        })}
                        className="h-4 w-4 rounded accent-[#0052FF]"
                      />
                      <div>
                        <span className="font-bold text-white">Módulo Gestor de Productos y Especificaciones</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configForm.modules.customDomain}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          modules: { ...configForm.modules, customDomain: e.target.checked }
                        })}
                        className="h-4 w-4 rounded accent-[#0052FF]"
                      />
                      <div>
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-amber-400" /> Módulo Dominio Personalizado (.com / .co)
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={configLoading}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20"
                  >
                    {configLoading ? "Guardando..." : "Guardar Permisos y Activar Cuenta"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Eliminar Cuenta Permanentemente */}
        {userToDelete && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-red-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-center">
              <div className="h-14 w-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <Trash2 className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-black text-white mb-2">¿Eliminar Negocio Permanentemente?</h3>
              
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Estás a punto de borrar la cuenta de <strong className="text-white">{userToDelete.fullName}</strong> y su tienda <strong className="text-white">"{userToDelete.storeName}"</strong>.
                Esta acción eliminará todos los registros y productos de la base de datos PostgreSQL.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={deleteLoading}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl transition shadow-lg shadow-red-600/20"
                >
                  {deleteLoading ? "Eliminando..." : "Sí, Eliminar de la BD"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Agregar Usuario */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#0052FF]" /> Registrar Nuevo Usuario en BD
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {modalError && (
                <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Andrés Ramírez"
                    value={newUserData.fullName}
                    onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="usuario@visionweb.com"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Contraseña *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp (57...) *</label>
                    <input
                      type="text"
                      required
                      placeholder="573001234567"
                      value={newUserData.phoneNumber}
                      onChange={(e) => setNewUserData({ ...newUserData, phoneNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Nombre de Tienda</label>
                    <input
                      type="text"
                      placeholder="Ej. Boutique Moda"
                      value={newUserData.storeName}
                      onChange={(e) => setNewUserData({ ...newUserData, storeName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Días de Prueba Inicíal</label>
                    <input
                      type="number"
                      value={newUserData.trialDays}
                      onChange={(e) => setNewUserData({ ...newUserData, trialDays: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Plan Inicial</label>
                    <select
                      value={newUserData.plan}
                      onChange={(e) => setNewUserData({ ...newUserData, plan: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                    >
                      <option value="FREE">Prueba Starter (1 Mes Gratis)</option>
                      <option value="BASICO">Emprendedor Express ($15.000)</option>
                      <option value="PRO">Negocio Pro ($20.000)</option>
                      <option value="EMPRESA">Empresa Élite VIP ($25.000)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="bg-[#0052FF] hover:bg-[#0043D6] text-white text-xs font-extrabold px-5 py-2 rounded-xl transition shadow-lg shadow-[#0052FF]/20"
                  >
                    {modalLoading ? "Guardando en BD..." : "Guardar en Base de Datos"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
