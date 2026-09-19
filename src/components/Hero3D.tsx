import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { audioManager } from '../utils/audio';
import { Sparkles, ArrowDown } from 'lucide-react';
import { useMagnetic } from '../utils/useMagnetic';
import { smoothScrollTo } from './SmoothScroll';
import {
  createStudioEnvironment,
  createCeramicTextures,
  createBrothTexture,
  createChashuTextures,
  createAjitamaTexture,
  createNoriTexture,
  createPedestalTextures,
  createContactShadowTexture,
} from '../utils/threeTextures';

interface Hero3DProps {
  onExploreClick: () => void;
}

export function Hero3D({ onExploreClick }: Hero3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorialRef = useRef<HTMLDivElement>(null);
  const kanji1Ref = useRef<HTMLDivElement>(null);
  const kanji2Ref = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const scrollBtnRef = useRef<HTMLButtonElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const exploreMagnetic = useMagnetic<HTMLButtonElement>(0.25, 7);
  const deconstructMagnetic = useMagnetic<HTMLAnchorElement>(0.25, 7);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060608, 0.16);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.75, 3.6);

    const baseCameraPos = new THREE.Vector3(0, 1.75, 3.6);
    const targetCameraPos = new THREE.Vector3(0, 1.75, 3.6);
    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentScrollProgress = 0;

    // 2. High-Performance WebGL Renderer with PBR Pipeline
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // --- Studio Environment Map (IBL) ---
    const envTarget = createStudioEnvironment(renderer);
    scene.environment = envTarget.texture;

    // --- Procedural High-Definition Textures ---
    const ceramicTextures = createCeramicTextures();
    const brothTextures = createBrothTexture();
    const chashuTextures = createChashuTextures();
    const ajitamaTexture = createAjitamaTexture();
    const noriTextures = createNoriTexture();
    const pedestalTextures = createPedestalTextures();
    const contactShadowTexture = createContactShadowTexture();

    // 3. Atmospheric Photographic Lighting (Cinematic Chiaroscuro)
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.28);
    scene.add(ambientLight);

    // Overhead Key Food Spotlight focused squarely into the bowl
    const topSpot = new THREE.SpotLight(0xfff1e0, 5.5, 16, Math.PI / 3.8, 0.55, 1.3);
    topSpot.position.set(0, 4.0, 0.4);
    topSpot.target.position.set(0, -0.32, 0);
    topSpot.castShadow = true;
    topSpot.shadow.mapSize.set(512, 512);
    topSpot.shadow.bias = -0.0008;
    topSpot.shadow.radius = 1.5;
    scene.add(topSpot);
    scene.add(topSpot.target);

    // Warm Japanese washi lantern overhead
    const lanternLight = new THREE.PointLight(0xf59e0b, 3.8, 16, 1.8);
    lanternLight.position.set(1.6, 3.4, 2.0);
    lanternLight.castShadow = false;
    lanternLight.shadow.mapSize.set(1024, 1024);
    lanternLight.shadow.bias = -0.0006;
    scene.add(lanternLight);

    // Cool Tokyo dusk specular rim light (cuts crisp silhouette against darkness)
    const rimLight = new THREE.PointLight(0x38bdf8, 2.4, 16, 2.0);
    rimLight.position.set(-3.2, 2.2, -2.4);
    scene.add(rimLight);

    // Subtle Kishu binchotan charcoal ember glow from below
    const emberLight = new THREE.PointLight(0xd97706, 1.8, 10, 2.0);
    emberLight.position.set(0, -0.8, 1.8);
    scene.add(emberLight);

    // 4. Dark Yakisugi Charred Cedar Table Surface
    const tableGeo = new THREE.CylinderGeometry(5.8, 5.8, 0.4, 64);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c0e,
      map: pedestalTextures.map,
      bumpMap: pedestalTextures.bumpMap,
      bumpScale: 0.03,
      roughness: 0.88,
      metalness: 0.04,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -1.42;
    table.receiveShadow = true;
    scene.add(table);

    // 5. Procedural 3D Ramen Bowl Group (Anchored lower for headline breathing room)
    const ramenGroup = new THREE.Group();
    ramenGroup.position.set(0, -0.32, 0);
    scene.add(ramenGroup);

    // Soft Contact Shadow plane under bowl
    const shadowGeo = new THREE.PlaneGeometry(3.8, 3.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -0.89;
    ramenGroup.add(contactShadow);

    // Ceramic Bowl Geometry (Flared Japanese Donburi shape)
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.55, 0)); // base bottom
    points.push(new THREE.Vector2(0.75, 0.08)); // foot ring
    points.push(new THREE.Vector2(0.72, 0.25));
    points.push(new THREE.Vector2(1.1, 0.7));
    points.push(new THREE.Vector2(1.5, 1.15));
    points.push(new THREE.Vector2(1.68, 1.32)); // rim lip
    points.push(new THREE.Vector2(1.64, 1.3)); // inner lip
    points.push(new THREE.Vector2(1.42, 1.05));
    points.push(new THREE.Vector2(0.95, 0.5));
    points.push(new THREE.Vector2(0.48, 0.2));
    points.push(new THREE.Vector2(0, 0.2)); // inner bottom

    const bowlGeo = new THREE.LatheGeometry(points, 64);
    const bowlMat = new THREE.MeshPhysicalMaterial({
      color: 0x111114,
      map: ceramicTextures.map,
      bumpMap: ceramicTextures.bumpMap,
      bumpScale: 0.022,
      roughness: 0.32,
      metalness: 0.06,
      clearcoat: 0.82,
      clearcoatRoughness: 0.16,
      reflectivity: 0.55,
    });
    const bowlMesh = new THREE.Mesh(bowlGeo, bowlMat);
    bowlMesh.position.y = -0.9;
    bowlMesh.castShadow = true;
    bowlMesh.receiveShadow = true;
    ramenGroup.add(bowlMesh);

    // 24K Gold Kintsugi Veins on Bowl Rim
    const kintsugiMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.16,
      metalness: 0.98,
      emissive: 0xb45309,
      emissiveIntensity: 0.24,
    });
    const kintsugiCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.1, 0.7 - 0.9, 0.7),
      new THREE.Vector3(1.35, 0.95 - 0.9, 0.6),
      new THREE.Vector3(1.52, 1.18 - 0.9, 0.45),
      new THREE.Vector3(1.66, 1.31 - 0.9, 0.3),
    ]);
    const kintsugiGeo = new THREE.TubeGeometry(kintsugiCurve, 28, 0.02, 8, false);
    const kintsugiMesh = new THREE.Mesh(kintsugiGeo, kintsugiMat);
    ramenGroup.add(kintsugiMesh);

    const kBranchCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.35, 0.95 - 0.9, 0.6),
      new THREE.Vector3(1.48, 1.05 - 0.9, 0.7),
      new THREE.Vector3(1.58, 1.2 - 0.9, 0.78),
    ]);
    const kBranch = new THREE.Mesh(new THREE.TubeGeometry(kBranchCurve, 16, 0.012, 6, false), kintsugiMat);
    ramenGroup.add(kBranch);

    // Tonkotsu Broth Surface (Rich shimmering liquid)
    const brothGeo = new THREE.CylinderGeometry(1.48, 1.35, 0.08, 64);
    const brothMat = new THREE.MeshPhysicalMaterial({
      color: 0xba6818,
      map: brothTextures.map,
      bumpMap: brothTextures.bumpMap,
      bumpScale: 0.018,
      roughness: 0.03,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transmission: 0.22,
      thickness: 0.75,
      ior: 1.34,
      reflectivity: 0.85,
    });
    const broth = new THREE.Mesh(brothGeo, brothMat);
    broth.position.y = 0.22;
    broth.receiveShadow = true;
    ramenGroup.add(broth);

    // Floating collagen / fat globules on broth surface
    const fatMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef08a,
      roughness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transmission: 0.35,
      transparent: true,
      opacity: 0.82,
    });
    for (let f = 0; f < 18; f++) {
      const fr = 0.2 + Math.random() * 1.0;
      const fAngle = Math.random() * Math.PI * 2;
      const fSize = 0.03 + Math.random() * 0.06;
      const fatGeo = new THREE.CylinderGeometry(fSize, fSize, 0.012, 12);
      const fatMesh = new THREE.Mesh(fatGeo, fatMat);
      fatMesh.position.set(Math.cos(fAngle) * fr, 0.265, Math.sin(fAngle) * fr);
      ramenGroup.add(fatMesh);
    }

    // Black Garlic Mayu Swirls on Broth
    const mayuGeo = new THREE.TorusGeometry(0.7, 0.055, 16, 44);
    const mayuMat = new THREE.MeshPhysicalMaterial({
      color: 0x140e0a,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      metalness: 0.75,
      emissive: 0x451a03,
      emissiveIntensity: 0.35,
    });
    const mayu = new THREE.Mesh(mayuGeo, mayuMat);
    mayu.rotation.x = Math.PI / 2;
    mayu.position.set(-0.25, 0.27, -0.15);
    mayu.scale.set(1, 0.7, 1);
    ramenGroup.add(mayu);

    // Noodle coils in broth (warm kansui wheat dough tone)
    const noodleMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5e6c4,
      roughness: 0.24,
      clearcoat: 0.75,
      clearcoatRoughness: 0.16,
      metalness: 0.02,
    });
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 0.5 + (i % 3) * 0.24;
      const noodleCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * r, 0.22, Math.sin(angle) * r),
        new THREE.Vector3(Math.cos(angle + 0.4) * (r + 0.15), 0.26, Math.sin(angle + 0.4) * (r - 0.1)),
        new THREE.Vector3(Math.cos(angle + 0.8) * (r - 0.2), 0.24, Math.sin(angle + 0.8) * (r + 0.1)),
      ]);
      const noodleGeo = new THREE.TubeGeometry(noodleCurve, 20, 0.034, 6, false);
      const noodleMesh = new THREE.Mesh(noodleGeo, noodleMat);
      noodleMesh.castShadow = true;
      ramenGroup.add(noodleMesh);
    }

    // Torched Kurobuta Chashu Pork Slices
    const chashuTopMat = new THREE.MeshPhysicalMaterial({
      map: chashuTextures.map,
      bumpMap: chashuTextures.bumpMap,
      bumpScale: 0.035,
      roughness: 0.35,
      clearcoat: 0.88,
      clearcoatRoughness: 0.14,
    });
    const chashuEdgeMat = new THREE.MeshStandardMaterial({
      color: 0x3d170e,
      roughness: 0.45,
    });
    for (let c = 0; c < 2; c++) {
      const chashuGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.07, 32);
      const chashu = new THREE.Mesh(chashuGeo, [chashuEdgeMat, chashuTopMat, chashuEdgeMat]);
      chashu.scale.set(1.05, 1, 0.92);
      chashu.rotation.set(0.18 * (c + 1), 0.4 * c, -0.25 * (c + 1));
      chashu.position.set(-0.45 + c * 0.4, 0.28 + c * 0.04, 0.15 + c * 0.2);
      chashu.castShadow = true;
      ramenGroup.add(chashu);
    }

    // Ajitama Half Egg (Ivory White + Tare Rim + Molten Custard Yolk)
    const eggGroup = new THREE.Group();
    eggGroup.position.set(0.55, 0.32, -0.25);
    eggGroup.rotation.set(0.25, -0.15, 0.1);

    const eggWhiteGeo = new THREE.SphereGeometry(0.38, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2);
    const eggWhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xfffdf5,
      roughness: 0.18,
      clearcoat: 0.88,
      clearcoatRoughness: 0.1,
    });
    const eggWhite = new THREE.Mesh(eggWhiteGeo, eggWhiteMat);
    eggWhite.rotation.x = Math.PI;
    eggWhite.scale.set(0.85, 0.65, 1.15);
    eggWhite.castShadow = true;
    eggGroup.add(eggWhite);

    const eggFaceGeo = new THREE.CircleGeometry(0.38, 32);
    const eggFaceMat = new THREE.MeshPhysicalMaterial({
      map: ajitamaTexture,
      roughness: 0.08,
      clearcoat: 0.95,
      clearcoatRoughness: 0.04,
    });
    const eggFace = new THREE.Mesh(eggFaceGeo, eggFaceMat);
    eggFace.rotation.x = -Math.PI / 2;
    eggFace.position.y = 0.005;
    eggFace.scale.set(0.85, 1.15, 1);
    eggGroup.add(eggFace);

    const yolkGeo = new THREE.SphereGeometry(0.22, 22, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const yolkMat = new THREE.MeshPhysicalMaterial({
      color: 0xf97316,
      roughness: 0.03,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      ior: 1.46,
      emissive: 0xc2410c,
      emissiveIntensity: 0.25,
    });
    const yolk = new THREE.Mesh(yolkGeo, yolkMat);
    yolk.rotation.x = Math.PI;
    yolk.position.set(0, 0.02, 0);
    yolk.scale.set(0.8, 0.4, 0.9);
    eggGroup.add(yolk);
    ramenGroup.add(eggGroup);

    // Crispy Ariake Sea Nori Sheets Standing in Back
    const noriGeo = new THREE.PlaneGeometry(0.72, 1.1, 8, 8);
    const noriPos = noriGeo.attributes.position;
    for (let i = 0; i < noriPos.count; i++) {
      const vx = noriPos.getX(i);
      const vy = noriPos.getY(i);
      noriPos.setZ(i, Math.sin(vx * 6) * 0.03 + Math.cos(vy * 5) * 0.02);
    }
    noriGeo.computeVertexNormals();

    const noriMat = new THREE.MeshStandardMaterial({
      map: noriTextures.map,
      bumpMap: noriTextures.bumpMap,
      bumpScale: 0.045,
      roughness: 0.88,
      side: THREE.DoubleSide,
    });
    for (let nr = 0; nr < 2; nr++) {
      const noriMesh = new THREE.Mesh(noriGeo, noriMat);
      noriMesh.position.set(-0.3 + nr * 0.38, 0.65, -0.9 + nr * 0.08);
      noriMesh.rotation.set(0.35, 0.2 - nr * 0.18, -0.1);
      noriMesh.castShadow = true;
      ramenGroup.add(noriMesh);
    }

    // Green Scallions / Negi Hollow Rings
    const greenNegiMat = new THREE.MeshPhysicalMaterial({
      color: 0x16a34a,
      roughness: 0.22,
      clearcoat: 0.85,
    });
    const whiteNegiMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0fdf4,
      roughness: 0.22,
      clearcoat: 0.85,
    });
    for (let n = 0; n < 22; n++) {
      const nMat = n % 4 === 0 ? whiteNegiMat : greenNegiMat;
      const negi = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.015, 8, 16), nMat);
      const na = Math.random() * Math.PI * 2;
      const nr = 0.15 + Math.random() * 0.58;
      negi.position.set(Math.cos(na) * nr, 0.28 + Math.random() * 0.03, Math.sin(na) * nr);
      negi.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
      negi.castShadow = true;
      ramenGroup.add(negi);
    }

    // 6. Multi-Layer Realistic Steam Particles (Delicate hovering culinary vapor)
    const steamParticleCount = 45;
    const steamGeo = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamParticleCount * 3);
    const steamSpeed = new Float32Array(steamParticleCount);
    const steamRadii = new Float32Array(steamParticleCount);

    for (let i = 0; i < steamParticleCount; i++) {
      const th = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.55;
      steamPositions[i * 3] = Math.cos(th) * r;
      steamPositions[i * 3 + 1] = 0.25 + Math.random() * 1.35;
      steamPositions[i * 3 + 2] = Math.sin(th) * r;
      steamSpeed[i] = 0.005 + Math.random() * 0.008;
      steamRadii[i] = r;
    }

    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

    // Custom steam canvas texture for soft billowing particles
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, 'rgba(235, 215, 195, 0.28)');
      grad.addColorStop(0.5, 'rgba(210, 190, 175, 0.10)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const steamTexture = new THREE.CanvasTexture(canvas);

    const steamMat = new THREE.PointsMaterial({
      size: 0.32,
      map: steamTexture,
      transparent: true,
      opacity: 0.24,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    const steamSystem = new THREE.Points(steamGeo, steamMat);
    ramenGroup.add(steamSystem);

    // 7. Ambient Dust Motes
    const dustCount = 70;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 6;
      dustPositions[i * 3 + 1] = Math.random() * 4 - 1;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0xffeedd,
      transparent: true,
      opacity: 0.35,
    });
    const dustSystem = new THREE.Points(dustGeo, dustMat);
    scene.add(dustSystem);

    // Mouse Interaction
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = nx * 0.35;
      targetRotationX = ny * 0.12;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Scroll listener for cinematic camera glide and depth transition
    let isHeroInView = true;
    let scrollRafId = 0;

    const handleScroll = () => {
      if (!isHeroInView) return;
      if (scrollRafId) return;

      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        const scrollY = window.scrollY;
        const maxScroll = window.innerHeight;
        const progress = Math.min(scrollY / maxScroll, 1);
        currentScrollProgress = progress;

        // Directly update DOM styles without React state re-renders for buttery 120fps scrolling
        if (editorialRef.current) {
          editorialRef.current.style.transform = `translate3d(0, ${progress * -70}px, 0)`;
          editorialRef.current.style.opacity = `${Math.max(0, 1 - progress * 1.4)}`;
        }
        if (kanji1Ref.current) {
          kanji1Ref.current.style.transform = `translate3d(0, ${progress * -45}px, 0)`;
        }
        if (kanji2Ref.current) {
          kanji2Ref.current.style.transform = `translate3d(0, ${progress * -25}px, 0)`;
        }
        if (hintRef.current) {
          hintRef.current.style.opacity = `${Math.max(0, 1 - progress * 2)}`;
        }
        if (scrollBtnRef.current) {
          scrollBtnRef.current.style.opacity = `${Math.max(0, 1 - progress * 2.5)}`;
        }
        if (hazeRef.current) {
          hazeRef.current.style.opacity = `${Math.min(1, 0.4 + progress * 0.6)}`;
        }

        // Camera glides smoothly forward and tilts slightly downward into the steaming bowl
        targetCameraPos.z = baseCameraPos.z - progress * 0.95;
        targetCameraPos.y = baseCameraPos.y - progress * 0.4;
        targetCameraPos.x = progress * 0.25;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    setIsLoaded(true);

    // 8. Animation Loop with IntersectionObserver pausing for 60fps site-wide performance
    let clock = new THREE.Clock();
    let animId = 0;

    const animate = () => {
      if (!isHeroInView) {
        animId = 0;
        return;
      }
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation towards target
      camera.position.lerp(targetCameraPos, 0.05);
      camera.lookAt(0, -0.15 - currentScrollProgress * 0.15, 0);

      // Subtle bowl rotation responding to cursor, scroll progress, and slow idle spin
      const scrollPitch = currentScrollProgress * 0.25;
      ramenGroup.rotation.y += (targetRotationY + elapsed * 0.06 - ramenGroup.rotation.y) * 0.04;
      ramenGroup.rotation.x += (targetRotationX + scrollPitch - ramenGroup.rotation.x) * 0.04;

      // Animate steam particles with swirl and scroll-linked density
      const positions = steamGeo.attributes.position.array as Float32Array;
      const speedMultiplier = 1 + currentScrollProgress * 1.5;
      steamMat.opacity = 0.22 + currentScrollProgress * 0.15;

      for (let i = 0; i < steamParticleCount; i++) {
        positions[i * 3 + 1] += steamSpeed[i] * speedMultiplier;
        const sway = Math.sin(elapsed * 2.2 + i) * 0.0035;
        positions[i * 3] += sway;
        positions[i * 3 + 2] += Math.cos(elapsed * 1.8 + i) * 0.0035;

        // Reset if reached height
        if (positions[i * 3 + 1] > 1.8) {
          positions[i * 3 + 1] = 0.25;
          const th = Math.random() * Math.PI * 2;
          const r = Math.random() * 0.55;
          positions[i * 3] = Math.cos(th) * r;
          positions[i * 3 + 2] = Math.sin(th) * r;
        }
      }
      steamGeo.attributes.position.needsUpdate = true;

      // Gentle lantern flame flicker
      lanternLight.intensity = 3.8 + Math.sin(elapsed * 3.8) * 0.25 + Math.cos(elapsed * 6.5) * 0.15;

      // Floating dust rotation
      dustSystem.rotation.y = elapsed * 0.015;

      renderer.render(scene, camera);
    };

    // Pause WebGL rendering whenever the hero section leaves the viewport
    const heroSection = document.getElementById('hero');
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isHeroInView = entry.isIntersecting;
        if (isHeroInView) {
          if (!animId) {
            clock.start();
            animId = requestAnimationFrame(animate);
          }
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = 0;
          }
        }
      },
      { threshold: 0.02 }
    );
    if (heroSection) {
      visibilityObserver.observe(heroSection);
    } else {
      animate();
    }

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (animId) cancelAnimationFrame(animId);
      envTarget.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden select-none bg-[#09090b]"
      data-cursor="ROTATE 3D"
    >
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Subtle Atmospheric Vignette & Parallax Depth Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-[#09090b]/85 z-10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,9,11,0.65)_0%,rgba(9,9,11,0.3)_45%,rgba(9,9,11,0.95)_100%)] z-10" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[#09090b]/90 via-[#09090b]/45 to-transparent z-10" />

      {/* Film Grain & Paper Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] z-10 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Japanese Atmospheric Kanji watermark ribbons with parallax motion */}
      <div
        ref={kanji1Ref}
        className="pointer-events-none absolute top-28 left-8 md:left-16 z-10 text-white/[0.04] font-['Noto_Serif_JP',serif] text-7xl md:text-9xl font-extralight select-none leading-none will-change-transform"
      >
        一碗入魂
      </div>
      <div
        ref={kanji2Ref}
        className="pointer-events-none absolute bottom-24 right-8 md:right-16 z-10 text-white/[0.04] font-['Noto_Serif_JP',serif] text-6xl md:text-8xl font-extralight select-none leading-none text-right will-change-transform"
      >
        静寂と炎
      </div>

      {/* Main Hero Editorial Overlay with Layered Parallax and Masked Reveal */}
      <div
        ref={editorialRef}
        className={`relative z-20 max-w-5xl mx-auto px-6 text-center will-change-transform transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Ambient Dark Spotlight directly behind typography so text crisply pops with high contrast */}
        <div className="pointer-events-none absolute inset-0 max-w-2xl mx-auto -inset-y-12 bg-[radial-gradient(ellipse_at_center,rgba(6,6,8,0.88)_0%,rgba(6,6,8,0.55)_55%,transparent_80%)] blur-2xl -z-10" />

        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/20 bg-black/80 backdrop-blur-md mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c53030] animate-pulse" />
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.35em] text-[#e4e4e7] uppercase font-medium">
            EST. 2025 • LOWER MANHATTAN
          </span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-[10px] font-['Noto_Serif_JP',serif] text-[#d4d4d8]">
            工房
          </span>
        </div>

        {/* Oversized Brand Typography with Crisp Pop and Multi-Layer Shadows */}
        <div className="overflow-hidden">
          <h1 className="font-['Cinzel',serif] text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.2em] font-semibold text-white uppercase mb-3 drop-shadow-[0_8px_30px_rgba(0,0,0,1)] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] transition-all duration-1000">
            KŌBŌ
          </h1>
        </div>

        {/* Under-title: RAMEN / NEW YORK */}
        <div className="font-['Noto_Serif_JP',serif] text-xs sm:text-sm md:text-base tracking-[0.48em] text-[#e4e4e7] font-medium uppercase mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
          拉麺 <span className="text-[#c53030] font-bold">/</span> ニューヨーク
        </div>

        {/* Core Statement: CRAFTED IN SILENCE. SERVED WITH FIRE. */}
        <p className="max-w-xl mx-auto text-xs sm:text-sm md:text-base font-normal tracking-[0.28em] text-white/95 uppercase leading-relaxed mb-10 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
          Crafted in silence. Served with fire.
        </p>

        {/* Interactive Action Triggers with Magnetic Micro-Interactions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            ref={exploreMagnetic.ref}
            {...exploreMagnetic.magneticProps}
            id="hero-explore-button"
            onClick={() => {
              audioManager.playChime(440);
              onExploreClick();
            }}
            className="group relative px-7 py-3.5 rounded-full bg-[#c53030] text-white text-xs font-semibold tracking-[0.28em] uppercase transition-all duration-300 hover:bg-[#b91c1c] hover:shadow-[0_0_35px_rgba(197,48,48,0.6)] border border-red-400/30 shadow-[0_4px_24px_rgba(0,0,0,0.7)] focus:outline-none"
            data-cursor="DISCOVER"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>ENTER THE RITUAL</span>
              <Sparkles className="w-3.5 h-3.5 opacity-90 group-hover:rotate-12 transition-transform" />
            </span>
          </button>

          <a
            ref={deconstructMagnetic.ref}
            {...deconstructMagnetic.magneticProps}
            href="#layers"
            onClick={(e) => {
              e.preventDefault();
              audioManager.playChime(330);
              smoothScrollTo('#layers');
            }}
            className="px-6 py-3.5 rounded-full border border-white/30 bg-black/60 text-white text-xs font-normal tracking-[0.25em] uppercase hover:bg-black/90 hover:border-white/60 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.7)] focus:outline-none backdrop-blur-md"
            data-cursor="VIDEO LAYERS"
          >
            DECONSTRUCT BOWL
          </a>
        </div>
      </div>

      {/* 3D Interaction Notice Badge */}
      <div
        ref={hintRef}
        className="absolute bottom-16 left-8 md:left-16 z-20 hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#71717a] uppercase will-change-transform"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#c53030]/80 animate-ping" />
        <span>MOVE CURSOR TO ROTATE 3D BOWL</span>
      </div>

      {/* Scroll Down Indicator */}
      <button
        ref={scrollBtnRef}
        onClick={() => onExploreClick()}
        aria-label="Scroll down to restaurant story"
        className="group absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors focus:outline-none cursor-pointer will-change-transform"
        data-cursor="SCROLL"
      >
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100">
          SCROLL
        </span>
        <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-[#c53030] animate-bounce" />
        </div>
      </button>

      {/* Continuous Physical Section Transition (Hero -> Story): expanding atmospheric haze layer */}
      <div
        ref={hazeRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent z-25 opacity-40 will-change-transform"
      />
    </section>
  );
}
