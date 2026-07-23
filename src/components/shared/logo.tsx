import React from "react";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  showText?: boolean;
}

export function Logo({ className = "h-10", variant = "dark", showText = true }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Container con sombra sutil y borde glow */}
      <div className="h-full aspect-[3/2] flex items-center justify-center">
        <svg
          viewBox="0 0 480 300"
          className="h-full w-auto drop-shadow-[0_2px_10px_rgba(0,52,255,0.2)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* V (Blanco en Dark Mode, Negro en Light Mode) */}
          <path
            d="M 50 30 L 140 30 L 210 230 L 160 230 Z"
            fill={variant === "dark" ? "#FFFFFF" : "#09090B"}
          />
          <path
            d="M 255 30 L 160 230 L 210 230 Z"
            fill={variant === "dark" ? "#FFFFFF" : "#09090B"}
          />

          {/* W (Azul Eléctrico #0052FF brillante con gradiente) */}
          <defs>
            <linearGradient id="blueGradient" x1="200" y1="30" x2="390" y2="230" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#0052FF" />
            </linearGradient>
          </defs>
          <path
            d="M 200 30 L 250 30 L 295 170 L 340 30 L 390 30 L 320 230 L 270 230 Z"
            fill="url(#blueGradient)"
          />

          {/* Texto VISION WEB */}
          {showText && (
            <>
              <text
                x="45"
                y="282"
                fontFamily="'Inter', system-ui, -apple-system, sans-serif"
                fontWeight="900"
                fontSize="32"
                letterSpacing="11"
                fill={variant === "dark" ? "#FFFFFF" : "#09090B"}
              >
                VISION
              </text>
              <text
                x="290"
                y="282"
                fontFamily="'Inter', system-ui, -apple-system, sans-serif"
                fontWeight="900"
                fontSize="32"
                letterSpacing="11"
                fill="url(#blueGradient)"
              >
                WEB
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
