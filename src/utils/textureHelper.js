import * as THREE from 'three';

/**
 * Creates a stylized museum plaque CanvasTexture for the State Anthem.
 * As specified in the brief: "The anthem has no photo: render a stylized plaque (blue and gold, music-note icon)."
 */
export function createAnthemPlaqueTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.Texture();

  // 1. Royal blue velvet gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1280);
  bgGrad.addColorStop(0, '#06162a');
  bgGrad.addColorStop(0.35, '#0c2e55');
  bgGrad.addColorStop(0.7, '#071f3b');
  bgGrad.addColorStop(1, '#030d1a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1280);

  // 2. Subtle radial glow behind the center
  const glow = ctx.createRadialGradient(512, 480, 50, 512, 480, 420);
  glow.addColorStop(0, 'rgba(254, 196, 0, 0.22)');
  glow.addColorStop(0.5, 'rgba(0, 175, 202, 0.12)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(512, 480, 420, 0, Math.PI * 2);
  ctx.fill();

  // 3. Gold ornate borders
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 14;
  ctx.strokeRect(40, 40, 944, 1200);

  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 3;
  ctx.strokeRect(62, 62, 900, 1156);

  // Decorative corner studs
  const corners = [
    [75, 75],
    [949, 75],
    [75, 1205],
    [949, 1205]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = '#fec400';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#06162a';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Stylized Music Note & Clef Medallion
  ctx.save();
  ctx.translate(512, 340);

  // Outer medallion ring
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 140, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 152, 0, Math.PI * 2);
  ctx.stroke();

  // Medallion inner fill
  const medGrad = ctx.createLinearGradient(0, -140, 0, 140);
  medGrad.addColorStop(0, '#0a2544');
  medGrad.addColorStop(1, '#051426');
  ctx.fillStyle = medGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 137, 0, Math.PI * 2);
  ctx.fill();

  // Draw stylized musical notes icon (♫)
  ctx.fillStyle = '#fec400';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 150px serif';
  ctx.fillText('♫', 0, -10);
  ctx.restore();

  // 5. Typography on the Plaque
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Eyebrow
  ctx.font = '700 30px "Outfit", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('ҚАЗАҚСТАН РЕСПУБЛИКАСЫ', 512, 570);

  // Main Header
  ctx.font = '800 46px "Outfit", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('МЕМЛЕКЕТТІК ГИМНІ', 512, 630);

  // Anthem Title
  ctx.font = '800 58px "Outfit", sans-serif';
  ctx.fillStyle = '#fec400';
  ctx.fillText('«МЕНІҢ ҚАЗАҚСТАНЫМ»', 512, 720);

  // Divider line with diamond
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(220, 780);
  ctx.lineTo(804, 780);
  ctx.stroke();

  ctx.fillStyle = '#fec400';
  ctx.beginPath();
  ctx.arc(512, 780, 8, 0, Math.PI * 2);
  ctx.fill();

  // Authors & Historical Info
  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('Музыкасы – Шәмші Қалдаяқов', 512, 850);
  ctx.fillText('Сөзі – Жұмекен Нәжімеденов', 512, 905);

  // Year Badge
  ctx.font = '700 28px "Outfit", sans-serif';
  ctx.fillStyle = '#00afca';
  ctx.fillText('2006 жылғы 6 қаңтарда бекітілген', 512, 990);
  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('(түпнұсқа ән – 1956 жыл)', 512, 1030);

  // Footer emblem line
  ctx.font = '600 22px "Outfit", sans-serif';
  ctx.fillStyle = '#d4af37';
  ctx.fillText('МҰРАЖАЙ ЭКСПОЗИЦИЯСЫ • ДЕРЕККӨЗ: AKORDA.KZ', 512, 1140);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates an in-memory CanvasTexture fallback for any missing exhibit photo.
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

  const sunGrad = ctx.createRadialGradient(0, 0, 30, 0, 0, 180);
  sunGrad.addColorStop(0, '#ffe066');
  sunGrad.addColorStop(0.6, '#d4af37');
  sunGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 180, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fec400';
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, Math.PI * 2);
  ctx.fill();

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

  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(subtitle.toUpperCase(), 512, 690);

  ctx.font = 'bold 54px "Outfit", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(title, 512, 760);

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
