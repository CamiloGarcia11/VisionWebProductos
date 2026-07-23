"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  Tag, 
  Layers, 
  Palette, 
  ShoppingBag,
  Zap,
  Star,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Maximize2,
  ZoomIn,
  Move,
  Phone,
  Globe
} from "lucide-react";
import { formatCOP } from "@/lib/utils";

interface ProductItem {
  id: string;
  title: string;
  price: number;
  comparePrice?: number;
  imageUrl: string;
  specifications?: string;
}

interface AdBannerModuleProps {
  storeName: string;
  logoUrl: string;
  whatsapp: string;
  products: ProductItem[];
  primaryColor: string;
  secondaryColor: string;
}

export type BannerTemplateKey = 
  | "minimal-wave"   // Plantilla 1: Onda Minimalista (Beige a Azul)
  | "yellow-circle"   // Plantilla 2: Círculo Dorado & Azul Noche
  | "cyan-bubbles"    // Plantilla 3: Círculos Cién / Nueva Colección
  | "orange-bubbles"  // Plantilla 4: Círculos Naranja Fuego
  | "purple-bubbles"  // Plantilla 5: Círculos Púrpura Imperial
  | "story";          // Plantilla 6: Estado / Story Vertical 9:16

export function AdBannerModule({
  storeName,
  logoUrl,
  whatsapp,
  products,
  primaryColor,
  secondaryColor,
}: AdBannerModuleProps) {
  // Estado del producto seleccionado o subido
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [customImage, setCustomImage] = useState<string>("");
  const [productTitle, setProductTitle] = useState<string>(products[0]?.title || "Producto Destacado");
  const [productPrice, setProductPrice] = useState<number>(products[0]?.price || 75000);
  const [comparePrice, setComparePrice] = useState<number>(products[0]?.comparePrice || 95000);

  // Opciones de Plantilla y Estilos
  const [selectedTemplate, setSelectedTemplate] = useState<BannerTemplateKey>("minimal-wave");
  const [displayMode, setDisplayMode] = useState<"floating" | "glass" | "full">("floating");
  const [imageScale, setImageScale] = useState<number>(100); // 60% a 140%
  const [badgeText, setBadgeText] = useState<string>("¡OFERTA DÍA DE HOY!");
  const [customTagline, setCustomTagline] = useState<string>("Pídelo directo a WhatsApp con envío inmediato");

  const [copiedText, setCopiedText] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sincronizar producto seleccionado de la lista
  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    const found = products.find(p => p.id === id);
    if (found) {
      setProductTitle(found.title);
      setProductPrice(found.price);
      setComparePrice(found.comparePrice || Math.round(found.price * 1.25));
    }
  };

  // Manejo de carga de imagen de producto
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Obtener la imagen activa
  const activeImageUrl = customImage || products.find(p => p.id === selectedProductId)?.imageUrl || products[0]?.imageUrl || "";

  // Calcular porcentaje de descuento si existe precio comparativo
  const discountPercent = comparePrice > productPrice 
    ? Math.round(((comparePrice - productPrice) / comparePrice) * 100) 
    : 30;

  // Renderizado e Impresión en HTML5 Canvas HD para descarga perfecta en alta resolución (1080x1080 / 1080x1920)
  const handleDownloadBanner = () => {
    setIsDownloading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isStory = selectedTemplate === "story";
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      ctx.clearRect(0, 0, width, height);

      // ==========================================
      // PLANTILLA 1: MINIMAL WAVE (Onda Beige & Azul Ocean)
      // ==========================================
      if (selectedTemplate === "minimal-wave") {
        // Fondo degradado horizontal beige a azul
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#DBCBBF");
        grad.addColorStop(0.5, "#82B0BC");
        grad.addColorStop(1, "#5496A6");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Dibujar curvas de onda vectoriales de fondo
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.moveTo(0, height * 0.4 + i * 20);
          ctx.bezierCurveTo(width * 0.3, height * 0.2 + i * 15, width * 0.7, height * 0.6 + i * 15, width, height * 0.3 + i * 20);
          ctx.stroke();
        }

        // Título Superior "NUEVO PRODUCTO"
        ctx.fillStyle = "#000000";
        ctx.font = "black 70px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("NUEVO PRODUCTO", width / 2, 130);

        ctx.font = "bold 42px sans-serif";
        ctx.fillText(productTitle.toUpperCase(), width / 2, 200);

        // Imagen de Producto Flotante en el Centro
        const imgH = 500 * (imageScale / 100);
        const imgW = imgH * (img.width / img.height);
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 15;
        ctx.drawImage(img, (width - imgW) / 2, 260, imgW, imgH);
        ctx.shadowColor = "transparent";

        // Puntos decorativos de paleta a la derecha
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(width - 80, 420, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#000000";
        ctx.beginPath(); ctx.arc(width - 80, 470, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#D4A392";
        ctx.beginPath(); ctx.arc(width - 80, 520, 16, 0, Math.PI * 2); ctx.fill();

        // Badge Inferior % OFF + Forma redondeada
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.roundRect(140, 830, 260, 80, 40);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "black 38px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${discountPercent}% OFF`, 270, 883);

        // Caja bordeada lateral
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(380, 830, 560, 80, 40);
        ctx.stroke();

        ctx.fillStyle = "#000000";
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Precio Especial: ${formatCOP(productPrice)}`, 660, 880);

        // Footer Tienda
        ctx.fillStyle = "#000000";
        ctx.font = "normal 32px sans-serif";
        ctx.fillText(`Consíguelo en /${storeName.toLowerCase().replace(/\s+/g, "")}`, width / 2, 980);
      }

      // ==========================================
      // PLANTILLA 2: YELLOW CIRCLE (Dorado & Azul Noche)
      // ==========================================
      else if (selectedTemplate === "yellow-circle") {
        // Fondo azul noche muy oscuro
        ctx.fillStyle = "#091224";
        ctx.fillRect(0, 0, width, height);

        // Formas curvadas amarillas vibrantes arriba y abajo
        ctx.fillStyle = "#FACC15";
        ctx.beginPath();
        ctx.arc(width * 0.8, 150, 420, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(width * 0.2, height - 100, 400, 0, Math.PI * 2);
        ctx.fill();

        // Círculo Azul Noche del Logo
        ctx.fillStyle = "#091224";
        ctx.beginPath();
        ctx.arc(width - 200, 160, 130, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "black 38px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(storeName.toUpperCase(), width - 200, 172);

        // MARCO CIRCULAR DORADO PARA EL PRODUCTO
        const centerX = 360;
        const centerY = 450;
        const radius = 290;

        ctx.fillStyle = "#FACC15";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#091224";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Recortar la foto dentro del círculo amarillo
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();

        const imgH = radius * 2.2 * (imageScale / 100);
        const imgW = imgH * (img.width / img.height);
        ctx.drawImage(img, centerX - imgW / 2, centerY - imgH / 2, imgW, imgH);
        ctx.restore();

        // Textos a la Derecha: 50% OFF & SPECIAL SALE OFFER
        ctx.fillStyle = "#ffffff";
        ctx.font = "black 75px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${discountPercent}%`, width - 220, 440);
        ctx.font = "black 55px sans-serif";
        ctx.fillText("OFF", width - 220, 510);

        ctx.font = "black 50px sans-serif";
        ctx.fillText("OFERTA ESPECIAL", width - 240, 710);
        ctx.font = "bold 38px sans-serif";
        ctx.fillStyle = "#FACC15";
        ctx.fillText(productTitle.toUpperCase(), width - 240, 770);

        // Botón COMPRAR AHORA
        ctx.fillStyle = "#FACC15";
        ctx.beginPath();
        ctx.roundRect(width - 400, 830, 320, 75, 38);
        ctx.fill();

        ctx.fillStyle = "#000000";
        ctx.font = "black 30px sans-serif";
        ctx.fillText("COMPRAR AHORA", width - 240, 878);

        // Footer Llamar / WhatsApp
        ctx.fillStyle = "#091224";
        ctx.beginPath();
        ctx.roundRect(80, 760, 360, 80, 40);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`PEDIR AHORA: ${whatsapp}`, 260, 810);

        ctx.fillStyle = "#000000";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText(`www.visionweb.com/${storeName.toLowerCase().replace(/\s+/g, "")}`, 260, 880);
      }

      // ==========================================
      // PLANTILLA 3, 4, 5: CÍRCULOS (Cién, Naranja, Púrpura)
      // ==========================================
      else if (selectedTemplate === "cyan-bubbles" || selectedTemplate === "orange-bubbles" || selectedTemplate === "purple-bubbles") {
        const themeColor = selectedTemplate === "cyan-bubbles" 
          ? "#0EA5E9" 
          : selectedTemplate === "orange-bubbles" 
          ? "#F97316" 
          : "#8B5CF6";

        // Fondo con retícula suave clara
        ctx.fillStyle = "#E5E7EB";
        ctx.fillRect(0, 0, width, height);

        // Cuadrícula ligera de diseño
        ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // Círculos gigantes en esquina superior izquierda
        ctx.fillStyle = themeColor;
        ctx.beginPath();
        ctx.arc(100, 100, 380, 0, Math.PI * 2);
        ctx.fill();

        // Texto "NUEVO INGRESO" en blanco
        ctx.fillStyle = "#ffffff";
        ctx.font = "black 60px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("NUEVO", 60, 110);
        ctx.fillText("INGRESO", 60, 180);

        // Burbujas decorativas arriba a la derecha
        ctx.beginPath(); ctx.arc(920, 150, 45, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(940, 240, 25, 0, Math.PI * 2); ctx.fill();

        // Círculos en esquina inferior derecha
        ctx.beginPath();
        ctx.arc(width - 100, height - 100, 360, 0, Math.PI * 2);
        ctx.fill();

        // Badge 50% OFF
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(width - 240, height - 260, 180, 110, 20);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "black 42px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${discountPercent}%`, width - 150, height - 200);
        ctx.font = "bold 26px sans-serif";
        ctx.fillText("OFF", width - 150, height - 165);

        ctx.font = "bold 24px sans-serif";
        ctx.fillText(`/${storeName.toLowerCase().replace(/\s+/g, "")}`, width - 200, height - 60);

        // IMAGEN DEL PRODUCTO EN EL CENTRO
        const imgH = 620 * (imageScale / 100);
        const imgW = imgH * (img.width / img.height);
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 35;
        ctx.shadowOffsetY = 20;
        ctx.drawImage(img, (width - imgW) / 2, (height - imgH) / 2 + 40, imgW, imgH);
        ctx.shadowColor = "transparent";

        // Título del Producto
        ctx.fillStyle = "#000000";
        ctx.font = "black 44px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(productTitle.toUpperCase(), width / 2, height - 120);
        ctx.fillStyle = themeColor;
        ctx.font = "black 50px sans-serif";
        ctx.fillText(formatCOP(productPrice), width / 2, height - 55);
      }

      // ==========================================
      // PLANTILLA 6: STORY / ESTADO 9:16 VERTICAL HD
      // ==========================================
      else {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#09090b");
        grad.addColorStop(0.5, primaryColor || "#0052FF");
        grad.addColorStop(1, "#020617");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Nombre Tienda
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 44px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(storeName.toUpperCase(), width / 2, 140);

        // Badge Sticker
        ctx.fillStyle = secondaryColor || "#25D366";
        ctx.beginPath();
        ctx.roundRect(width / 2 - 250, 190, 500, 70, 35);
        ctx.fill();

        ctx.fillStyle = "#000000";
        ctx.font = "black 32px sans-serif";
        ctx.fillText(badgeText, width / 2, 238);

        // Imagen de Producto Flotante Grande
        const imgH = 920 * (imageScale / 100);
        const imgW = imgH * (img.width / img.height);
        ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
        ctx.shadowBlur = 50;
        ctx.shadowOffsetY = 25;
        ctx.drawImage(img, (width - imgW) / 2, 380, imgW, imgH);
        ctx.shadowColor = "transparent";

        // Tarjeta Inferior de Precio
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.beginPath();
        ctx.roundRect(80, 1380, width - 160, 420, 40);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 50px sans-serif";
        ctx.fillText(productTitle, width / 2, 1470);

        ctx.font = "black 70px sans-serif";
        ctx.fillStyle = secondaryColor || "#25D366";
        ctx.fillText(formatCOP(productPrice), width / 2, 1570);

        if (comparePrice > productPrice) {
          ctx.font = "34px sans-serif";
          ctx.fillStyle = "#94a3b8";
          ctx.fillText(`Antes: ${formatCOP(comparePrice)}`, width / 2, 1630);
        }

        ctx.font = "bold 32px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`📲 Pídelo a WhatsApp: ${whatsapp}`, width / 2, 1720);
      }

      // Descargar como archivo PNG HD
      const link = document.createElement("a");
      link.download = `Publicidad_${storeName.replace(/\s+/g, "_")}_${selectedTemplate}_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsDownloading(false);
    };

    img.onerror = () => {
      setIsDownloading(false);
      alert("No se pudo procesar la imagen para la descarga HD. Intenta subir un archivo PNG o JPG.");
    };

    img.src = activeImageUrl;
  };

  // Copiar Copy publicitario listo para redes sociales
  const handleCopyCaption = () => {
    let caption = `🔥 *${badgeText} EN ${storeName.toUpperCase()}* 🔥\n\n`;
    caption += `✨ *${productTitle}*\n`;
    caption += `💰 *PRECIO ESPECIAL:* ${formatCOP(productPrice)}\n`;
    if (comparePrice > productPrice) {
      caption += `❌ Antes: ${formatCOP(comparePrice)}\n`;
    }
    caption += `\n📌 ${customTagline}\n\n`;
    caption += `📲 *Haz tu pedido de inmediato por WhatsApp aquí:* https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}\n\n`;
    caption += `#Ofertas #CompreColombiano #TiendaOnline #${storeName.replace(/\s+/g, "")}`;

    navigator.clipboard.writeText(caption);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl">
      {/* Elemento Canvas Oculto para exportación HD */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Encabezado del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              MÓDULO EXCLUSIVO PLAN EMPRESA / PREMIUM
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Incluido Gratis
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-400 fill-amber-400" /> Generador de Publicidad & Banners HD
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Elige entre 6 plantillas profesionales diseñadas exclusivamente para destacar tus productos en redes sociales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyCaption}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0"
          >
            {copiedText ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-[#60A5FA]" />}
            {copiedText ? "¡Copy Copiado!" : "Copiar Texto de Venta"}
          </button>

          <button
            onClick={handleDownloadBanner}
            disabled={isDownloading}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-500 hover:to-emerald-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 shrink-0"
          >
            {isDownloading ? (
              <Sparkles className="h-4 w-4 animate-spin text-slate-950" />
            ) : (
              <Download className="h-4 w-4 text-slate-950" />
            )}
            {isDownloading ? "Generando HD..." : "Descargar Banner PNG HD"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: CONTROLES Y OPCIONES DE PLANTILLA (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Seleccionar Producto o Subir Foto */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 mb-1 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#0052FF]" /> 1. Seleccionar Producto o Foto
            </h3>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Seleccionar de tus Productos:</label>
              <select
                value={selectedProductId}
                onChange={(e) => handleSelectProduct(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-[#0052FF]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} - {formatCOP(p.price)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">O Subir Foto Personalizada (PNG o JPG):</label>
              <label className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-3 cursor-pointer text-xs font-bold text-purple-400 transition">
                <Upload className="h-4 w-4" /> Subir Imagen de Producto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 2. Galería de 6 Plantillas Publicitarias */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#25D366]" /> 2. Elegir Plantilla Publicitaria
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Plantilla 1: Onda Minimalista */}
              <button
                type="button"
                onClick={() => setSelectedTemplate("minimal-wave")}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedTemplate === "minimal-wave"
                    ? "bg-[#0052FF]/20 border-[#0052FF] text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="h-3 w-3 rounded-full bg-[#82B0BC]" />
                  <span className="font-bold text-xs">🌊 Minimal Wave</span>
                </div>
                <span className="block text-[10px] text-slate-400">Onda Beige & Azul Ocean</span>
              </button>

              {/* Plantilla 2: Yellow Circle */}
              <button
                type="button"
                onClick={() => setSelectedTemplate("yellow-circle")}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedTemplate === "yellow-circle"
                    ? "bg-amber-500/20 border-amber-500 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="font-bold text-xs">💛 Círculo Dorado</span>
                </div>
                <span className="block text-[10px] text-slate-400">Amarillo & Azul Noche</span>
              </button>

              {/* Plantilla 3: Cién Bubbles */}
              <button
                type="button"
                onClick={() => setSelectedTemplate("cyan-bubbles")}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedTemplate === "cyan-bubbles"
                    ? "bg-sky-500/20 border-sky-500 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="h-3 w-3 rounded-full bg-sky-400" />
                  <span className="font-bold text-xs">🩵 Círculos Cién</span>
                </div>
                <span className="block text-[10px] text-slate-400">Nueva Colección Cién</span>
              </button>

              {/* Plantilla 4: Orange Bubbles */}
              <button
                type="button"
                onClick={() => setSelectedTemplate("orange-bubbles")}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedTemplate === "orange-bubbles"
                    ? "bg-orange-500/20 border-orange-500 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="h-3 w-3 rounded-full bg-orange-500" />
                  <span className="font-bold text-xs">🧡 Círculos Naranja</span>
                </div>
                <span className="block text-[10px] text-slate-400">Naranja Fuego & Ámbar</span>
              </button>

              {/* Plantilla 5: Purple Bubbles */}
              <button
                type="button"
                onClick={() => setSelectedTemplate("purple-bubbles")}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedTemplate === "purple-bubbles"
                    ? "bg-purple-500/20 border-purple-500 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="font-bold text-xs">💜 Púrpura Imperial</span>
                </div>
                <span className="block text-[10px] text-slate-400">Violeta VIP Elegante</span>
              </button>

              {/* Plantilla 6: Story Vertical */}
              <button
                type="button"
                onClick={() => setSelectedTemplate("story")}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedTemplate === "story"
                    ? "bg-[#0052FF]/20 border-[#0052FF] text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="h-3 w-3 rounded-full bg-[#0052FF]" />
                  <span className="font-bold text-xs">📱 Estado (9:16)</span>
                </div>
                <span className="block text-[10px] text-slate-400">Formato Vertical HD</span>
              </button>

            </div>
          </div>

          {/* 3. Slider de Tamaño de Imagen */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5"><ZoomIn className="h-3.5 w-3.5 text-[#60A5FA]" /> Ajustar Escala de Foto de Producto:</span>
              <span className="font-mono text-emerald-400">{imageScale}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="140"
              value={imageScale}
              onChange={(e) => setImageScale(Number(e.target.value))}
              className="w-full accent-[#0052FF] cursor-pointer"
            />
          </div>

          {/* 4. Textos y Badges Promocionales */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Tag className="h-4 w-4 text-amber-400" /> 4. Textos y Precios
            </h3>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Sticker / Badge Destacado:</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="Ej: ¡OFERTA POR TIEMPO LIMITADO!"
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-[#0052FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Precio Promocional:</label>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Precio Anterior (Tachado):</label>
                <input
                  type="number"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl p-2.5"
                />
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: PREVISUALIZACIÓN DE LAS PLANTILLAS Y BOTÓN DE DESCARGA (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-between space-y-4">
          
          <div className="w-full text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="h-4 w-4 text-[#60A5FA]" /> Previsualización en Tiempo Real de la Plantilla
            </span>
          </div>

          {/* RENDEREADO DE LA PLANTILLA SELECCIONADA */}
          
          {/* ======================================================== */}
          {/* PLANTILLA 1: MINIMAL WAVE (Onda Beige & Azul) */}
          {/* ======================================================== */}
          {selectedTemplate === "minimal-wave" && (
            <div className="w-full max-w-sm sm:max-w-md aspect-square rounded-3xl p-6 relative overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-r from-[#DBCBBF] via-[#82B0BC] to-[#5496A6] text-slate-950 flex flex-col justify-between">
              
              {/* Encabezado */}
              <div className="text-center relative z-10">
                <h3 className="font-black text-xl sm:text-2xl tracking-tight text-slate-950 uppercase">NUEVO PRODUCTO</h3>
                <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-wider uppercase block mt-0.5">{productTitle}</span>
              </div>

              {/* Foto de Producto Flotante en el Centro */}
              <div className="relative z-10 my-auto flex items-center justify-center">
                {activeImageUrl ? (
                  <img
                    src={activeImageUrl}
                    alt={productTitle}
                    style={{ transform: `scale(${imageScale / 100})` }}
                    className="max-h-48 sm:max-h-56 object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] transition-transform"
                  />
                ) : (
                  <div className="text-xs font-bold text-slate-700">Sin Imagen</div>
                )}
              </div>

              {/* Badge % OFF + Precio Especial */}
              <div className="relative z-10 flex items-center justify-between bg-slate-950 text-white rounded-full p-1.5 shadow-xl border border-slate-800">
                <span className="bg-slate-950 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-full border border-slate-700">
                  {discountPercent}% OFF
                </span>
                <span className="font-bold text-xs sm:text-sm px-4 text-slate-200">
                  Precio Especial: <strong className="text-emerald-400 font-black">{formatCOP(productPrice)}</strong>
                </span>
              </div>

              <div className="text-center relative z-10 mt-2 text-[11px] font-bold text-slate-900">
                Consígalo en /{storeName.toLowerCase().replace(/\s+/g, "")}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* PLANTILLA 2: YELLOW CIRCLE (Dorado & Azul Noche) */}
          {/* ======================================================== */}
          {selectedTemplate === "yellow-circle" && (
            <div className="w-full max-w-sm sm:max-w-md aspect-square rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-2xl border border-amber-500/30 bg-[#091224] text-white flex flex-col justify-between">
              
              {/* Forma amarilla gigante arriba */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#FACC15] rounded-full pointer-events-none" />

              <div className="flex justify-between items-start relative z-10">
                {/* Marco Circular Dorado con la Foto del Producto */}
                <div className="h-44 w-44 sm:h-52 sm:w-52 rounded-full bg-[#FACC15] p-2 shadow-2xl flex items-center justify-center shrink-0">
                  <div className="h-full w-full rounded-full bg-[#091224] overflow-hidden flex items-center justify-center">
                    {activeImageUrl ? (
                      <img
                        src={activeImageUrl}
                        alt={productTitle}
                        style={{ transform: `scale(${imageScale / 100})` }}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-500">Foto</span>
                    )}
                  </div>
                </div>

                {/* Info Derecha: Logo, % OFF y Call to Action */}
                <div className="text-right space-y-2 pt-2 z-10">
                  <div className="bg-[#091224] border border-white/20 px-3 py-1 rounded-xl inline-block font-black text-xs text-white uppercase shadow">
                    {storeName}
                  </div>
                  <div>
                    <span className="text-3xl sm:text-4xl font-black block leading-none text-white">{discountPercent}%</span>
                    <span className="text-xl sm:text-2xl font-black text-[#FACC15]">OFF</span>
                  </div>
                </div>
              </div>

              {/* Sección Inferior de Venta */}
              <div className="relative z-10 space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#FACC15]">OFERTA ESPECIAL</span>
                    <h4 className="font-black text-sm sm:text-base text-white line-clamp-1">{productTitle}</h4>
                  </div>
                  <span className="bg-[#FACC15] text-slate-950 font-black text-xs px-4 py-2 rounded-full shadow-lg">
                    COMPRAR AHORA
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-white/10 text-xs">
                  <span className="font-bold text-slate-300">PEDIR: {whatsapp}</span>
                  <span className="font-mono text-emerald-400 font-bold">{formatCOP(productPrice)}</span>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* PLANTILLAS 3, 4, 5: CÍRCULOS (Cién, Naranja, Púrpura) */}
          {/* ======================================================== */}
          {(selectedTemplate === "cyan-bubbles" || selectedTemplate === "orange-bubbles" || selectedTemplate === "purple-bubbles") && (
            <div className="w-full max-w-sm sm:max-w-md aspect-square rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-2xl border border-slate-300 bg-[#E5E7EB] text-slate-900 flex flex-col justify-between">
              
              {/* Formas circulares según el color del tema */}
              <div 
                className="absolute -top-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
                style={{
                  backgroundColor: selectedTemplate === "cyan-bubbles" 
                    ? "#0EA5E9" 
                    : selectedTemplate === "orange-bubbles" 
                    ? "#F97316" 
                    : "#8B5CF6"
                }}
              />

              <div 
                className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
                style={{
                  backgroundColor: selectedTemplate === "cyan-bubbles" 
                    ? "#0EA5E9" 
                    : selectedTemplate === "orange-bubbles" 
                    ? "#F97316" 
                    : "#8B5CF6"
                }}
              />

              {/* Cabecera NUEVO INGRESO */}
              <div className="relative z-10">
                <span className="font-black text-xl sm:text-2xl text-white block leading-tight">NUEVO</span>
                <span className="font-black text-xl sm:text-2xl text-white block leading-tight">INGRESO</span>
              </div>

              {/* Foto Central del Producto */}
              <div className="relative z-10 my-auto flex items-center justify-center">
                {activeImageUrl ? (
                  <img
                    src={activeImageUrl}
                    alt={productTitle}
                    style={{ transform: `scale(${imageScale / 100})` }}
                    className="max-h-48 sm:max-h-56 object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
                  />
                ) : (
                  <span className="text-xs font-bold text-slate-600">Sin Imagen</span>
                )}
              </div>

              {/* Detalles e Importe Inferior */}
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <h4 className="font-black text-sm sm:text-base text-slate-950 uppercase line-clamp-1">{productTitle}</h4>
                  <span className="font-black text-xl sm:text-2xl block" style={{
                    color: selectedTemplate === "cyan-bubbles" ? "#0EA5E9" : selectedTemplate === "orange-bubbles" ? "#F97316" : "#8B5CF6"
                  }}>
                    {formatCOP(productPrice)}
                  </span>
                </div>

                <div className="bg-white/90 backdrop-blur border border-white p-2.5 rounded-2xl text-center shadow-lg">
                  <span className="font-black text-lg text-slate-950 block">{discountPercent}%</span>
                  <span className="font-bold text-xs text-slate-600 uppercase">OFF</span>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* PLANTILLA 6: STORY VERTICAL (9:16) */}
          {/* ======================================================== */}
          {selectedTemplate === "story" && (
            <div className="w-full max-w-xs sm:max-w-sm aspect-[9/16] rounded-3xl p-5 relative overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-b from-[#09090b] via-[#0052FF] to-[#020617] text-white flex flex-col justify-between">
              
              <div className="text-center relative z-10 space-y-1">
                <span className="font-black text-sm text-white uppercase tracking-wider">{storeName}</span>
                <div className="bg-[#25D366] text-slate-950 font-black text-xs px-3 py-1 rounded-full inline-block shadow">
                  {badgeText}
                </div>
              </div>

              <div className="relative z-10 my-auto flex items-center justify-center">
                {activeImageUrl && (
                  <img
                    src={activeImageUrl}
                    alt={productTitle}
                    style={{ transform: `scale(${imageScale / 100})` }}
                    className="max-h-72 object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]"
                  />
                )}
              </div>

              <div className="bg-slate-950/90 p-4 rounded-2xl text-center border border-white/15 relative z-10 space-y-1.5">
                <h4 className="font-black text-sm text-white">{productTitle}</h4>
                <span className="text-2xl font-black text-[#25D366] block font-mono">{formatCOP(productPrice)}</span>
                <span className="text-[11px] font-bold text-slate-300 block">📲 WhatsApp: {whatsapp}</span>
              </div>

            </div>
          )}

          {/* BOTÓN PROMINENTE DE DESCARGA EN ALTA CALIDAD PNG HD */}
          <button
            onClick={handleDownloadBanner}
            disabled={isDownloading}
            className="w-full max-w-sm sm:max-w-md bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transform hover:scale-[1.02] active:scale-95"
          >
            {isDownloading ? (
              <Sparkles className="h-4 w-4 animate-spin text-slate-950" />
            ) : (
              <Download className="h-4 w-4 text-slate-950" />
            )}
            {isDownloading ? "Generando Imagen PNG HD..." : "Descargar Banner Publicitario (Imagen PNG HD)"}
          </button>

        </div>

      </div>
    </div>
  );
}
