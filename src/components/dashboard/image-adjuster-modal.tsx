"use client";

import { useState, useRef, useEffect } from "react";
import { 
  X, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
  Crop, 
  Maximize2, 
  Sliders,
  HelpCircle,
  Sparkles,
  Upload
} from "lucide-react";

interface ImageAdjusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageFit: "cover" | "contain";
  positionX: number; // 0 to 100
  positionY: number; // 0 to 100
  zoom: number; // 100 to 200
  onSave: (params: {
    imageFit: "cover" | "contain";
    positionX: number;
    positionY: number;
    zoom: number;
  }) => void;
}

export function ImageAdjusterModal({
  isOpen,
  onClose,
  imageUrl,
  imageFit: initialFit,
  positionX: initialX,
  positionY: initialY,
  zoom: initialZoom,
  onSave,
}: ImageAdjusterModalProps) {
  const [fit, setFit] = useState<"cover" | "contain">(initialFit || "cover");
  const [posX, setPosX] = useState<number>(initialX ?? 50);
  const [posY, setPosY] = useState<number>(initialY ?? 50);
  const [zoom, setZoom] = useState<number>(initialZoom ?? 100);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosOnDrag, setInitialPosOnDrag] = useState({ x: 50, y: 50 });

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setFit(initialFit || "cover");
    setPosX(initialX ?? 50);
    setPosY(initialY ?? 50);
    setZoom(initialZoom ?? 100);
  }, [initialFit, initialX, initialY, initialZoom, isOpen]);

  if (!isOpen) return null;

  // Manejo de arrastre interactivo con el ratón / mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosOnDrag({ x: posX, y: posY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Convertir desplazamiento en porcentaje
    const percentX = (deltaX / rect.width) * 100;
    const percentY = (deltaY / rect.height) * 100;

    const newX = Math.min(100, Math.max(0, initialPosOnDrag.x - percentX));
    const newY = Math.min(100, Math.max(0, initialPosOnDrag.y - percentY));

    setPosX(Math.round(newX));
    setPosY(Math.round(newY));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Restablecer valores de fábrica
  const handleReset = () => {
    setFit("cover");
    setPosX(50);
    setPosY(50);
    setZoom(100);
  };

  const handleSaveAndApply = () => {
    onSave({
      imageFit: fit,
      positionX: posX,
      positionY: posY,
      zoom: zoom,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950 border border-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-2xl bg-[#0052FF]/20 text-[#60A5FA] flex items-center justify-center font-bold">
            <Crop className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Ajustar & Posicionar Foto del Producto</h3>
            <p className="text-xs text-slate-400">Arrastra la imagen con el ratón o usa los controles para encuadrarla perfectamente.</p>
          </div>
        </div>

        {/* Marco de Previsualización Interactivo */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Move className="h-3.5 w-3.5 text-[#60A5FA]" /> Haz Clic y Arrastra para Mover la Imagen
            </span>
            <span className="text-[10px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400">
              X: {posX}% | Y: {posY}% | Zoom: {zoom}%
            </span>
          </div>

          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full aspect-[4/3] rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 hover:border-[#0052FF] overflow-hidden relative cursor-grab active:cursor-grabbing select-none shadow-2xl flex items-center justify-center"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Encuadre Producto"
                style={{
                  objectFit: fit,
                  objectPosition: `${posX}% ${posY}%`,
                  transform: `scale(${zoom / 100})`,
                }}
                className="w-full h-full transition-transform duration-75 pointer-events-none"
              />
            ) : (
              <div className="text-slate-500 text-xs">Sin Imagen para Ajustar</div>
            )}

            {/* Retícula de guía de encuadre en tercios */}
            <div className="absolute inset-0 border border-white/10 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-b border-white/10" />
            </div>
          </div>

          {/* Selector de Modo de Ajuste */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFit("cover")}
              className={`p-2.5 rounded-xl border text-left text-xs font-bold transition ${
                fit === "cover"
                  ? "bg-[#0052FF]/20 border-[#0052FF] text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              🖼️ Llenar Recadro (Cover)
              <span className="block text-[10px] font-normal text-slate-400">Cubre la proporción completa</span>
            </button>

            <button
              type="button"
              onClick={() => setFit("contain")}
              className={`p-2.5 rounded-xl border text-left text-xs font-bold transition ${
                fit === "contain"
                  ? "bg-amber-500/20 border-amber-500 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              🔍 Contener Foto Entera (Contain)
              <span className="block text-[10px] font-normal text-slate-400">Sin recortar bordes horizontales</span>
            </button>
          </div>

          {/* Deslizadores Manuales de Zoom y Posición X / Y */}
          <div className="space-y-3 pt-2">
            
            {/* Zoom / Escala */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span className="flex items-center gap-1.5"><ZoomIn className="h-3.5 w-3.5 text-[#60A5FA]" /> Zoom / Escala:</span>
                <span className="font-mono text-emerald-400">{zoom}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="200"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#0052FF] cursor-pointer"
              />
            </div>

            {/* Posición Horizontal (X) */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Posición Horizontal (Izquierda ↔ Derecha):</span>
                <span className="font-mono text-slate-400">{posX}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                className="w-full accent-[#0052FF] cursor-pointer"
              />
            </div>

            {/* Posición Vertical (Y) */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Posición Vertical (Arriba ↕ Abajo):</span>
                <span className="font-mono text-slate-400">{posY}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={posY}
                onChange={(e) => setPosY(Number(e.target.value))}
                className="w-full accent-[#0052FF] cursor-pointer"
              />
            </div>

          </div>

          {/* Especificaciones de Tamaño Recomendado */}
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-3 rounded-xl text-[11px] leading-relaxed flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-[#60A5FA] shrink-0 mt-0.5" />
            <span>
              <strong>💡 Recomendación de Tamaño:</strong> 800 x 800 px (Formato Cuadrado 1:1) o 800 x 600 px (Formato 4:3) en PNG o JPG. Al arrastrar o usar los deslizadores, el encuadre quedará guardado para tu catálogo y la tienda web.
            </span>
          </div>

        </div>

        {/* Acciones Inferiores */}
        <div className="pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restablecer Valores
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="bg-gradient-to-r from-[#0052FF] to-blue-600 hover:from-blue-600 hover:to-[#0052FF] text-white font-black px-6 py-2.5 rounded-xl text-xs transition shadow-lg flex items-center gap-2"
            >
              <Check className="h-4 w-4" /> Guardar Encuadre
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
