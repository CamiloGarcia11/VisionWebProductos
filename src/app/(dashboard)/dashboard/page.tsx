"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { AdBannerModule } from "@/components/dashboard/ad-banner-module";
import { ImageAdjusterModal } from "@/components/dashboard/image-adjuster-modal";
import { useStoreConfig, StoreConfig, ProductItem, OrderItem } from "@/hooks/use-store-config";
import { 
  Store, 
  ShoppingBag, 
  DollarSign, 
  PlusCircle, 
  Settings, 
  MessageSquare, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  ExternalLink,
  PackageCheck,
  Sparkles,
  LogOut,
  User,
  Search,
  Filter,
  CheckCircle2,
  Truck,
  AlertCircle,
  ChevronRight,
  Eye,
  Palette,
  Image as ImageIcon,
  Sliders,
  Check,
  Tag,
  Upload,
  Link as LinkIcon,
  Zap,
  Megaphone,
  ShieldCheck,
  X,
  Maximize2,
  Crop,
  HelpCircle,
  Type,
  Edit,
  Trash2,
  Box,
  Move,
  Percent,
  RefreshCw,
  MapPin
} from "lucide-react";
import { formatCOP } from "@/lib/utils";

export default function MerchantDashboard() {
  const router = useRouter();

  // Integración del Hook Global con Persistencia (localStorage)
  const { 
    storeConfig: globalStoreConfig, 
    products: globalProducts, 
    orders: globalOrders,
    setStoreConfig: saveStoreConfig, 
    addProduct, 
    updateProduct,
    deleteProduct,
    toggleProductActive,
    applyGlobalDiscount,
    updateOrderStatus
  } = useStoreConfig();

  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal de Confirmación de Guardado de Cambios de Marca
  const [isSaveConfirmModalOpen, setIsSaveConfirmModalOpen] = useState(false);

  // Modal de Ajuste/Posicionamiento Interactivo de Foto
  const [isAdjusterModalOpen, setIsAdjusterModalOpen] = useState(false);

  // Modal de Descuento Masivo Global (% a todo el catálogo)
  const [isGlobalDiscountModalOpen, setIsGlobalDiscountModalOpen] = useState(false);
  const [globalDiscountPercentInput, setGlobalDiscountPercentInput] = useState<string>("15");

  // Filtro de Pedidos
  const [orderStatusFilter, setOrderStatusFilter] = useState<"ALL" | "PENDING" | "PAID" | "REJECTED">("ALL");

  // Navegación de pestañas internas del Dashboard
  const [activeTab, setActiveTab] = useState<"metrics" | "products" | "branding" | "orders" | "subscription" | "advertising">("metrics");

  // Estado local para los formularios del usuario
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(globalStoreConfig);

  // Sincronizar tras montaje en cliente con los datos reales de PostgreSQL
  useEffect(() => {
    setMounted(true);
    setStoreConfig(globalStoreConfig);

    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.stores?.[0]) {
          const s = data.user.stores[0];
          const activeStoreConfig: StoreConfig = {
            ...globalStoreConfig,
            name: data.user.fullName || globalStoreConfig.name,
            email: data.user.email || globalStoreConfig.email,
            storeName: s.storeName || globalStoreConfig.storeName,
            slug: s.slug || globalStoreConfig.slug,
            logoUrl: s.logoUrl !== undefined && s.logoUrl !== null ? s.logoUrl : globalStoreConfig.logoUrl,
            whatsapp: data.user.phoneNumber || s.whatsappNumber || globalStoreConfig.whatsapp,
          };
          setStoreConfig(activeStoreConfig);
          saveStoreConfig(activeStoreConfig);
        }
      })
      .catch(() => {});
  }, []);

  const planUpper = (storeConfig.plan || "FREE_TRIAL").toUpperCase();
  const isVipPlan = planUpper.includes("EMPRESA") || planUpper.includes("VIP");
  const isProPlan = isVipPlan || planUpper.includes("PRO") || planUpper.includes("NEGOCIO");
  const isEmprendedorPlan = isProPlan || planUpper.includes("BASICO") || planUpper.includes("EMPRENDEDOR");
  const isPlusPlan = isProPlan;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Buscador de productos
  const [searchQuery, setSearchQuery] = useState("");

  // Formulario Crear / Editar Producto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [productForm, setProductForm] = useState({
    title: "",
    originalPrice: "", 
    discountPercent: "", 
    finalPrice: "",
    stock: "10", // Inventario / Stock
    category: "Ropa",
    specifications: "Material: 100% Algodón nacional | Tallas: S, M, L | Garantía: 30 Días",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop",
    imageFit: "cover" as "cover" | "contain",
    positionX: 50,
    positionY: 50,
    zoom: 100
  });

  // Recalcular automáticamente precio final cuando cambia el precio original o el % de descuento
  const handleDiscountPercentChange = (percentStr: string, origPriceStr: string) => {
    const percent = parseFloat(percentStr) || 0;
    const orig = parseFloat(origPriceStr) || 0;

    if (percent > 0 && orig > 0) {
      const calculatedFinal = Math.round(orig * (1 - percent / 100));
      setProductForm(prev => ({
        ...prev,
        discountPercent: percentStr,
        originalPrice: origPriceStr,
        finalPrice: calculatedFinal.toString()
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        discountPercent: percentStr,
        originalPrice: origPriceStr,
        finalPrice: origPriceStr
      }));
    }
  };

  // Abrir Modal para Crear Producto Nuevo
  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setProductForm({
      title: "",
      originalPrice: "",
      discountPercent: "",
      finalPrice: "",
      stock: "10",
      category: "Ropa",
      specifications: "Material: 100% Algodón nacional | Tallas: S, M, L | Garantía: 30 Días",
      imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop",
      imageFit: "cover",
      positionX: 50,
      positionY: 50,
      zoom: 100
    });
    setIsModalOpen(true);
  };

  // Abrir Modal para EDITAR Producto Existente
  const handleOpenEditModal = (product: ProductItem) => {
    setEditingProductId(product.id);
    const origPrice = product.comparePrice && product.comparePrice > product.price ? product.comparePrice : product.price;
    const hasDiscount = product.comparePrice && product.comparePrice > product.price;
    const calcPercent = hasDiscount ? Math.round(((origPrice - product.price) / origPrice) * 100) : 0;

    setProductForm({
      title: product.title,
      originalPrice: origPrice.toString(),
      discountPercent: calcPercent > 0 ? calcPercent.toString() : "",
      finalPrice: product.price.toString(),
      stock: product.stock.toString(),
      category: "General",
      specifications: product.specifications || "",
      imageUrl: product.imageUrl,
      imageFit: product.imageFit || "cover",
      positionX: product.objectPositionX ?? 50,
      positionY: product.objectPositionY ?? 50,
      zoom: product.imageZoom ?? 100
    });
    setIsModalOpen(true);
  };

  // Guardar (Crear o Editar) Producto
  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.finalPrice) return;

    const finalP = parseFloat(productForm.finalPrice);
    const origP = productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined;
    const compP = origP && origP > finalP ? origP : undefined;
    const stk = parseInt(productForm.stock) || 0;

    if (editingProductId) {
      // MODO EDICIÓN
      const updatedItem: ProductItem = {
        id: editingProductId,
        title: productForm.title,
        price: finalP,
        comparePrice: compP,
        specifications: productForm.specifications || "Especificaciones no detalladas",
        stock: stk,
        isActive: true,
        imageUrl: productForm.imageUrl || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop",
        imageFit: productForm.imageFit,
        objectPositionX: productForm.positionX,
        objectPositionY: productForm.positionY,
        imageZoom: productForm.zoom
      };

      updateProduct(updatedItem);
      triggerToast(`✏️ ¡Producto "${productForm.title}" actualizado! Stock: ${stk} un.`);
    } else {
      // MODO CREACIÓN
      const createdItem: ProductItem = {
        id: Date.now().toString(),
        title: productForm.title,
        price: finalP,
        comparePrice: compP,
        specifications: productForm.specifications || "Especificaciones no detalladas",
        stock: stk,
        isActive: true,
        imageUrl: productForm.imageUrl || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop",
        imageFit: productForm.imageFit,
        objectPositionX: productForm.positionX,
        objectPositionY: productForm.positionY,
        imageZoom: productForm.zoom
      };

      addProduct(createdItem);
      triggerToast(`✨ ¡Producto "${productForm.title}" publicado con ${stk} un. en stock!`);
    }

    setIsModalOpen(false);
  };

  // Eliminar Producto
  const handleDeleteProduct = (id: string, title: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${title}"?`)) {
      deleteProduct(id);
      triggerToast(`🗑️ Producto "${title}" eliminado.`);
    }
  };

  // Aplicar Descuento Masivo Global
  const handleApplyGlobalDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const percent = parseFloat(globalDiscountPercentInput) || 0;
    applyGlobalDiscount(percent);
    setIsGlobalDiscountModalOpen(false);
    triggerToast(percent > 0 
      ? `🎉 ¡Se aplicó un ${percent}% de descuento a TODO el catálogo!` 
      : `🔄 Se restablecieron los precios sin descuento.`
    );
  };

  // Cambiar Estado de Pedido (PENDIENTE -> PAGO -> RECHAZADO)
  const handleChangeOrderStatus = (orderId: string, newStatus: "PENDING" | "PAID" | "REJECTED", orderCode: string) => {
    updateOrderStatus(orderId, newStatus);
    if (newStatus === "PAID") {
      triggerToast(`✅ ¡Pedido ${orderCode} marcado como PAGO! Se descontó el stock automáticamente.`);
    } else if (newStatus === "REJECTED") {
      triggerToast(`❌ Pedido ${orderCode} marcado como RECHAZADO.`);
    } else {
      triggerToast(`⏳ Pedido ${orderCode} marcado como PENDIENTE.`);
    }
  };

  // Confirmar Marca
  const handleOpenSaveConfirmModal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaveConfirmModalOpen(true);
  };

  const handleConfirmSaveBranding = () => {
    saveStoreConfig(storeConfig);
    setIsSaveConfirmModalOpen(false);
    triggerToast("✅ ¡Cambios guardados y aplicados exitosamente a tu tienda web!");
  };

  // Carga de Logo Local
  const handleLocalLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStoreConfig({
            ...storeConfig,
            logoUrl: event.target.result as string,
            logoType: "file"
          });
          triggerToast("🖼️ ¡Imagen de logo cargada! Recuerda hacer clic en Guardar Cambios.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Carga Local de Foto de Producto
  const handleProductLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProductForm({
            ...productForm,
            imageUrl: event.target.result as string
          });
          triggerToast("🖼️ Foto cargada con éxito. Puedes abrir el ajustador para moverla.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      router.push("/login");
    }
  };

  const handleToggleProductStatus = (id: string, currentTitle: string, isNowActive: boolean) => {
    toggleProductActive(id);
    triggerToast(isNowActive ? `👁️ Producto "${currentTitle}" ahora es VISIBLE.` : `🙈 Producto "${currentTitle}" ahora está OCULTO.`);
  };

  const currentProducts = mounted ? globalProducts : [];
  const filteredProducts = currentProducts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const currentOrders = mounted ? globalOrders : [];
  const filteredOrders = currentOrders.filter(o => {
    if (orderStatusFilter === "ALL") return true;
    return o.status === orderStatusFilter;
  });

  const THEME_PRESETS = [
    { name: "💎 Esmeralda Lujo", primary: "#10b981", secondary: "#f59e0b", background: "#022c22", card: "#064e3b" },
    { name: "⚡ Cyberpunk Neon", primary: "#ec4899", secondary: "#06b6d4", background: "#09090b", card: "#18181b" },
    { name: "👑 Oro & Noche", primary: "#eab308", secondary: "#25d366", background: "#0c0a09", card: "#1c1917" },
    { name: "🍇 Púrpura Imperial", primary: "#8b5cf6", secondary: "#f43f5e", background: "#1e1b4b", card: "#2e1065" },
    { name: "🌌 Azul Cósmico", primary: "#0052FF", secondary: "#25D366", background: "#07090e", card: "#0f172a" },
    { name: "🔥 Fuego Rojo & Ámbar", primary: "#ef4444", secondary: "#f59e0b", background: "#180808", card: "#2d1212" },
    { name: "🍦 Minimal Blanco Deluxe", primary: "#0f172a", secondary: "#25d366", background: "#f8fafc", card: "#ffffff" },
    { name: "🖤 OLED Total Black", primary: "#38bdf8", secondary: "#a855f7", background: "#000000", card: "#121212" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-[#0052FF] selection:text-white relative">
      
      {/* Toast Flotante */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800/80 p-5 md:p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Logo className="h-10" variant="dark" />
            </Link>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#0052FF]/20 text-[#60A5FA] rounded border border-[#0052FF]/30">
              VENDEDOR
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl mb-6 flex items-center gap-3 shadow-inner">
            {storeConfig.logoUrl ? (
              <img src={storeConfig.logoUrl} alt="Logo" className="h-10 w-10 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-[#0052FF] text-white flex items-center justify-center font-black shrink-0">
                {(storeConfig.storeName || "TV").substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <h3 className="font-bold text-white text-xs truncate">{storeConfig.storeName || "Mi Tienda"}</h3>
              <p className="text-[11px] text-slate-400 font-mono truncate">/{storeConfig.slug || "mi-tienda"}</p>
            </div>
          </div>

          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1.5 text-xs font-bold whitespace-nowrap md:whitespace-normal scrollbar-none">
            <button
              onClick={() => setActiveTab("metrics")}
              className={`shrink-0 md:w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl transition ${
                activeTab === "metrics" ? "bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 shrink-0" />
                <span>Métricas & Resumen</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("branding")}
              className={`shrink-0 md:w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl transition ${
                activeTab === "branding" ? "bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Palette className="h-4 w-4 text-[#25D366] shrink-0" />
                <span>Logo & Colores Globales</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("advertising")}
              className={`shrink-0 md:w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl transition ${
                activeTab === "advertising" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Megaphone className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Publicidad & Banners HD</span>
              </div>
              <span className="bg-purple-500/20 text-purple-300 text-[9px] px-1.5 py-0.5 rounded font-black shrink-0">VIP</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`shrink-0 md:w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl transition ${
                activeTab === "products" ? "bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 shrink-0" />
                <span>Productos ({currentProducts.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`shrink-0 md:w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl transition ${
                activeTab === "orders" ? "bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <PackageCheck className="h-4 w-4 text-[#25D366] shrink-0" />
                <span>Pedidos Registrados</span>
              </div>
              {currentOrders.filter(o => o.status === "PENDING").length > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black shrink-0">
                  {currentOrders.filter(o => o.status === "PENDING").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("subscription")}
              className={`shrink-0 md:w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl transition ${
                activeTab === "subscription" ? "bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#60A5FA] shrink-0" />
                <span>Mi Plan & Licencia</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Panel Comerciante</span>
            <h1 className="text-2xl md:text-3xl font-black text-white">{storeConfig.storeName}</h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/${storeConfig.slug}`}
              target="_blank"
              className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
            >
              <Eye className="h-4 w-4 text-[#60A5FA]" /> Ver Mi Tienda Pública <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* TAB 5: GESTOR COMPLETO DE PEDIDOS RECIBIDOS POR WHATSAPP & DESCUENTO AUTOMÁTICO DE STOCK */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <PackageCheck className="h-6 w-6 text-[#25D366]" /> Registro & Control de Pedidos Recibidos
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Los clientes que confirman su pedido en la tienda web se registran aquí automáticamente. Marcar como PAGO descuenta el stock de tu catálogo.</p>
                </div>

                {/* Filtro por Estado */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold shrink-0">
                  <button
                    onClick={() => setOrderStatusFilter("ALL")}
                    className={`px-3 py-1.5 rounded-lg transition ${orderStatusFilter === "ALL" ? "bg-[#0052FF] text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Todos ({currentOrders.length})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter("PENDING")}
                    className={`px-3 py-1.5 rounded-lg transition ${orderStatusFilter === "PENDING" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
                  >
                    ⏳ Pendientes ({currentOrders.filter(o => o.status === "PENDING").length})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter("PAID")}
                    className={`px-3 py-1.5 rounded-lg transition ${orderStatusFilter === "PAID" ? "bg-emerald-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
                  >
                    ✅ Pagados ({currentOrders.filter(o => o.status === "PAID").length})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter("REJECTED")}
                    className={`px-3 py-1.5 rounded-lg transition ${orderStatusFilter === "REJECTED" ? "bg-red-500 text-white font-black" : "text-slate-400 hover:text-white"}`}
                  >
                    ❌ Rechazados ({currentOrders.filter(o => o.status === "REJECTED").length})
                  </button>
                </div>
              </div>

              {/* Lista de Pedidos */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-slate-950 rounded-2xl border border-slate-800 text-slate-500">
                  <PackageCheck className="h-12 w-12 mx-auto mb-3 opacity-30 text-slate-400" />
                  <p className="text-xs font-bold">No hay pedidos registrados con este estado.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-md hover:border-slate-700 transition">
                      
                      {/* Información de Cliente y Cabecera de Pedido */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-black text-[#60A5FA] bg-[#0052FF]/20 px-2.5 py-1 rounded-lg border border-[#0052FF]/30">
                            {order.id}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">{order.date}</span>
                          
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                            order.status === "PAID" 
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                              : order.status === "REJECTED"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse"
                          }`}>
                            {order.status === "PAID" ? "✅ PAGO REALIZADO" : order.status === "REJECTED" ? "❌ RECHAZADO" : "⏳ PENDIENTE DE PAGO"}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-black text-white text-base flex items-center gap-2">
                            <User className="h-4 w-4 text-[#60A5FA]" /> {order.customerName}
                          </h3>
                          {order.customerAddress && (
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-500" /> {order.customerAddress} ({order.customerCity || "Ciudad sin especificar"})
                            </p>
                          )}
                        </div>

                        {/* Lista Desglosada de Productos Comprados */}
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Ítems Incluidos en la Orden:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800">
                                <img src={item.imageUrl} alt={item.title} className="h-9 w-9 rounded-lg object-cover border border-slate-800 shrink-0" />
                                <div className="overflow-hidden">
                                  <span className="font-bold text-white block truncate">{item.title}</span>
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    x{item.quantity} un. ({formatCOP(item.price * item.quantity)})
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Importe Total y Selector de Estado */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 shrink-0">
                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 font-bold uppercase block">Total del Pedido:</span>
                          <span className="text-2xl font-black text-emerald-400 font-mono">{formatCOP(order.total)}</span>
                        </div>

                        {/* Botones de Control de Estado */}
                        <div className="space-y-1.5 w-full sm:w-auto">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block text-right">Cambiar Estado:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleChangeOrderStatus(order.id, "PENDING", order.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                                order.status === "PENDING"
                                  ? "bg-amber-500 text-slate-950 border-amber-400 font-black"
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                              }`}
                            >
                              ⏳ Pendiente
                            </button>

                            <button
                              onClick={() => handleChangeOrderStatus(order.id, "PAID", order.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                                order.status === "PAID"
                                  ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg shadow-emerald-500/20"
                                  : "bg-slate-900 border-slate-800 text-emerald-400 hover:bg-emerald-500/10"
                              }`}
                            >
                              ✅ PAGO (Descuenta Stock)
                            </button>

                            <button
                              onClick={() => handleChangeOrderStatus(order.id, "REJECTED", order.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                                order.status === "REJECTED"
                                  ? "bg-red-500 text-white border-red-400 font-black"
                                  : "bg-slate-900 border-slate-800 text-red-400 hover:bg-red-500/10"
                              }`}
                            >
                              ❌ Rechazado
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTOS CON EDICIÓN Y CONTROL DIRECTO DE STOCK */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white">Catálogo de Productos, Edición & Control de Stock</h2>
                  <p className="text-xs text-slate-400 mt-1">Modifica precios, inventario y ofertas. Los productos con 0 unidades se marcan como AGOTADO automáticamente.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsGlobalDiscountModalOpen(true)}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg"
                  >
                    <Percent className="h-4 w-4 text-amber-400" /> Descuento Masivo a Todo el Catálogo
                  </button>

                  <button
                    onClick={handleOpenCreateModal}
                    className="bg-[#0052FF] hover:bg-[#0043D6] text-white text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg"
                  >
                    <PlusCircle className="h-4 w-4" /> Agregar Nuevo Producto
                  </button>
                </div>
              </div>

              {/* Buscador */}
              <div className="mb-6 relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar producto en tu catálogo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                />
              </div>

              {/* Tabla de Productos con Stock e Inventario */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-4">Producto & Foto</th>
                      <th className="p-4">Precio Oferta (Actual)</th>
                      <th className="p-4">Stock / Inventario</th>
                      <th className="p-4">% Descuento</th>
                      <th className="p-4 text-right">Acciones de Edición</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProducts.map((p) => {
                      const hasDiscount = p.comparePrice && p.comparePrice > p.price;
                      const discountPercentage = hasDiscount 
                        ? Math.round(((p.comparePrice! - p.price) / p.comparePrice!) * 100)
                        : 0;

                      return (
                        <tr key={p.id} className="hover:bg-slate-950/50 transition">
                          <td className="p-4 flex items-center gap-3">
                            <img 
                              src={p.imageUrl} 
                              alt={p.title} 
                              style={{ objectFit: p.imageFit || "cover", objectPosition: `${p.objectPositionX ?? 50}% ${p.objectPositionY ?? 50}%` }}
                              className="h-12 w-12 rounded-xl border border-slate-800 shrink-0" 
                            />
                            <div>
                              <span className="font-bold text-white text-sm block">{p.title}</span>
                              <span className="text-[10px] text-slate-400 truncate max-w-xs block">{p.specifications}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="font-black text-white text-sm">{formatCOP(p.price)}</span>
                            {hasDiscount && (
                              <span className="block text-[11px] text-slate-500 line-through">
                                {formatCOP(p.comparePrice!)}
                              </span>
                            )}
                          </td>

                          {/* Control Visual de Stock */}
                          <td className="p-4">
                            <span className={`font-mono text-xs font-bold px-3 py-1 rounded-lg border inline-flex items-center gap-1.5 ${
                              p.stock <= 0
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : p.stock <= 3
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30 font-black animate-pulse"
                                : "bg-slate-950 text-slate-200 border-slate-800"
                            }`}>
                              <Box className="h-3.5 w-3.5" />
                              {p.stock <= 0 ? "0 un. (AGOTADO)" : p.stock <= 3 ? `¡¡${p.stock} un. restantes!!` : `${p.stock} un.`}
                            </span>
                          </td>

                          <td className="p-4">
                            {hasDiscount ? (
                              <span className="bg-amber-500/20 text-amber-300 font-black px-2.5 py-1 rounded-lg border border-amber-500/30 text-[11px] inline-flex items-center gap-1">
                                <Tag className="h-3 w-3" /> -{discountPercentage}% OFF
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Sin Oferta</span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleProductStatus(p.id, p.title, !p.isActive)}
                                className={`font-bold px-2.5 py-1 rounded-lg text-[10px] ${
                                  p.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {p.isActive ? "Visible" : "Oculto"}
                              </button>

                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="bg-[#0052FF]/20 hover:bg-[#0052FF]/40 text-[#60A5FA] border border-[#0052FF]/40 px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition"
                              >
                                <Edit className="h-3.5 w-3.5" /> Editar
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(p.id, p.title)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-1.5 rounded-lg transition"
                                title="Eliminar Producto"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: BRANDING & DATOS DE LA TIENDA */}
        {activeTab === "branding" && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-xl">
              <div className="pb-4 border-b border-slate-800 mb-6">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Palette className="h-6 w-6 text-[#0052FF]" /> Nombre de Tienda, Enlace Web, Logo & Colores
                </h2>
                <p className="text-xs text-slate-400 mt-1">Personaliza el nombre oficial de tu negocio, tu enlace único web (slug), logo y colores globales de tu tienda.</p>
              </div>

              <form onSubmit={handleOpenSaveConfirmModal} className="space-y-6">
                
                {/* 1. SECCIÓN DE NOMBRE DE TIENDA Y ENLACE ÚNICO (SLUG) */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <label className="block text-xs font-bold text-slate-200">1. Nombre Comercial & Enlace Único Web (URL Slug)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const autoSlug = storeConfig.storeName.toLowerCase().replace(/[^a-z0-9]/g, "");
                        setStoreConfig({ ...storeConfig, slug: autoSlug });
                        triggerToast(`⚡ Enlace generado: "/${autoSlug}" (Sin guiones ni espacios)`);
                      }}
                      className="bg-blue-500/10 hover:bg-blue-500/20 text-[#60A5FA] border border-blue-500/30 px-3 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                    >
                      ⚡ Generar Enlace Pegado Directo (ej. "modalatam")
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Oficial de Tu Tienda / Negocio *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Moda LatAm"
                        value={storeConfig.storeName}
                        onChange={(e) => setStoreConfig({ ...storeConfig, storeName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Enlace Web Único (Slug de Dirección URL) *</label>
                      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                        <span className="text-xs text-slate-500 font-mono select-none">/</span>
                        <input
                          type="text"
                          required
                          placeholder="modalatam"
                          value={storeConfig.slug}
                          onChange={(e) => {
                            // Convertir automáticamente a minúsculas y quitar caracteres no válidos
                            const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                            setStoreConfig({ ...storeConfig, slug: sanitized });
                          }}
                          className="w-full bg-transparent text-xs font-mono text-emerald-400 font-bold focus:outline-none pl-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Previsualización del Enlace Web de la Tienda */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold">Tu Dirección Web Oficial para Clientes:</span>
                    <a
                      href={`/${storeConfig.slug || 'tu-tienda'}`}
                      target="_blank"
                      className="font-mono text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
                    >
                      https://visionweb.com/<strong className="text-emerald-300">{storeConfig.slug || 'modalatam'}</strong>
                      <ExternalLink className="h-3 w-3 text-slate-500" />
                    </a>
                  </div>

                  {/* RECUADRO CON LAS REGLAS Y ESPECIFICACIONES DE LO QUE SE PUEDE Y NO PONER */}
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-3.5 rounded-xl text-[11px] leading-relaxed flex items-start gap-2.5">
                    <HelpCircle className="h-4 w-4 text-[#60A5FA] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="block text-slate-200">💡 Reglas & Especificaciones para el Enlace Web de tu Tienda:</strong>
                      <p>
                        • <strong>PERMITIDO:</strong> Puedes escribir el nombre pegado directamente (ejemplo: <code>modalatam</code>). Solo se permiten letras minúsculas (a-z), números (0-9) y guiones (<code>-</code>).
                      </p>
                      <p>
                        • <strong>NO PERMITIDO:</strong> Espacios en blanco, letras mayúsculas, tildes, comas ni símbolos especiales (<code>@</code>, <code>#</code>, <code>$</code>, <code>%</code>, etc.).
                      </p>
                      <p className="text-slate-400">
                        <em>Ejemplos válidos:</em> <code>modalatam</code> | <code>mitienda</code> | <code>calzado-colombia</code>
                      </p>
                    </div>
                  </div>

                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold text-slate-200">1. Logo Oficial (Local o Link URL)</label>
                    <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setStoreConfig({ ...storeConfig, logoType: "file" })}
                        className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                          storeConfig.logoType === "file" ? "bg-[#0052FF] text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Upload className="h-3.5 w-3.5" /> Subir Archivo Local
                      </button>
                      <button
                        type="button"
                        onClick={() => setStoreConfig({ ...storeConfig, logoType: "url" })}
                        className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                          storeConfig.logoType === "url" ? "bg-[#0052FF] text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <LinkIcon className="h-3.5 w-3.5" /> Enlace URL
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {storeConfig.logoType === "file" ? (
                      <label className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-[#0052FF] rounded-xl p-3.5 cursor-pointer text-xs font-bold text-[#60A5FA] transition">
                        <Upload className="h-4 w-4" /> Seleccionar Imagen desde mi Dispositivo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLocalLogoUpload}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <input
                        type="url"
                        placeholder="https://tu-servidor.com/mi-logo.png"
                        value={storeConfig.logoUrl}
                        onChange={(e) => setStoreConfig({ ...storeConfig, logoUrl: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                      />
                    )}

                    {storeConfig.logoUrl && (
                      <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                        <img src={storeConfig.logoUrl} alt="Vista Previa Logo" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. PALETAS TEMÁTICAS COMPLETAS */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-200 mb-2">2. Paletas Temáticas Completas (1 Clic)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setStoreConfig({
                            ...storeConfig,
                            primaryColor: preset.primary,
                            secondaryColor: preset.secondary,
                            backgroundColor: preset.background,
                            cardColor: preset.card,
                          });
                          triggerToast(`🎨 Paleta "${preset.name}" seleccionada. Haz clic en guardar para publicar.`);
                        }}
                        className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-2xl text-left transition group"
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="h-4 w-4 rounded-full border border-slate-700" style={{ backgroundColor: preset.primary }} />
                          <span className="h-4 w-4 rounded-full border border-slate-700" style={{ backgroundColor: preset.secondary }} />
                          <span className="h-4 w-4 rounded-full border border-slate-700" style={{ backgroundColor: preset.background }} />
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-[#60A5FA] truncate block">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. SELECTOR DE TIPOGRAFÍA WEB (PLUS PLAN INTERMEDIO Y PREMIUM) */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Type className="h-4 w-4 text-[#60A5FA]" /> 3. Tipografía Web Oficial (PLUS Plan Intermedio & Premium)
                      </label>
                      <p className="text-[11px] text-slate-400 mt-0.5">Elige la fuente tipográfica profesional que vestirá tu tienda pública.</p>
                    </div>
                    {isPlusPlan ? (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        ✨ DESBLOQUEADO EN TU PLAN
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        🔒 DISPONIBLE EN PLAN PRO Y VIP
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { name: "Inter", label: "Inter", desc: "Moderna, Limpia & Versátil" },
                      { name: "Outfit", label: "Outfit", desc: "Futurista, Elegante & Premium" },
                      { name: "Poppins", label: "Poppins", desc: "Llamativa, Redondeada & Urbana" },
                      { name: "Roboto", label: "Roboto", desc: "Clásica, Profesional & Nítida" },
                      { name: "Playfair Display", label: "Playfair", desc: "Lujo, Moda & Alta Costura" },
                      { name: "Montserrat", label: "Montserrat", desc: "Geométrica, Potente & Comercial" }
                    ].map((font) => (
                      <button
                        key={font.name}
                        type="button"
                        disabled={!isPlusPlan}
                        onClick={() => {
                          setStoreConfig({ ...storeConfig, fontFamily: font.name });
                          triggerToast(`🔤 Tipografía "${font.name}" seleccionada`);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition relative ${
                          storeConfig.fontFamily === font.name
                            ? "bg-[#0052FF]/20 border-[#0052FF] text-white shadow-lg"
                            : isPlusPlan
                            ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white cursor-pointer"
                            : "bg-slate-900/50 border-slate-800/50 text-slate-500 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black truncate">{font.label}</span>
                          {storeConfig.fontFamily === font.name && (
                            <Check className="h-3.5 w-3.5 text-[#60A5FA]" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate mb-1.5">{font.desc}</span>
                        <div className="text-xs font-bold text-white tracking-wide truncate border-t border-slate-800/60 pt-1.5" style={{ fontFamily: font.name }}>
                          {storeConfig.storeName || "Mi Tienda Web"}
                        </div>
                      </button>
                    ))}
                  </div>

                  {!isPlusPlan && (
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-3 rounded-xl text-[11px] flex items-center justify-between">
                      <span>💡 <strong>¿Quieres personalizar la fuente de tu tienda?</strong> Actualiza a Plan Pro o Empresa VIP.</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("subscription")}
                        className="bg-amber-500 text-slate-950 px-3 py-1 rounded-lg font-black text-[10px] shrink-0"
                      >
                        Ver Planes
                      </button>
                    </div>
                  )}

                  {/* WIDGET DE PREVISUALIZACIÓN REALISTA DE LA TIPOGRAFÍA EN TIEMPO REAL */}
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 mt-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Eye className="h-4 w-4 text-[#60A5FA]" /> Ejemplo Real de Cómo Quedará Tu Tienda Con la Fuente: <strong className="text-emerald-400 font-mono">{storeConfig.fontFamily || "Inter"}</strong>
                      </span>
                      <span className="text-[10px] bg-blue-500/20 text-[#60A5FA] px-2 py-0.5 rounded font-bold">
                        VISTA PREVIA EN TIEMPO REAL
                      </span>
                    </div>

                    {/* Inyección dinámica de Google Fonts para la vista previa */}
                    <link
                      rel="stylesheet"
                      href={`https://fonts.googleapis.com/css2?family=${(storeConfig.fontFamily || "Inter").replace(/\s+/g, "+")}:wght@400;600;700;900&display=swap`}
                    />

                    {/* Tarjeta Mockup Real de Tienda */}
                    <div 
                      className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4"
                      style={{ fontFamily: `'${storeConfig.fontFamily || "Inter"}', sans-serif` }}
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="text-base font-black text-white">{storeConfig.storeName || "Moda & Estilo LatAm"}</h4>
                        <span className="bg-[#25D366]/20 text-[#25D366] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                          TIENDA OFICIAL EN LÍNEA
                        </span>
                      </div>

                      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-slate-800 shrink-0 overflow-hidden border border-slate-700">
                          <img 
                            src={currentProducts[0]?.imageUrl || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop"} 
                            alt="Vista Previa" 
                            className="h-full w-full object-cover" 
                          />
                        </div>

                        <div className="space-y-1 overflow-hidden">
                          <h5 className="font-black text-white text-sm truncate">{currentProducts[0]?.title || "Camiseta Oversize Algodón 100%"}</h5>
                          <p className="text-xs text-slate-400 truncate">100% Algodón Nacional • Envío Inmediato a Todo Colombia</p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="font-black text-emerald-400 text-sm">{formatCOP(currentProducts[0]?.price || 55000)}</span>
                            {currentProducts[0]?.comparePrice && (
                              <span className="text-xs text-slate-500 line-through">{formatCOP(currentProducts[0].comparePrice)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full bg-[#25D366] text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
                      >
                        <MessageSquare className="h-4 w-4 fill-slate-950" /> COMPRAR DIRECTO POR WHATSAPP
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#0052FF] to-blue-600 text-white font-black px-8 py-3.5 rounded-2xl text-xs transition shadow-xl flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" /> Guardar Cambios y Aplicar a Mi Tienda Web
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: METRICAS Y RESUMEN FINANCIERO MENSUAL (ENTRADAS VS SALIDAS) */}
        {activeTab === "metrics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Ventas Pagadas (Entradas)</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                  {formatCOP(currentOrders.filter(o => o.status === "PAID").reduce((acc, o) => acc + o.total, 0))}
                </p>
                <p className="text-xs text-emerald-400 font-bold mt-1">↑ Pedidos confirmados y pagados</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Ventas Pendientes</span>
                <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
                  {formatCOP(currentOrders.filter(o => o.status === "PENDING").reduce((acc, o) => acc + o.total, 0))}
                </p>
                <p className="text-xs text-slate-400 mt-1">{currentOrders.filter(o => o.status === "PENDING").length} órdenes por cobrar</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Inventario Disponible</span>
                <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {currentProducts.reduce((acc, p) => acc + p.stock, 0)} Unidades
                </p>
                <p className="text-xs text-slate-400 mt-1">{currentProducts.length} productos montados</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Días Restantes</span>
                <p className="text-2xl sm:text-3xl font-black text-[#60A5FA] mt-1">{storeConfig.daysRemaining} Días</p>
                <p className="text-xs text-slate-400 mt-1">Plan {storeConfig.plan}</p>
              </div>
            </div>

            {/* MÓDULO RESUMEN FINANCIERO MENSUAL: ENTRADAS VS SALIDAS */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                    📊 REPORTE DE CAJA MENSUAL
                  </span>
                  <h2 className="text-xl font-black text-white mt-2 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-emerald-400" /> Resumen Financiero Mensual (Entradas vs Salidas)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Balance automático entre las ventas recibidas (Entradas) y las compras o costos de tu catálogo (Salidas).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Entradas */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Total Entradas (Ventas)</span>
                    <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-2xl font-black text-emerald-400">
                    +{formatCOP(currentOrders.filter(o => o.status === "PAID").reduce((acc, o) => acc + o.total, 0))}
                  </p>
                  <p className="text-[11px] text-slate-400">Total recaudado por pedidos pagos en la tienda</p>
                </div>

                {/* Salidas */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-red-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Total Salidas (Compras / Stock)</span>
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                  </div>
                  <p className="text-2xl font-black text-red-400">
                    -{formatCOP(currentProducts.reduce((acc, p) => acc + Math.round(p.price * 0.4 * p.stock), 0))}
                  </p>
                  <p className="text-[11px] text-slate-400">Costo estimado de compras e inventario cargado</p>
                </div>

                {/* Balance Neto */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-[#0052FF]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Balance Neto del Mes</span>
                    <span className="h-3 w-3 rounded-full bg-[#0052FF]" />
                  </div>
                  <p className="text-2xl font-black text-[#60A5FA]">
                    {formatCOP(
                      currentOrders.filter(o => o.status === "PAID").reduce((acc, o) => acc + o.total, 0) -
                      currentProducts.reduce((acc, p) => acc + Math.round(p.price * 0.4 * p.stock), 0)
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400">Utilidad neta estimada en caja este mes</p>
                </div>
              </div>

              {/* Registro Desglosado de Transacciones (Entradas y Salidas) */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Historial de Entradas y Salidas del Mes</h3>
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                      <tr>
                        <th className="p-3.5">Tipo</th>
                        <th className="p-3.5">Concepto / Detalle</th>
                        <th className="p-3.5">Fecha</th>
                        <th className="p-3.5 text-right">Monto COP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {currentOrders.filter(o => o.status === "PAID").map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-900/50">
                          <td className="p-3.5">
                            <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">
                              ENTRADA
                            </span>
                          </td>
                          <td className="p-3.5">
                            <strong className="text-white">Venta Pedido {ord.id}</strong> ({ord.customerName})
                          </td>
                          <td className="p-3.5 text-slate-400">{ord.date}</td>
                          <td className="p-3.5 text-right font-black text-emerald-400">+{formatCOP(ord.total)}</td>
                        </tr>
                      ))}

                      {currentProducts.slice(0, 3).map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-900/50">
                          <td className="p-3.5">
                            <span className="bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded text-[10px]">
                              SALIDA
                            </span>
                          </td>
                          <td className="p-3.5">
                            <strong className="text-white">Compra Inventario</strong> ({prod.title} - {prod.stock} un.)
                          </td>
                          <td className="p-3.5 text-slate-400">23/07/2026</td>
                          <td className="p-3.5 text-right font-black text-red-400">-{formatCOP(Math.round(prod.price * 0.4 * prod.stock))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PUBLICIDAD (EXCLUSIVO PLAN EMPRESA ÉLITE VIP) */}
        {activeTab === "advertising" && (
          <div className="space-y-6">
            {!isVipPlan && (
              <div className="bg-purple-950/40 border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-purple-600/30">
                    <Megaphone className="h-6 w-6 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                      🔒 MÓDULO EXCLUSIVO PLAN EMPRESA ÉLITE VIP ($25.000 COP/mes)
                    </span>
                    <h3 className="text-base font-black text-white mt-1">Generador de Publicidad HD e Impulso VIP</h3>
                    <p className="text-xs text-slate-300">
                      Actualiza a Plan Empresa Élite VIP para activar los banners publicitarios automáticos y promocionar tu tienda.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("subscription")}
                  className="bg-gradient-to-r from-purple-600 to-amber-500 text-slate-950 font-black px-5 py-3 rounded-xl text-xs shrink-0 shadow-lg shadow-purple-600/30 hover:scale-105 transition"
                >
                  🚀 Activar Plan Empresa VIP
                </button>
              </div>
            )}

            <div className={!isVipPlan ? "opacity-50 pointer-events-none select-none blur-[0.5px]" : ""}>
              <AdBannerModule
                storeName={storeConfig.storeName}
                logoUrl={storeConfig.logoUrl}
                whatsapp={storeConfig.whatsapp}
                products={currentProducts}
                primaryColor={storeConfig.primaryColor}
                secondaryColor={storeConfig.secondaryColor}
              />
            </div>
          </div>
        )}

        {/* TAB 6: SUSCRIPCIÓN */}
        {activeTab === "subscription" && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl">
            <h2 className="text-xl font-black text-white mb-2">Estado de Tu Plan & Licencia</h2>
            <p className="text-xs text-slate-400 mb-6">Tu plan actual es <strong className="text-white">{storeConfig.plan}</strong> con {storeConfig.daysRemaining} días restantes.</p>
            <Link href="/dashboard/subscription" className="bg-[#0052FF] hover:bg-[#0043D6] text-white text-xs font-bold px-5 py-3 rounded-xl inline-block shadow-lg">
              Renovar o Cambiar Plan
            </Link>
          </div>
        )}

        {/* MODAL CREAR / EDITAR PRODUCTO CON STOCK DE INVENTARIO Y DESCUENTOS */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950 border border-slate-800"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                {editingProductId ? <Edit className="h-5 w-5 text-[#60A5FA]" /> : <PlusCircle className="h-5 w-5 text-[#0052FF]" />}
                {editingProductId ? "Editar Producto Montado" : "Agregar Nuevo Producto"}
              </h3>
              
              <form onSubmit={handleSaveProductForm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nombre / Título del Producto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Camiseta Algodón Premium"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                  />
                </div>

                {/* CAMPO DE STOCK Y DESCUENTOS */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Percent className="h-4 w-4" /> Precios, Descuentos & Inventario
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Box className="h-3.5 w-3.5 text-[#60A5FA]" /> Control de Stock
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Precio Normal ($)</label>
                      <input
                        type="number"
                        placeholder="100000"
                        value={productForm.originalPrice}
                        onChange={(e) => handleDiscountPercentChange(productForm.discountPercent, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-amber-400 mb-1">% Descuento</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="20"
                          value={productForm.discountPercent}
                          onChange={(e) => handleDiscountPercentChange(e.target.value, productForm.originalPrice)}
                          className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-amber-400 font-bold">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-400 mb-1">Precio Final Oferta ($) *</label>
                      <input
                        type="number"
                        required
                        placeholder="80000"
                        value={productForm.finalPrice}
                        onChange={(e) => setProductForm({ ...productForm, finalPrice: e.target.value })}
                        className="w-full bg-slate-900 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* CAMPO DE STOCK DE INVENTARIO */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Stock Disponible (Unidades en Inventario) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="10"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#0052FF]"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Si pones 0 unidades, el producto aparecerá etiquetado como <strong>AGOTADO</strong> en la tienda.
                    </span>
                  </div>

                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Especificaciones Técnicas / Detalles</label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Material: 100% Algodón | Tallas: S, M, L | Garantía: 30 Días"
                    value={productForm.specifications}
                    onChange={(e) => setProductForm({ ...productForm, specifications: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                  />
                </div>

                {/* Sección Foto de Producto */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-200">Foto del Producto & Encuadre</label>
                    <button
                      type="button"
                      onClick={() => setIsAdjusterModalOpen(true)}
                      className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition"
                    >
                      <Move className="h-3.5 w-3.5" /> ✂️ Mover / Recortar Foto
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="URL de Imagen (https://...)"
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <label className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border border-slate-700 shrink-0 flex items-center gap-1">
                      <Upload className="h-3.5 w-3.5" /> Subir
                      <input type="file" accept="image/*" onChange={handleProductLocalImageUpload} className="hidden" />
                    </label>
                  </div>

                  {productForm.imageUrl && (
                    <div className="h-36 w-full max-w-xs mx-auto rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center p-1 relative">
                      <img 
                        src={productForm.imageUrl} 
                        alt="Previsualización" 
                        style={{
                          objectFit: productForm.imageFit,
                          objectPosition: `${productForm.positionX}% ${productForm.positionY}%`,
                          transform: `scale(${productForm.zoom / 100})`
                        }}
                        className="h-full w-full rounded-xl"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0052FF] hover:bg-[#0043D6] text-white text-xs font-black px-5 py-2 rounded-xl transition shadow-lg"
                  >
                    {editingProductId ? "Guardar Cambios del Producto" : "Publicar Producto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DE DESCUENTO MASIVO A TODO EL CATÁLOGO */}
        {isGlobalDiscountModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-center">
              
              <button
                onClick={() => setIsGlobalDiscountModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950 border border-slate-800"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="h-14 w-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/40">
                <Percent className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-black text-white mb-1">Aplicar Descuento a Todo el Catálogo</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Ingresa el porcentaje de descuento que deseas aplicar automáticamente a TODOS los productos de tu tienda.
              </p>

              <form onSubmit={handleApplyGlobalDiscountSubmit} className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-2">Porcentaje de Descuento (%)</label>
                  <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                    <input
                      type="number"
                      min="0"
                      max="90"
                      required
                      value={globalDiscountPercentInput}
                      onChange={(e) => setGlobalDiscountPercentInput(e.target.value)}
                      className="w-28 bg-slate-900 border border-amber-500/40 text-amber-300 font-mono font-black text-center text-lg rounded-xl p-2.5 focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-amber-400 font-black text-lg">% OFF</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsGlobalDiscountModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" /> Aplicar a Todos los Productos
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* MODAL DE POSICIONAMIENTO Y ZOOM DE FOTO */}
        <ImageAdjusterModal
          isOpen={isAdjusterModalOpen}
          onClose={() => setIsAdjusterModalOpen(false)}
          imageUrl={productForm.imageUrl}
          imageFit={productForm.imageFit}
          positionX={productForm.positionX}
          positionY={productForm.positionY}
          zoom={productForm.zoom}
          onSave={(params) => {
            setProductForm({
              ...productForm,
              imageFit: params.imageFit,
              positionX: params.positionX,
              positionY: params.positionY,
              zoom: params.zoom
            });
            triggerToast("✨ ¡Encuadre de foto guardado!");
          }}
        />

        {/* MODAL DE CONFIRMACIÓN AL GUARDAR CONFIGURACIÓN DE TIENDA */}
        {isSaveConfirmModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-center">
              <div className="h-14 w-14 rounded-full bg-[#0052FF]/20 text-[#60A5FA] flex items-center justify-center mx-auto mb-4 border border-[#0052FF]/40">
                <ShieldCheck className="h-8 w-8 text-[#60A5FA]" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">¿Confirmar y Publicar Cambios de Tienda?</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Estás a punto de actualizar el logo oficial y la combinación de colores globales de tu página web.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsSaveConfirmModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
                >
                  Revisar de Nuevo
                </button>
                <button
                  onClick={handleConfirmSaveBranding}
                  className="bg-[#0052FF] hover:bg-[#0043D6] text-white font-black px-6 py-2.5 rounded-xl text-xs transition shadow-lg flex items-center gap-2"
                >
                  <Check className="h-4 w-4" /> Sí, Guardar y Publicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIGURACIÓN INICIAL OBLIGATORIA (PRIMER INGRESO AL DASHBOARD) */}
        {mounted && !storeConfig.initialSetupCompleted && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 selection:bg-[#0052FF]">
            <div className="bg-slate-900 border-2 border-[#0052FF]/50 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left my-8">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#0052FF]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-[#0052FF] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#0052FF]/30">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                    <AlertCircle className="h-3 w-3" /> Configuración Inicial Obligatoria
                  </span>
                  <h2 className="text-xl font-black text-white">¡Bienvenido a Tu Dashboard!</h2>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-6 leading-relaxed bg-slate-950 border border-slate-800 p-3.5 rounded-2xl">
                Para dejar habilitada la opción de subir productos y personalizar tu catálogo, por favor confirma el <strong>enlace de tu página web</strong> y la <strong>imagen de tu logo</strong> (si no tienes logo por ahora, puedes continuar sin logo).
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                saveStoreConfig({
                  ...storeConfig,
                  initialSetupCompleted: true,
                });
                triggerToast("🎉 ¡Configuración inicial guardada! Ahora puedes empezar a subir tus productos.");
              }} className="space-y-4">
                
                {/* 1. Slug de la Tienda */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <LinkIcon className="h-4 w-4 text-[#60A5FA]" /> 1. Enlace de Tu Página Web *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="mi-tienda"
                      value={storeConfig.slug}
                      onChange={(e) => {
                        const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
                        setStoreConfig({ ...storeConfig, slug: clean });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-4 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    Link final: <span className="text-[#60A5FA]">visionweb.app/<strong>{storeConfig.slug || "tu-tienda"}</strong></span>
                  </p>
                </div>

                {/* 2. Logo de la Tienda (Opcional - Si no se deja sin logo) */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-[#60A5FA]" /> 2. Logo de Tu Tienda
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">Opcional</span>
                  </label>
                  
                  <p className="text-[11px] text-slate-400 mb-3">
                    Sube la imagen del logo. Si no tienes uno en este momento, haz clic en <strong className="text-white">"Continuar sin logo"</strong> y tu tienda se creará sin logo.
                  </p>

                  {storeConfig.logoUrl ? (
                    <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img src={storeConfig.logoUrl} alt="Logo Preview" className="h-10 w-10 object-contain rounded-lg bg-slate-950 border border-slate-800 p-1" />
                        <span className="text-xs text-emerald-400 font-bold">Logo cargado correctamente</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStoreConfig({ ...storeConfig, logoUrl: "" })}
                        className="text-slate-400 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition text-xs font-bold"
                      >
                        Quitar y dejar sin logo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="flex items-center justify-center gap-2 border border-dashed border-slate-700 hover:border-[#0052FF] bg-slate-900/50 hover:bg-slate-900 text-slate-300 px-4 py-3 rounded-xl cursor-pointer transition text-xs font-medium">
                        <Upload className="h-4 w-4 text-[#60A5FA]" />
                        <span>Subir Imagen de Logo desde mi dispositivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) {
                                  setStoreConfig({ ...storeConfig, logoUrl: evt.target.result as string });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setStoreConfig({ ...storeConfig, logoUrl: "" })}
                        className="w-full text-center text-xs text-slate-400 hover:text-white py-1 transition underline"
                      >
                        Continuar sin logo por el momento
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0052FF] hover:bg-[#0043D6] text-white font-black py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-xl shadow-[#0052FF]/25 mt-4"
                >
                  <Check className="h-5 w-5" /> Guardar Configuración Inicial y Empezar a Subir Productos
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
