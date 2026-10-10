import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// Exact SVG path data from assets/shijin-logo-icon-black.svg
const LOGO_ICON_SVG = `<svg viewBox="0 0 2767 3229" xmlns="http://www.w3.org/2000/svg">
<path d="M1545.26 1864.3L585.474 1301.49L1595.51 713.56C1635.71 693.46 1717.12 613.059 1721.14 452.257C1725.16 291.454 1709.42 83.7512 1701.04 0L243.769 849.237C67.8915 989.94 -185.372 1359.79 208.594 1713.55L927.18 2135.66C967.381 2149.06 1063.86 2167.82 1128.18 2135.66L1545.26 1864.3Z"/>
<path d="M1221.74 1364.48L2181.53 1927.29L1171.49 2515.22C1131.29 2535.32 1049.88 2615.72 1045.86 2776.53C1041.84 2937.33 1057.58 3145.03 1065.96 3228.78L2523.23 2379.55C2699.11 2238.84 2952.37 1869 2558.41 1515.23L1839.82 1093.13C1799.62 1079.73 1703.14 1060.97 1638.82 1093.13L1221.74 1364.48Z"/>
</svg>`;

export function initThreeScene(canvasId = 'hero-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const scene = new THREE.Scene();

  // Get canvas wrapper dimensions
  const getWrapperSize = () => {
    const wrapper = canvas.parentElement;
    const visualCol = wrapper ? wrapper.closest('.hero-visual-col') : null;
    const heroSec = document.getElementById('hero');

    if (window.innerWidth < 992) {
      const w = wrapper && wrapper.offsetWidth > 0 ? wrapper.offsetWidth : window.innerWidth;
      const h = (heroSec && heroSec.offsetHeight > 0) ? heroSec.offsetHeight : Math.max(window.innerHeight - 68, 480);
      return { w, h };
    }

    const colW = visualCol ? visualCol.offsetWidth : 0;
    const colH = visualCol ? visualCol.offsetHeight : 0;

    const w = wrapper && wrapper.offsetWidth > 0 
      ? wrapper.offsetWidth 
      : colW > 0 
        ? colW 
        : Math.min(Math.round(window.innerWidth * 0.45), 520);

    const h = wrapper && wrapper.offsetHeight > 0 
      ? wrapper.offsetHeight 
      : colH > 0 
        ? colH 
        : 560;

    return { w, h };
  };

  const { w: initW, h: initH } = getWrapperSize();

  const camera = new THREE.PerspectiveCamera(48, initW / initH, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(initW, initH);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // 1. Studio Lighting System tailored for signature Red Material
  scene.add(new THREE.AmbientLight(0xffffff, 1.7));

  // Key directional light for front bevel highlights
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
  keyLight.position.set(4, 5, 5);
  scene.add(keyLight);

  // White rim light to make beveled edges glisten crisp against white bg
  const rimLight = new THREE.DirectionalLight(0xffffff, 2.8);
  rimLight.position.set(-4, -3, -3);
  scene.add(rimLight);

  // Soft red point light tracking pointer for depth
  const redPointLight = new THREE.PointLight(0xff2222, 3.2, 10);
  redPointLight.position.set(2, -1, 3);
  scene.add(redPointLight);

  // 2. Exact 3D Extruded Logo Icon in Brand Red
  const svgLoader = new SVGLoader();
  const svgData = svgLoader.parse(LOGO_ICON_SVG);

  const pivot = new THREE.Group();
  scene.add(pivot);

  const logoGroup = new THREE.Group();

  const extrudeSettings = {
    depth: 170,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 2,
    bevelSize: 22,
    bevelThickness: 22
  };

  // Signature brand red material (#e60000) with glossy clearcoat
  const logoMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe60000,
    emissive: 0x220101,
    roughness: 0.18,
    metalness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.95,
    sheen: 0.85,
    sheenColor: 0xff4040,
    sheenRoughness: 0.22
  });

  const extrudedGeometries = [];

  svgData.paths.forEach((path) => {
    const shapes = typeof path.toShapes === 'function' ? path.toShapes(true) : SVGLoader.createShapes(path);
    shapes.forEach((shape) => {
      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      extrudedGeometries.push(geo);
      const mesh = new THREE.Mesh(geo, logoMaterial);
      logoGroup.add(mesh);
    });
  });

  // Calculate scaling for target 3D height (~2.8 units)
  const rawBbox = new THREE.Box3().setFromObject(logoGroup);
  const rawHeight = rawBbox.max.y - rawBbox.min.y;
  const targetHeight = 2.85;
  const initialScale = targetHeight / (rawHeight || 3229);

  // Invert Y axis to align SVG coordinates with Three.js world space
  logoGroup.scale.set(initialScale, -initialScale, initialScale);
  pivot.add(logoGroup);

  // Center logoGroup precisely inside pivot
  logoGroup.updateMatrixWorld(true);
  const scaledBbox = new THREE.Box3().setFromObject(logoGroup);
  const scaledCenter = new THREE.Vector3();
  scaledBbox.getCenter(scaledCenter);
  logoGroup.position.sub(scaledCenter);

  // 3. Floating Particle Field for spatial depth
  const particleCount = 120;
  const particleGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(particleCount * 3);
  const col = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    pos[i3]     = (Math.random() - 0.5) * 14;
    pos[i3 + 1] = (Math.random() - 0.5) * 12;
    pos[i3 + 2] = (Math.random() - 0.5) * 9;

    if (Math.random() > 0.65) {
      col[i3] = 0.90; col[i3 + 1] = 0.05; col[i3 + 2] = 0.05;
    } else {
      col[i3] = 0.92; col[i3 + 1] = 0.92; col[i3 + 2] = 0.94;
    }
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.NormalBlending
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // 4. Mouse Parallax & Dynamic Tracking
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0, scrollProgress = 0;
  let baseScale = 0.96;

  const onPointerMove = (e) => {
    const wrapper = canvas.parentElement;
    const rect = wrapper
      ? wrapper.getBoundingClientRect()
      : { left: window.innerWidth * 0.5, width: window.innerWidth * 0.5, top: 0, height: window.innerHeight };
    const relX = (e.clientX - rect.left) / (rect.width || 1);
    const relY = (e.clientY - rect.top) / (rect.height || window.innerHeight);
    targetX = (relX * 2 - 1) * 0.45;
    targetY = -(relY * 2 - 1) * 0.35;
    redPointLight.position.x = (relX * 2 - 1) * 2.5;
    redPointLight.position.y = -(relY * 2 - 1) * 1.5;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  const onResize = () => {
    const { w, h } = getWrapperSize();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    baseScale = window.innerWidth < 640 ? 0.65 : window.innerWidth < 992 ? 0.78 : 0.96;
  };
  window.addEventListener('resize', onResize);
  onResize();

  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }, { passive: true });

  // 5. Smooth Animation Loop
  const startTime = performance.now();
  let animationFrameId;

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    const t = (performance.now() - startTime) * 0.001;
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    // Smooth floating rotation of the red 3D logo icon
    pivot.rotation.x = Math.sin(t * 0.35) * 0.12 + mouseY * 0.45 + scrollProgress * 1.5;
    pivot.rotation.y = t * 0.30 + mouseX * 0.65 + scrollProgress * 2.0;
    pivot.rotation.z = Math.sin(t * 0.22) * 0.06;

    // Subtle breath pulse
    const breath = 1 + Math.sin(t * 1.3) * 0.015;
    pivot.scale.setScalar(baseScale * breath);

    // Particle field
    particles.rotation.y = t * 0.02;
    particles.rotation.x = t * 0.01;

    renderer.render(scene, camera);
  };
  animate();

  return {
    destroy: () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      extrudedGeometries.forEach((g) => g.dispose());
      logoMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    }
  };
}
