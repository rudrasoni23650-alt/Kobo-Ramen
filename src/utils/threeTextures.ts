import * as THREE from 'three';

/**
 * Procedural PBR Texture and Environment Generator for Ultra-Realistic 3D Ramen & Kitchen Assets.
 * All textures are generated via HTML5 Canvas with zero external network dependencies,
 * providing instant loading, high detail, micro-surface relief, and physical realism.
 */

// Helper to create a CanvasTexture with optimal filtering
function makeCanvasTexture(canvas: HTMLCanvasElement, repeatX = 1, repeatY = 1): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * 1. PHOTOREALISTIC STUDIO ENVIRONMENT MAP
 * Uses PMREMGenerator to bake a balanced high-contrast food photography lighting environment.
 * Surfaces reflect warm overhead softboxes, dark wood surroundings, and subtle cool rim lights.
 */
export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const scene = new THREE.Scene();

  // Dark moody studio ambient dome
  const domeGeo = new THREE.SphereGeometry(20, 32, 16);
  const domeMat = new THREE.MeshBasicMaterial({
    color: 0x050508,
    side: THREE.BackSide,
  });
  scene.add(new THREE.Mesh(domeGeo, domeMat));

  // Overhead Key Softbox (Warm 3400K food-photography lightbox)
  const softboxGeo = new THREE.PlaneGeometry(12, 12);
  const softboxMat = new THREE.MeshBasicMaterial({
    color: 0xffeedd,
    side: THREE.DoubleSide,
  });
  const softbox = new THREE.Mesh(softboxGeo, softboxMat);
  softbox.position.set(0, 9, 2);
  softbox.rotation.x = Math.PI / 2.2;
  scene.add(softbox);

  // Warm Wooden Accent Bounce (Izakaya cedar bounce reflection)
  const bounceGeo = new THREE.PlaneGeometry(16, 8);
  const bounceMat = new THREE.MeshBasicMaterial({
    color: 0x5a2d16,
    side: THREE.DoubleSide,
  });
  const bounce = new THREE.Mesh(bounceGeo, bounceMat);
  bounce.position.set(6, 3, -4);
  bounce.rotation.y = -Math.PI / 3;
  scene.add(bounce);

  // Cool Specular Rim Reflector (Tokyo dusk accent for glaze highlights)
  const rimGeo = new THREE.PlaneGeometry(10, 8);
  const rimMat = new THREE.MeshBasicMaterial({
    color: 0x2563eb,
    side: THREE.DoubleSide,
  });
  const rimReflector = new THREE.Mesh(rimGeo, rimMat);
  rimReflector.position.set(-7, 4, -5);
  rimReflector.rotation.y = Math.PI / 3;
  scene.add(rimReflector);

  // Golden Ember Glow from below
  const emberGeo = new THREE.PlaneGeometry(10, 6);
  const emberMat = new THREE.MeshBasicMaterial({
    color: 0xd97706,
    side: THREE.DoubleSide,
  });
  const emberMesh = new THREE.Mesh(emberGeo, emberMat);
  emberMesh.position.set(0, -5, 4);
  emberMesh.rotation.x = -Math.PI / 3;
  scene.add(emberMesh);

  const envMap = pmremGenerator.fromScene(scene, 0.04);
  pmremGenerator.dispose();
  return envMap;
}

/**
 * 2. AUTHENTIC JAPANESE STONEWARE CERAMIC TEXTURE (Bizen-yaki / Tenmoku Glaze)
 * Features tactile clay speckles, iron-sand flecks, subtle potter's wheel throwing grooves,
 * and high-temperature kiln glaze gradation.
 */
export function createCeramicTextures(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;

  // Base deep charcoal iron-clay gradient
  const baseGrad = ctx.createLinearGradient(0, 0, 0, size);
  baseGrad.addColorStop(0, '#101014'); // Rim
  baseGrad.addColorStop(0.35, '#16161b'); // Body mid
  baseGrad.addColorStop(0.7, '#121216'); // Body low
  baseGrad.addColorStop(1, '#0b0b0e'); // Foot ring
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, size, size);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);

  // Concentric potter's wheel throwing rings (horizontal micro-grooves)
  for (let y = 0; y < size; y += 4) {
    const wave = Math.sin(y * 0.08) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${wave * 0.025})`;
    ctx.fillRect(0, y, size, 2);

    bctx.fillStyle = `rgba(0, 0, 0, ${wave * 0.08})`;
    bctx.fillRect(0, y, size, 2);
  }

  // Iron sand and feldspar speckles (Tenmoku stoneware inclusions)
  const speckleCount = 4000;
  for (let i = 0; i < speckleCount; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2.2 + 0.5;
    const isBright = Math.random() > 0.65;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = isBright
      ? `rgba(215, 185, 145, ${Math.random() * 0.25 + 0.05})` // Feldspar granule
      : `rgba(15, 15, 18, ${Math.random() * 0.4 + 0.15})`; // Iron fleck
    ctx.fill();

    bctx.beginPath();
    bctx.arc(x, y, r, 0, Math.PI * 2);
    bctx.fillStyle = isBright ? '#b0b0b0' : '#505050';
    bctx.fill();
  }

  // Subtle warm reactive glaze halo near rim (iron reduction)
  const rimGrad = ctx.createLinearGradient(0, 0, 0, size * 0.18);
  rimGrad.addColorStop(0, 'rgba(180, 110, 50, 0.22)');
  rimGrad.addColorStop(1, 'rgba(180, 110, 50, 0)');
  ctx.fillStyle = rimGrad;
  ctx.fillRect(0, 0, size, size * 0.18);

  return {
    map: makeCanvasTexture(canvas, 2, 1),
    bumpMap: makeCanvasTexture(bumpCanvas, 2, 1),
  };
}

/**
 * 3. 24-HOUR EMULSIFIED TONKOTSU BROTH SURFACE TEXTURE
 * Rich golden amber broth with floating collagen droplets (chiyu / pork fat)
 * and natural surface tension clustering.
 */
export function createBrothTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;

  // Radial rich tonkotsu broth gradient (deep amber in center, warm golden near edges)
  const center = size / 2;
  const brothGrad = ctx.createRadialGradient(center, center, 40, center, center, size * 0.48);
  brothGrad.addColorStop(0, '#b45309'); // deep savory core
  brothGrad.addColorStop(0.5, '#c26a15'); // emulsified body
  brothGrad.addColorStop(0.85, '#d97706'); // golden fat glow
  brothGrad.addColorStop(1, '#92400e'); // edge meniscus
  ctx.fillStyle = brothGrad;
  ctx.fillRect(0, 0, size, size);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);

  // Fluid broth vortex swirls
  for (let s = 0; s < 12; s++) {
    const angle = (s / 12) * Math.PI * 2;
    const r1 = 80 + Math.random() * 250;
    const r2 = r1 + 80 + Math.random() * 100;
    ctx.beginPath();
    ctx.arc(
      center + Math.cos(angle) * 40,
      center + Math.sin(angle) * 40,
      r1,
      angle,
      angle + Math.PI * 0.7
    );
    ctx.strokeStyle = 'rgba(254, 215, 170, 0.12)';
    ctx.lineWidth = 14;
    ctx.stroke();

    bctx.beginPath();
    bctx.arc(
      center + Math.cos(angle) * 40,
      center + Math.sin(angle) * 40,
      r1,
      angle,
      angle + Math.PI * 0.7
    );
    bctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    bctx.lineWidth = 14;
    bctx.stroke();
  }

  // Floating collagen & rendered fat globules of varying sizes
  const fatCount = 350;
  for (let f = 0; f < fatCount; f++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.sqrt(Math.random()) * (size * 0.44);
    const x = center + Math.cos(angle) * dist;
    const y = center + Math.sin(angle) * dist;
    const rad = Math.random() * 7 + 2;

    // Outer fat drop ring (liquid meniscus)
    const fatGrad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    fatGrad.addColorStop(0, 'rgba(255, 248, 220, 0.75)'); // bright core
    fatGrad.addColorStop(0.6, 'rgba(253, 230, 138, 0.55)');
    fatGrad.addColorStop(0.9, 'rgba(180, 83, 9, 0.35)'); // shadow rim
    fatGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = fatGrad;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();

    // Specular bump dome
    const bGrad = bctx.createRadialGradient(x, y, 0, x, y, rad);
    bGrad.addColorStop(0, '#ffffff');
    bGrad.addColorStop(0.7, '#a0a0a0');
    bGrad.addColorStop(1, '#808080');
    bctx.fillStyle = bGrad;
    bctx.beginPath();
    bctx.arc(x, y, rad, 0, Math.PI * 2);
    bctx.fill();
  }

  return {
    map: makeCanvasTexture(canvas),
    bumpMap: makeCanvasTexture(bumpCanvas),
  };
}

/**
 * 4. TORCHED KUROBUTA CHASHU PORK TEXTURE
 * Authentic slow-braised rolled pork belly slice with:
 * - Caramelized outer tare crust with charred aburi torch markings
 * - Tender succulent braised pork muscle striations
 * - Melt-in-mouth gelatinous pork fat bands
 * - High-gloss tare glaze specular sheen
 */
export function createChashuTextures(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;

  const center = size / 2;
  const maxR = size * 0.46;

  // Background transparency
  ctx.clearRect(0, 0, size, size);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);

  // Outer braised soy crust base
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, maxR, 0, Math.PI * 2);
  ctx.fillStyle = '#542013'; // deep caramelized soy tare
  ctx.fill();

  // Spiral pork belly rolled bands (alternating lean meat and rich fat)
  const bands = 7;
  for (let b = bands; b >= 1; b--) {
    const r = (b / bands) * maxR * 0.94;
    const isFat = b % 2 === 1;

    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    if (isFat) {
      // Succulent rendered white fat marbling
      const fatGrad = ctx.createRadialGradient(center, center, r * 0.8, center, center, r);
      fatGrad.addColorStop(0, '#fef9ee');
      fatGrad.addColorStop(0.7, '#fef3c7');
      fatGrad.addColorStop(1, '#e5d5b5');
      ctx.fillStyle = fatGrad;
    } else {
      // Tender braised pork muscle fibers
      const meatGrad = ctx.createRadialGradient(center, center, r * 0.8, center, center, r);
      meatGrad.addColorStop(0, '#853e28');
      meatGrad.addColorStop(0.6, '#732e19');
      meatGrad.addColorStop(1, '#5a2211');
      ctx.fillStyle = meatGrad;
    }
    ctx.fill();
  }

  // Pork muscle grain striations (radial fibrous streaks)
  for (let a = 0; a < 180; a++) {
    const rad = (a / 180) * Math.PI * 2;
    const len1 = maxR * 0.25 + Math.random() * 20;
    const len2 = maxR * 0.88 + Math.random() * 25;
    ctx.beginPath();
    ctx.moveTo(center + Math.cos(rad) * len1, center + Math.sin(rad) * len1);
    ctx.lineTo(center + Math.cos(rad) * len2, center + Math.sin(rad) * len2);
    ctx.strokeStyle = a % 3 === 0 ? 'rgba(74, 28, 16, 0.4)' : 'rgba(254, 243, 199, 0.25)';
    ctx.lineWidth = Math.random() * 2.5 + 0.8;
    ctx.stroke();

    // Meat texture in bump map
    bctx.beginPath();
    bctx.moveTo(center + Math.cos(rad) * len1, center + Math.sin(rad) * len1);
    bctx.lineTo(center + Math.cos(rad) * len2, center + Math.sin(rad) * len2);
    bctx.strokeStyle = a % 2 === 0 ? '#989898' : '#686868';
    bctx.lineWidth = 2;
    bctx.stroke();
  }

  // Torched Char Marks (Aburi searing lines across the slice)
  const torchMarks = [-0.6, -0.2, 0.15, 0.55];
  torchMarks.forEach((offset) => {
    const yLine = center + offset * maxR;
    const grad = ctx.createLinearGradient(0, yLine - 14, 0, yLine + 14);
    grad.addColorStop(0, 'rgba(20, 10, 5, 0)');
    grad.addColorStop(0.5, 'rgba(15, 6, 2, 0.88)'); // charred black
    grad.addColorStop(0.8, 'rgba(90, 30, 10, 0.55)'); // golden crust
    grad.addColorStop(1, 'rgba(20, 10, 5, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(center - maxR * 0.85, yLine - 12, maxR * 1.7, 24);

    bctx.fillStyle = '#404040';
    bctx.fillRect(center - maxR * 0.85, yLine - 10, maxR * 1.7, 20);
  });

  // Torched char speckles and bubbling glaze flecks
  for (let c = 0; c < 90; c++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * maxR * 0.85;
    const x = center + Math.cos(angle) * dist;
    const y = center + Math.sin(angle) * dist;
    const r = Math.random() * 3 + 1;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.4 ? 'rgba(10, 5, 2, 0.85)' : 'rgba(245, 158, 11, 0.7)';
    ctx.fill();

    bctx.beginPath();
    bctx.arc(x, y, r, 0, Math.PI * 2);
    bctx.fillStyle = '#303030';
    bctx.fill();
  }

  // Outer caramelized tare edge rim
  ctx.beginPath();
  ctx.arc(center, center, maxR, 0, Math.PI * 2);
  ctx.strokeStyle = '#2d1008';
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.restore();

  return {
    map: makeCanvasTexture(canvas),
    bumpMap: makeCanvasTexture(bumpCanvas),
  };
}

/**
 * 5. MARINATED AJITAMA SOFT-BOILED EGG TEXTURE
 * Features:
 * - Soy tare marinated golden-amber outer gradient on egg white
 * - Silky porcelain-smooth interior white
 * - Molten, jammy sunset-orange custard yolk with glossy liquid center
 */
export function createAjitamaTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const center = size / 2;
  const eggR = size * 0.47;

  // Outer egg white with tare marinade rim
  const whiteGrad = ctx.createRadialGradient(center, center, eggR * 0.5, center, center, eggR);
  whiteGrad.addColorStop(0, '#fffaed'); // silky pristine egg white
  whiteGrad.addColorStop(0.72, '#fef3c7');
  whiteGrad.addColorStop(0.9, '#d4a373'); // soy sauce marinade gradient
  whiteGrad.addColorStop(1, '#99582a'); // rich tare edge
  ctx.fillStyle = whiteGrad;
  ctx.beginPath();
  ctx.arc(center, center, eggR, 0, Math.PI * 2);
  ctx.fill();

  // Yolk margin (set translucent custard ring)
  const yolkR = eggR * 0.58;
  const yolkGrad = ctx.createRadialGradient(center, center, 10, center, center, yolkR);
  yolkGrad.addColorStop(0, '#ea580c'); // molten sunset core
  yolkGrad.addColorStop(0.35, '#f97316'); // rich golden yolk
  yolkGrad.addColorStop(0.75, '#fb923c'); // custard cream
  yolkGrad.addColorStop(0.96, '#fde047'); // tender cooked ring
  yolkGrad.addColorStop(1, '#ca8a04'); // boundary rim
  ctx.fillStyle = yolkGrad;
  ctx.beginPath();
  ctx.arc(center, center, yolkR, 0, Math.PI * 2);
  ctx.fill();

  // Jammy yolk glossy liquid highlights
  ctx.beginPath();
  ctx.arc(center - yolkR * 0.25, center - yolkR * 0.25, yolkR * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 237, 213, 0.4)';
  ctx.fill();

  return makeCanvasTexture(canvas);
}

/**
 * 6. ARIAKE SEAWEED (NORI) TEXTURE
 * Dense charcoal-emerald pressed seaweed fibers with matte roasted crisp finish.
 */
export function createNoriTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;

  // Deep obsidian-emerald base
  ctx.fillStyle = '#0f1712';
  ctx.fillRect(0, 0, size, size);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);

  // Woven seaweed fiber grid (sheets pressed on bamboo mats)
  for (let i = 0; i < size; i += 6) {
    ctx.fillStyle = i % 12 === 0 ? 'rgba(22, 40, 28, 0.5)' : 'rgba(10, 18, 12, 0.5)';
    ctx.fillRect(i, 0, 3, size);
    ctx.fillRect(0, i, size, 3);

    bctx.fillStyle = i % 12 === 0 ? '#9a9a9a' : '#686868';
    bctx.fillRect(i, 0, 2, size);
    bctx.fillRect(0, i, size, 2);
  }

  // Roasted seaweed microscopic bubbles & flecks
  for (let n = 0; n < 3000; n++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.8 + 0.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.6 ? 'rgba(34, 60, 42, 0.45)' : 'rgba(5, 8, 6, 0.7)';
    ctx.fill();

    bctx.beginPath();
    bctx.arc(x, y, r, 0, Math.PI * 2);
    bctx.fillStyle = Math.random() > 0.5 ? '#b0b0b0' : '#404040';
    bctx.fill();
  }

  return {
    map: makeCanvasTexture(canvas, 2, 2),
    bumpMap: makeCanvasTexture(bumpCanvas, 2, 2),
  };
}

/**
 * 7. AUTHENTIC NARUTOMAKI SWIRL TEXTURE
 * Fluted steamed surimi fish cake with hand-painted crimson-pink spiral swirl.
 */
export function createNarutoTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const center = size / 2;
  const r = size * 0.46;

  // Steamed fish cake silky white base
  ctx.fillStyle = '#fffdfa';
  ctx.beginPath();
  ctx.arc(center, center, r, 0, Math.PI * 2);
  ctx.fill();

  // Subtle surimi protein grain
  for (let i = 0; i < 600; i++) {
    const rx = center + (Math.random() - 0.5) * r * 1.8;
    const ry = center + (Math.random() - 0.5) * r * 1.8;
    ctx.fillStyle = 'rgba(240, 235, 230, 0.6)';
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Crimson/pink spiral swirl
  ctx.beginPath();
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 26;
  ctx.lineCap = 'round';

  const spiralTurns = 2.4;
  for (let t = 0; t <= spiralTurns * Math.PI * 2; t += 0.05) {
    const rad = 14 + t * 14;
    const x = center + Math.cos(t) * rad;
    const y = center + Math.sin(t) * rad;
    if (t === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Delicate pink feathering around spiral
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
  ctx.lineWidth = 38;
  ctx.stroke();

  return makeCanvasTexture(canvas);
}

/**
 * 8. SLATE / CHARRED CEDAR (YAKISUGI) PEDESTAL TEXTURE
 */
export function createPedestalTextures(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;

  ctx.fillStyle = '#141417';
  ctx.fillRect(0, 0, size, size);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);

  // Longitudinal wood grain / slate cleavage lines
  for (let x = 0; x < size; x += 3) {
    const wave = Math.sin(x * 0.04) * 0.5 + Math.cos(x * 0.015) * 0.5;
    ctx.fillStyle = `rgba(32, 32, 38, ${wave * 0.4})`;
    ctx.fillRect(x, 0, 2, size);

    bctx.fillStyle = `rgba(${wave > 0 ? 200 : 80}, ${wave > 0 ? 200 : 80}, ${wave > 0 ? 200 : 80}, 0.25)`;
    bctx.fillRect(x, 0, 2, size);
  }

  // Fine stone/charcoal grain
  for (let i = 0; i < 4000; i++) {
    const gx = Math.random() * size;
    const gy = Math.random() * size;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(45, 45, 52, 0.6)' : 'rgba(8, 8, 10, 0.7)';
    ctx.fillRect(gx, gy, 2, 2);

    bctx.fillStyle = Math.random() > 0.5 ? '#959595' : '#656565';
    bctx.fillRect(gx, gy, 2, 2);
  }

  return {
    map: makeCanvasTexture(canvas, 3, 3),
    bumpMap: makeCanvasTexture(bumpCanvas, 3, 3),
  };
}

/**
 * 9. KISHU BINCHOTAN CHARCOAL TEXTURE FOR KITCHEN HEARTH
 * Authentic cracked white oak charcoal bark with cold grey ash crust,
 * fissures, and deep glowing incandescent core cracks.
 */
export function createBinchotanTextures(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  emissiveMap: THREE.CanvasTexture;
} {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;

  const emCanvas = document.createElement('canvas');
  emCanvas.width = size;
  emCanvas.height = size;
  const emctx = emCanvas.getContext('2d')!;

  // Deep matte charcoal black
  ctx.fillStyle = '#0f0f10';
  ctx.fillRect(0, 0, size, size);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);

  emctx.fillStyle = '#000000';
  emctx.fillRect(0, 0, size, size);

  // Deep longitudinal fissures and bark splits
  for (let y = 30; y < size; y += 45 + Math.random() * 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 30) {
      ctx.lineTo(x, y + (Math.random() - 0.5) * 16);
    }
    ctx.strokeStyle = '#050505';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Deep crevice in bump map
    bctx.beginPath();
    bctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 30) {
      bctx.lineTo(x, y + (Math.random() - 0.5) * 16);
    }
    bctx.strokeStyle = '#202020';
    bctx.lineWidth = 8;
    bctx.stroke();

    // Red-hot incandescent glow emanating from internal fissure
    emctx.beginPath();
    emctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 30) {
      emctx.lineTo(x, y + (Math.random() - 0.5) * 16);
    }
    emctx.strokeStyle = '#ff4500';
    emctx.lineWidth = 8;
    emctx.stroke();

    emctx.strokeStyle = '#ffd700';
    emctx.lineWidth = 3;
    emctx.stroke();
  }

  // Ash-dusted grey patches on cooler outer surface
  for (let p = 0; p < 12; p++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const pr = 20 + Math.random() * 45;
    const ashGrad = ctx.createRadialGradient(px, py, 0, px, py, pr);
    ashGrad.addColorStop(0, 'rgba(160, 160, 165, 0.45)');
    ashGrad.addColorStop(1, 'rgba(160, 160, 165, 0)');
    ctx.fillStyle = ashGrad;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  return {
    map: makeCanvasTexture(canvas, 1, 2),
    bumpMap: makeCanvasTexture(bumpCanvas, 1, 2),
    emissiveMap: makeCanvasTexture(emCanvas, 1, 2),
  };
}

/**
 * 10. SOFT CONTACT SHADOW TEXTURE
 * Creates realistic, physically grounded contact ambient occlusion beneath objects.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const center = size / 2;
  const grad = ctx.createRadialGradient(center, center, 0, center, center, center * 0.95);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.55)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.18)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  return makeCanvasTexture(canvas);
}
