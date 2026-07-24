const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 1. SVG para og-image.png (1200x630)
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo Oscuro de Alta Calidad con Gradiente -->
  <rect width="1200" height="630" fill="#07090E"/>
  <rect x="20" y="20" width="1160" height="590" rx="30" fill="#0F172A" stroke="#0052FF" stroke-width="4"/>

  <!-- Brillo Azul Flotante -->
  <circle cx="600" cy="220" r="180" fill="#0052FF" fill-opacity="0.15" filter="blur(60px)"/>

  <!-- Logo V W -->
  <g transform="translate(420, 90) scale(0.75)">
    <!-- V (Blanco Puro) -->
    <path d="M 50 30 L 140 30 L 210 230 L 160 230 Z" fill="#FFFFFF"/>
    <path d="M 255 30 L 160 230 L 210 230 Z" fill="#FFFFFF"/>
    
    <!-- W (Azul Eléctrico #0052FF) -->
    <path d="M 200 30 L 250 30 L 295 170 L 340 30 L 390 30 L 320 230 L 270 230 Z" fill="#0052FF"/>
  </g>

  <!-- Título VISIONWEB -->
  <text x="600" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="64" letter-spacing="14" fill="#FFFFFF">
    VISION<tspan fill="#0052FF">WEB</tspan>
  </text>

  <!-- Subtítulo -->
  <text x="600" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="28" fill="#94A3B8">
    Plataforma SaaS E-commerce LatAm • Tiendas Virtuales
  </text>

  <!-- Badge WhatsApp -->
  <rect x="360" y="490" width="480" height="54" rx="27" fill="#25D366" fill-opacity="0.15" stroke="#25D366" stroke-width="2"/>
  <text x="600" y="526" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="22" fill="#25D366">
    Ventas Directas por WhatsApp • visionwebproductos.lat
  </text>
</svg>
`;

// 2. SVG para vw-logo.png y favicon.png (512x512)
const logoSquareSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#07090E"/>
  <rect x="16" y="16" width="480" height="480" rx="96" fill="#0F172A" stroke="#0052FF" stroke-width="8"/>
  
  <g transform="translate(36, 120) scale(0.9)">
    <!-- V (Blanco Puro) -->
    <path d="M 50 30 L 140 30 L 210 230 L 160 230 Z" fill="#FFFFFF"/>
    <path d="M 255 30 L 160 230 L 210 230 Z" fill="#FFFFFF"/>
    
    <!-- W (Azul Eléctrico #0052FF) -->
    <path d="M 200 30 L 250 30 L 295 170 L 340 30 L 390 30 L 320 230 L 270 230 Z" fill="#0052FF"/>
  </g>
</svg>
`;

async function main() {
  const publicDir = path.join(__dirname, 'public');
  
  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✅ og-image.png generado con éxito');

  await sharp(Buffer.from(logoSquareSvg))
    .png()
    .toFile(path.join(publicDir, 'vw-logo.png'));
  console.log('✅ vw-logo.png generado con éxito');

  await sharp(Buffer.from(logoSquareSvg))
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✅ favicon.png generado con éxito');
}

main().catch(console.error);
