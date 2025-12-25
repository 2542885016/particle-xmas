import * as THREE from "three";

export function createHeartParticle({
  SPHERE_POINTS = 2700,
  TREE_HEIGHT = 11.5,
  RADIUS = 0.6, // 球半径
} = {}) {
  const positions = new Float32Array(SPHERE_POINTS * 3);
  const colors = new Float32Array(SPHERE_POINTS * 3);

  let ptr = 0;

  while (ptr / 3 < SPHERE_POINTS) {
    // 随机生成球内点
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    const r = RADIUS * Math.cbrt(Math.random()); // 均匀分布在球体内
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions[ptr] = x;
    positions[ptr + 1] = y + TREE_HEIGHT; // 底端对齐树顶
    positions[ptr + 2] = z;

    // 颜色：粉白渐变
    const factor = 0.3 + 0.4 * Math.random();
    const rCol = 0.8;
    const gCol = factor * 0.7;
    const bCol = factor * 0.7;

    colors[ptr] = rCol;
    colors[ptr + 1] = gCol;
    colors[ptr + 2] = bCol;

    ptr += 3;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.08,
    sizeAttenuation: true,
  });

  const sphere = new THREE.Points(geometry, material);

  // ---------- 动画 tick ----------
  let time = 0;
  sphere.tick = function (delta) {
    time += delta;
    //sphere.position.y = TREE_HEIGHT + 0.05 * Math.sin(time * 2); // 小幅上下漂浮
    sphere.rotation.y += delta * 0.002; // 缓慢旋转
  };

  return sphere;
}
