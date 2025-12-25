
import * as THREE from "three";

export function createGroundRing() {
  const COUNT = 9000; // 根据你的 GROUND_POINTS 调整
  const rings = [8.5, 10, 11.5, 13, 14.5];

  const maxOffset = 1;
  const minOffset = -1;

  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    // 选择一个环
    const ring = rings[Math.floor(Math.random() * rings.length)];
    // 高斯分布半径
    const r = ring + (Math.random() - 0.5) * 0.6; // sigma ≈ 0.3
    const theta = Math.random() * Math.PI * 2;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    
            // 圆台效果：r越小，偏移越大
    const t = (r - rings[0]) / (rings[rings.length - 1] - rings[0]); // 0~1
    const yOffset = maxOffset * (1 - t) + minOffset * t; 
    const y = -0.25 + (Math.random() - 0.5) * yOffset;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // 颜色
    // 粉白色随机
let rr = 1 + Math.random() * 0.05; // 0.95~1
let g = 0.7 + Math.random() * 0.1;   // 0.8~0.9
let b = 0.9 + Math.random() * 0.1;   // 0.9~1

colors[i * 3] = rr;
colors[i * 3 + 1] = g;
colors[i * 3 + 2] = b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
  });

  return new THREE.Points(geometry, material);
}
