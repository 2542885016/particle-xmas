import * as THREE from "three";

export function createTreeParticles({
  COUNT = 50000,
  HEIGHT = 13.5,
  LOOPS = 9,
} = {}) {
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  let ptr = 0;

  const spiralN = Math.floor(COUNT * 0.7);
  const tau = Math.PI * 2;

  /* ===============================
     70% 螺旋灯带
  =============================== */
  for (let i = 0; i < spiralN; i++) {
    const u = Math.random();
    const h = Math.pow(u, 1.6);
    const y = HEIGHT * h + 0.2;

    // 基础半径
    let baseR = Math.pow(1 - h, 1.1) * 5;

    // 树枝层次波
    const branchWave = Math.max(0, Math.sin((h * 5.8 + 0.15) * tau));
    baseR *= 1 + 0.65 * branchWave;

    // 螺旋
    const t = u * LOOPS * tau;
    const angle = t + THREE.MathUtils.randFloat(-0.22, 0.22);
    const r = baseR * THREE.MathUtils.randFloat(0.85, 1.09);

    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    // 中段亮度增强
    let midBoost = 1 - Math.abs(h - 0.55) * 1.5;
    midBoost = Math.max(0.15, midBoost);

    let g = 155 + 90 * midBoost;
    let b = 185 + 70 * midBoost;

    // 小灯点缀
    if (Math.random() < 0.08 && h < 0.10) {
      g = 200 + Math.random() * 40; // 180~220
      b = 220 + Math.random() * 30; // 200~230
    } else {
      g = 170 + Math.random() * 40; // 180~200
      b = 190 + Math.random() * 30; // 200~220
    }

    colors[ptr * 3] = 1; // r 保持偏红
    colors[ptr * 3 + 1] = THREE.MathUtils.clamp(g / 255 + 10, 0, 0.35);
    colors[ptr * 3 + 2] = THREE.MathUtils.clamp(b / 255 + 10, 0, 0.5);

    positions[ptr * 3] = x;
    positions[ptr * 3 + 1] = y;
    positions[ptr * 3 + 2] = z;

    ptr++;
  }

  /* ===============================
     30% 填充毛边
  =============================== */
  for (; ptr < COUNT; ptr++) {
    const h = Math.pow(Math.random(), 1.9);
    const y = HEIGHT * h + 0.2 + THREE.MathUtils.randFloat(-0.08, 0.08);

    let baseR = Math.pow(1 - h, 1.1) * 4.3;

    const branchWave = Math.max(0, Math.sin((h * 5.8 + 0.15) * tau));
    baseR *= 1 + 0.65 * branchWave;

    const r = baseR * Math.sqrt(Math.random());
    const angle = Math.random() * tau;

    const x = Math.cos(angle) * r + THREE.MathUtils.randFloat(-0.08, 0.08);
    const z = Math.sin(angle) * r + THREE.MathUtils.randFloat(-0.08, 0.08);

    const g = THREE.MathUtils.randInt(165, 225);
    const b = THREE.MathUtils.randInt(190, 250);

    positions[ptr * 3] = x;
    positions[ptr * 3 + 1] = y;
    positions[ptr * 3 + 2] = z;

    colors[ptr * 3] = 1.0;
    colors[ptr * 3 + 1] = g / 255;
    colors[ptr * 3 + 2] = b / 255;
  }

  /* ===============================
     Geometry + Material
  =============================== */
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    opacity: 0.8,
  });

  const points = new THREE.Points(geometry, material);

  function tick(delta) {
    // 比如：整体慢慢转
    points.rotation.y += delta * 0.05;
  }

  return {
    points,
    tick,
  };
}
