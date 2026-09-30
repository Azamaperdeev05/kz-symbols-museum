import * as THREE from 'three';

/**
 * Creates an in-memory CanvasTexture fallback for any exhibit.
 * If the image file is missing or fails to load, this beautiful placeholder
 * is displayed seamlessly without crashing the 3D application.
 */
export function createFallbackCanvasTexture(title, subtitle = 'Мемлекеттік рәміз') {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.Texture();

  // Background gradient: deep museum blue
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
  bgGrad.addColorStop(0, '#06162a');
  bgGrad.addColorStop(0.5, '#0b294a');
  bgGrad.addColorStop(1, '#04101e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Outer gold museum border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 14;
  ctx.strokeRect(40, 40, 944, 944);

  // Inner thin gold border
  ctx.strokeStyle = '#f5d77f';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, 904, 904);

  // Corner decorative accents
  const corners = [
    [70, 70],
    [954, 70],
    [70, 954],
    [954, 954]
  ];
  ctx.fillStyle = '#f5d77f';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
  });

  // Stylized central emblem/sun placeholder
  ctx.save();
  ctx.translate(512, 440);

  // Sun halo
  const sunGrad = ctx.createRadialGradient(0, 0, 30, 0, 0, 180);
  sunGrad.addColorStop(0, '#ffe066');
  sunGrad.addColorStop(0.6, '#d4af37');
  sunGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 180, 0, Math.PI * 2);
  ctx.fill();

  // Central Sun
  ctx.fillStyle = '#fec400';
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, Math.PI * 2);
  ctx.fill();

  // Radiating rays
  ctx.strokeStyle = '#fec400';
  ctx.lineWidth = 6;
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI * 2) / 24;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 85, Math.sin(angle) * 85);
    ctx.lineTo(Math.cos(angle) * 125, Math.sin(angle) * 125);
    ctx.stroke();
  }
  ctx.restore();

  // Text title
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Subtitle
  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(subtitle.toUpperCase(), 512, 690);

  // Main Exhibit Title
  ctx.font = 'bold 54px "Outfit", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(title, 512, 760);

  // Note for school students
  ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#d4af37';
  ctx.fillText('Қазақстан Республикасы', 512, 840);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Fallback SVG Data URL for 2D <img> tags
 */
export function getFallbackDataUri(title) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#091e36"/>
    <rect x="15" y="15" width="370" height="270" fill="none" stroke="#d4af37" stroke-width="3"/>
    <circle cx="200" cy="120" r="45" fill="#fec400"/>
    <text x="200" y="210" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${title}</text>
    <text x="200" y="240" fill="#94a3b8" font-family="sans-serif" font-size="14" text-anchor="middle">ҚР Мемлекеттік рәмізі</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
