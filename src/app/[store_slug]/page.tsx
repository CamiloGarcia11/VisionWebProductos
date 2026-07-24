"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  Store, 
  ArrowRight, 
  MessageSquare, 
  Plus, 
  Minus, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Check, 
  Eye, 
  Tag, 
  Info,
  CheckCircle2,
  AlertCircle,
  Truck,
  User,
  MapPin,
  Phone,
  Zap,
  Star
} from "lucide-react";
import { formatCOP } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useStoreConfig } from "@/hooks/use-store-config";
import { Logo } from "@/components/shared/logo";

interface Product {
  id: string;
  storeId?: string;
  title: string;
  slug?: string;
  description?: string;
  specifications?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  imageFit?: "cover" | "contain";
  objectPositionX?: number;
  objectPositionY?: number;
  imageZoom?: number;
}

export default function StoreFrontPage({ params }: { params: { store_slug: string } }) {
  const { items, addItem, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { storeConfig, products: rawProducts, addOrder } = useStoreConfig();

  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado de Toasts y Mensajes de Confirmación
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estado del Modal de Confirmación de Compra
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [singleDirectProduct, setSingleDirectProduct] = useState<{ product: Product; quantity: number } | null>(null);
  const [customerData, setCustomerData] = useState({
    name: "",
    address: "",
    city: "",
    notes: ""
  });
  const [orderSubmittedSuccess, setOrderSubmittedSuccess] = useState(false);

  // Estado del Modal de Detalle del Producto
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Actualizar dinámicamente el favicon de la pestaña con el logo oficial del cliente sin marcos estirados
  useEffect(() => {
    if (mounted && storeConfig.logoUrl) {
      let faviconLink: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (faviconLink) {
        faviconLink.href = storeConfig.logoUrl;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.type = "image/png";
        newLink.href = storeConfig.logoUrl;
        document.head.appendChild(newLink);
      }
    }
  }, [mounted, storeConfig.logoUrl]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Leer valores guardados en localStorage o fallbacks por defecto
  const storeName = mounted && storeConfig.storeName ? storeConfig.storeName : (params?.store_slug ? params.store_slug.toUpperCase() : "Mi Tienda Web");
  const logoUrl = mounted ? storeConfig.logoUrl : "";
  const primaryColor = mounted ? storeConfig.primaryColor : "#0052FF";
  const secondaryColor = mounted ? storeConfig.secondaryColor : "#25D366";
  const backgroundColor = mounted ? storeConfig.backgroundColor : "#07090e";
  const cardColor = mounted ? storeConfig.cardColor : "#0f172a";
  const fontFamily = mounted ? (storeConfig.fontFamily || "Inter") : "Inter";
  const whatsappNumber = mounted ? storeConfig.whatsapp : "573001234567";

  // Cálculo de Contraste Automático para que los textos SIEMPRE denoten y destaquen
  const getContrastTextColor = (hexColor: string) => {
    if (!hexColor || !hexColor.startsWith("#")) return "#ffffff";
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#020617" : "#ffffff";
  };

  const textColor = getContrastTextColor(backgroundColor);
  const cardTextColor = getContrastTextColor(cardColor);

  const fontGoogleQuery = 
    fontFamily === "Outfit" ? "family=Outfit:wght@400;600;700;900" :
    fontFamily === "Poppins" ? "family=Poppins:wght@400;600;700;900" :
    fontFamily === "Roboto" ? "family=Roboto:wght@400;500;700;900" :
    fontFamily === "Playfair Display" ? "family=Playfair+Display:ital,wght@0,600;0,800;1,600" :
    fontFamily === "Montserrat" ? "family=Montserrat:wght@400;600;700;900" :
    "family=Inter:wght@400;600;700;900";

  const productsList: Product[] = mounted 
    ? rawProducts.map(p => ({ 
        ...p, 
        slug: p.id, 
        description: p.specifications, 
        isActive: p.isActive,
        imageFit: p.imageFit,
        objectPositionX: p.objectPositionX,
        objectPositionY: p.objectPositionY,
        imageZoom: p.imageZoom
      }))
    : [];

  const activeProducts = productsList.filter(p => p.isActive);

  const handleOpenDetailModal = (product: Product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
  };

  const handleAddFromModal = () => {
    if (!selectedProduct) return;
    for (let i = 0; i < modalQuantity; i++) {
      addItem({
        id: selectedProduct.id,
        storeId: selectedProduct.storeId || "store-1",
        title: selectedProduct.title,
        slug: selectedProduct.slug || selectedProduct.id,
        description: selectedProduct.description || "",
        specifications: selectedProduct.specifications,
        price: selectedProduct.price,
        comparePrice: selectedProduct.comparePrice,
        stock: selectedProduct.stock,
        imageUrl: selectedProduct.imageUrl,
        isActive: selectedProduct.isActive,
        imageFit: selectedProduct.imageFit
      });
    }
    setSelectedProduct(null);
    triggerToast(`🛒 ¡${modalQuantity}x ${selectedProduct.title} agregado al carrito!`);
    setIsCartOpen(true);
  };

  // Abrir Modal de Confirmación de Compra Directa
  const handleOpenDirectCheckout = (product: Product) => {
    setSingleDirectProduct({ product, quantity: modalQuantity });
    setIsCheckoutModalOpen(true);
  };

  // Abrir Modal de Confirmación de Compra para el Carrito
  const handleOpenCartCheckout = () => {
    if (items.length === 0) return;
    setSingleDirectProduct(null);
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  // Confirmar y procesar envío final del Pedido a WhatsApp
  const handleConfirmAndSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const waNumber = whatsappNumber.replace(/[^0-9]/g, "");

    let text = `🛒 *NUEVO PEDIDO CONFIRMADO EN LA TIENDA*\n\n`;
    text += `🏬 *Tienda:* ${storeName}\n`;
    if (customerData.name) text += `👤 *Cliente:* ${customerData.name}\n`;
    if (customerData.address) text += `📍 *Dirección:* ${customerData.address} (${customerData.city || "Ciudad sin especificar"})\n`;
    if (customerData.notes) text += `📝 *Notas:* ${customerData.notes}\n`;
    text += `\n📋 *DETALLE DEL PEDIDO:*\n`;

    let total = 0;
    if (singleDirectProduct) {
      const subtotal = singleDirectProduct.product.price * singleDirectProduct.quantity;
      text += `• ${singleDirectProduct.product.title} (x${singleDirectProduct.quantity}) - ${formatCOP(subtotal)}\n`;
      total = subtotal;
    } else {
      items.forEach((item) => {
        const itemSubtotal = item.price * item.quantity;
        text += `• ${item.title} (x${item.quantity}) - ${formatCOP(itemSubtotal)}\n`;
      });
      total = getTotalPrice();
    }

    text += `\n💵 *TOTAL A PAGAR:* ${formatCOP(total)}\n\n`;
    text += `Quedo atento a los datos bancarios / confirmación de envío. ¡Gracias!`;

    // Registrar Pedido en la base de datos local del comerciante
    const orderItems = singleDirectProduct
      ? [{
          id: singleDirectProduct.product.id,
          title: singleDirectProduct.product.title,
          price: singleDirectProduct.product.price,
          quantity: singleDirectProduct.quantity,
          imageUrl: singleDirectProduct.product.imageUrl || ""
        }]
      : items.map(i => ({
          id: i.id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl || ""
        }));

    addOrder({
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerData.name || "Cliente WhatsApp",
      customerCity: customerData.city,
      customerAddress: customerData.address,
      total: total,
      status: "PENDING",
      date: new Date().toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }),
      items: orderItems
    });

    setOrderSubmittedSuccess(true);
    triggerToast("✅ ¡Pedido confirmado con éxito! Abriendo WhatsApp...");

    setTimeout(() => {
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank");
      setIsCheckoutModalOpen(false);
      setOrderSubmittedSuccess(false);
      if (!singleDirectProduct) clearCart();
      setSingleDirectProduct(null);
    }, 1200);
  };

  return (
    <div 
      id="store-public-container"
      className="min-h-screen pb-28 transition-colors duration-500 relative overflow-x-hidden"
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      {/* Importación Dinámica e Inyección Global de la Fuente Web */}
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?${fontGoogleQuery}&display=swap`}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          #store-public-container, #store-public-container * {
            font-family: '${fontFamily}', sans-serif !important;
          }
        `
      }} />
      
      {/* Toast Flotante de Notificaciones con Animación */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-slate-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Store Header con Logo & Animaciones de Navegación */}
      <header 
        className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl transition-all"
        style={{ backgroundColor: `${backgroundColor}e6` }}
      >
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-3 group cursor-pointer">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={storeName} 
                className="h-11 w-11 rounded-2xl object-cover border border-white/20 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div 
                className="h-11 w-11 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-105 transition-transform"
                style={{ backgroundColor: primaryColor }}
              >
                <Store className="h-5 w-5" />
              </div>
            )}

            <div>
              <h1 className="font-black text-base md:text-lg leading-tight text-white group-hover:text-[#60A5FA] transition-colors">{storeName}</h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold" style={{ color: secondaryColor }}>
                <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: secondaryColor }} /> Tienda Oficial Verificada
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 border border-white/20 text-white px-4.5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 group"
            style={{ backgroundColor: cardColor }}
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" style={{ color: primaryColor }} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-black animate-cart-bounce shadow border border-slate-950" style={{ backgroundColor: secondaryColor }}>
                  {getTotalItems()}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold">Ver Carrito</span>
            {getTotalItems() > 0 && (
              <span className="font-mono font-black text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                {formatCOP(getTotalPrice())}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Store Hero Banner Dinámico con Micro-Animaciones */}
      <div className="relative py-14 px-4 text-center overflow-hidden border-b border-white/10 hero-gradient-mesh">
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          
          <span 
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black border shadow-lg animate-float"
            style={{ 
              backgroundColor: `${secondaryColor}15`, 
              borderColor: `${secondaryColor}40`, 
              color: secondaryColor 
            }}
          >
            <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Envíos Garantizados y Pedidos Rápidos a WhatsApp
          </span>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Catálogo Exclusivo de Productos
          </h2>

          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Explora nuestra colección. Abre cualquier producto para ver sus detalles técnicos o haz tu pedido directamente por WhatsApp.
          </p>

        </div>
      </div>

      {/* Product Grid con Animación Entrada y Proporción Fija Sin Huecos */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeProducts.map((product, idx) => (
            <div 
              key={product.id} 
              className="glass-panel-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group shadow-xl transition-all duration-500 animate-card-appear h-full"
              style={{ 
                backgroundColor: cardColor,
                animationDelay: `${idx * 80}ms`
              }}
            >
              
              {/* CONTENEDOR CON PROPORCIÓN FIJA Y DISEÑO INTEGRADO SIN HUECOS (Aspect 4:3) */}
              <div 
                className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer bg-slate-950 flex items-center justify-center shrink-0"
                onClick={() => handleOpenDetailModal(product)}
              >
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  style={{
                    objectFit: product.imageFit || "cover",
                    objectPosition: `${product.objectPositionX ?? 50}% ${product.objectPositionY ?? 50}%`,
                    transform: `scale(${(product.imageZoom ?? 100) / 100})`
                  }}
                  className="h-full w-full transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Badges de Oferta y Avisos de Stock */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                  {product.stock <= 0 ? (
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                      🚫 AGOTADO
                    </span>
                  ) : product.stock <= 3 ? (
                    <span className="bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xl animate-bounce flex items-center gap-1">
                      🔥 ¡¡Últimas {product.stock} {product.stock === 1 ? "unidad" : "unidades"}!!
                    </span>
                  ) : (
                    <span />
                  )}

                  {product.comparePrice && product.comparePrice > product.price && (
                    <span 
                      className="text-slate-950 text-[11px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-glow-tag"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      <Tag className="h-3 w-3" /> OFERTA
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                  <span className="bg-slate-900/90 border border-slate-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <Eye className="h-4 w-4" style={{ color: primaryColor }} /> Ver Detalle Completo
                  </span>
                </div>
              </div>

              {/* Información y Botones Perfectamente Alineados */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <h3 
                    onClick={() => handleOpenDetailModal(product)}
                    className="text-base font-black text-white hover:text-[#60A5FA] transition-colors cursor-pointer line-clamp-1 mb-1.5"
                  >
                    {product.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {product.specifications || "Producto de alta calidad listo para envío inmediato."}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-2xl font-black text-white tracking-tight">{formatCOP(product.price)}</span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="ml-2.5 text-xs text-slate-500 line-through font-semibold">
                          {formatCOP(product.comparePrice)}
                        </span>
                      )}
                    </div>
                    
                    <span className={`text-[11px] font-bold ${product.stock <= 0 ? "text-red-400" : product.stock <= 3 ? "text-amber-400 font-black" : "text-slate-400"}`}>
                      {product.stock <= 0 ? "Agotado" : `Stock: ${product.stock} un.`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => handleOpenDetailModal(product)}
                      className="w-full bg-slate-800/90 hover:bg-slate-700 text-white font-bold py-2.5 px-3 rounded-xl transition text-xs border border-slate-700 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95"
                    >
                      <Info className="h-3.5 w-3.5" /> Detalle
                    </button>
                    
                    <button
                      disabled={product.stock <= 0}
                      onClick={() => {
                        if (product.stock <= 0) return;
                        addItem({
                          id: product.id,
                          storeId: product.storeId || "store-1",
                          title: product.title,
                          slug: product.slug || product.id,
                          price: product.price,
                          comparePrice: product.comparePrice,
                          stock: product.stock,
                          imageUrl: product.imageUrl,
                          isActive: product.isActive,
                          imageFit: product.imageFit
                        });
                        triggerToast(`🛒 ¡${product.title} agregado al carrito!`);
                        setIsCartOpen(true);
                      }}
                      className={`w-full font-black py-2.5 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-lg ${
                        product.stock <= 0 
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" 
                          : "text-white hover:scale-[1.02] active:scale-95"
                      }`}
                      style={product.stock > 0 ? { backgroundColor: primaryColor } : undefined}
                    >
                      <Plus className="h-4 w-4" /> {product.stock <= 0 ? "Agotado" : "Carrito"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DETALLE DEL PRODUCTO - DISEÑO CONTINUO Y ACOMODADO SIN HUECOS VACÍOS */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            className="border border-white/15 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-card-appear"
            style={{ backgroundColor: cardColor }}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950 border border-slate-800 z-10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* Imagen que se adapta y llena la columna izquierda sin dejar espacios negros en blanco abajo */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center min-h-[260px] md:min-h-full h-full">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.title} 
                  style={{
                    objectFit: selectedProduct.imageFit || "cover",
                    objectPosition: `${selectedProduct.objectPositionX ?? 50}% ${selectedProduct.objectPositionY ?? 50}%`,
                    transform: `scale(${(selectedProduct.imageZoom ?? 100) / 100})`
                  }}
                  className="h-full w-full max-h-[380px] md:max-h-full"
                />
                {selectedProduct.comparePrice && selectedProduct.comparePrice > selectedProduct.price && (
                  <span 
                    className="absolute top-3 left-3 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-lg"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    ¡DESCUENTO DISPONIBLE!
                  </span>
                )}
              </div>

              {/* Contenido & Especificaciones en la columna derecha */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#60A5FA]">PRODUCTO VERIFICADO</span>
                  <h2 className="text-xl md:text-2xl font-black text-white mt-1 mb-2">{selectedProduct.title}</h2>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-black text-white">{formatCOP(selectedProduct.price)}</span>
                    {selectedProduct.comparePrice && selectedProduct.comparePrice > selectedProduct.price && (
                      <span className="text-sm text-slate-500 line-through font-semibold">
                        {formatCOP(selectedProduct.comparePrice)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    {selectedProduct.specifications || "Detalles de alta calidad garantizados."}
                  </p>

                  {selectedProduct.specifications && (
                    <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 mb-4">
                      <span className="text-xs font-bold text-white block mb-2 flex items-center gap-1.5">
                        <Info className="h-4 w-4" style={{ color: primaryColor }} /> Especificaciones Técnicas
                      </span>
                      <div className="space-y-1.5 text-xs text-slate-300">
                        {selectedProduct.specifications.split("|").map((spec, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: secondaryColor }} />
                            <span>{spec.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between bg-slate-950/80 border border-white/10 p-2.5 rounded-xl">
                    <span className="text-xs font-bold text-slate-400">Cantidad:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                        className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-mono font-bold text-sm text-white">{modalQuantity}</span>
                      <button
                        onClick={() => setModalQuantity(modalQuantity + 1)}
                        className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={handleAddFromModal}
                      className="w-full text-white font-black py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02]"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <ShoppingCart className="h-4 w-4" /> Agregar al Carrito
                    </button>

                    <button
                      onClick={() => handleOpenDirectCheckout(selectedProduct)}
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02]"
                    >
                      <MessageSquare className="h-4 w-4 fill-slate-950" /> Pedir por WhatsApp
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER DEL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div 
            className="border-l border-white/10 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl relative animate-card-appear"
            style={{ backgroundColor: cardColor }}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" style={{ color: primaryColor }} /> Tu Carrito de Compras
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-xs">Tu carrito está vacío actualmente.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="bg-slate-950/80 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.title} className="h-12 w-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-white text-xs line-clamp-1">{item.title}</h4>
                          <span className="font-mono text-xs text-[#60A5FA] font-bold">{formatCOP(item.price)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-white text-slate-400"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-mono text-xs px-1 font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-white text-slate-400"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center text-sm font-black text-white">
                  <span>Total a Pagar:</span>
                  <span className="text-emerald-400 text-xl font-mono">{formatCOP(getTotalPrice())}</span>
                </div>

                <button
                  onClick={handleOpenCartCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black py-4 rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#25D366]/20 hover:scale-[1.02]"
                >
                  <MessageSquare className="h-5 w-5 fill-slate-950" /> Confirmar y Enviar Pedido por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE COMPRA / CHECKOUT DE SEGURIDAD */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-card-appear">
            
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950 border border-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Confirmación de Tu Pedido</h3>
                <p className="text-xs text-slate-400">Verifica los productos antes de enviar tu orden a la tienda.</p>
              </div>
            </div>

            {orderSubmittedSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-xl font-black text-white">¡Pedido Confirmado con Éxito!</h4>
                <p className="text-xs text-slate-300">Serás redirigido a WhatsApp en unos segundos para finalizar con la tienda.</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmAndSubmitOrder} className="space-y-4">
                
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-40 overflow-y-auto space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Resumen de Compra:</span>
                  {singleDirectProduct ? (
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>• {singleDirectProduct.product.title} (x{singleDirectProduct.quantity})</span>
                      <span className="text-emerald-400">{formatCOP(singleDirectProduct.product.price * singleDirectProduct.quantity)}</span>
                    </div>
                  ) : (
                    items.map(item => (
                      <div key={item.id} className="flex justify-between text-xs font-bold text-white">
                        <span>• {item.title} (x{item.quantity})</span>
                        <span className="text-emerald-400">{formatCOP(item.price * item.quantity)}</span>
                      </div>
                    ))
                  )}

                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-white">
                    <span>TOTAL:</span>
                    <span className="text-emerald-400 font-mono">
                      {formatCOP(singleDirectProduct ? singleDirectProduct.product.price * singleDirectProduct.quantity : getTotalPrice())}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-200 block">Datos opcionales para el envío:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Tu Nombre Completo"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                      className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-[#0052FF]"
                    />
                    <input
                      type="text"
                      placeholder="Ciudad de Envío"
                      value={customerData.city}
                      onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                      className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Dirección o punto de referencia"
                    value={customerData.address}
                    onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-[#0052FF]"
                  />
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3 rounded-xl text-[11px] flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span>Tu pedido es seguro. Coordinarás el pago directamente con el dueño del negocio por WhatsApp.</span>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black px-6 py-2.5 rounded-xl transition text-xs shadow-lg flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4 fill-slate-950" /> Confirmar y Enviar a WhatsApp
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE DINÁMICO STICKY DEL CARRITO CON AURA RESPLANDECIENTE */}
      {mounted && getTotalItems() > 0 && !isCartOpen && !isCheckoutModalOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-bounce">
          <div className="relative group">
            {/* Aura Resplandeciente Neón */}
            <div 
              className="absolute -inset-1 rounded-full opacity-80 blur-md animate-pulse-ring pointer-events-none"
              style={{ backgroundColor: primaryColor }}
            />

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-3 px-5 py-3.5 rounded-full text-white font-black text-xs sm:text-sm shadow-2xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 border border-white/20"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5 animate-cart-bounce" />
                <span 
                  className="absolute -top-2 -right-2 text-slate-950 text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow"
                  style={{ backgroundColor: secondaryColor }}
                >
                  {getTotalItems()}
                </span>
              </div>

              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] uppercase opacity-90 font-bold">Ver Mi Carrito</span>
                <span className="font-mono text-xs sm:text-sm font-black text-white">{formatCOP(getTotalPrice())}</span>
              </div>

              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
