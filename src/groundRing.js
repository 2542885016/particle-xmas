import * as THREE from "three";

export function createGroundRing() {

  const group = new THREE.Group();

  // ===== 圆台参数 =====
  const height = 3.4;     // 圆台高度（越大越像山丘）
  const topR = 5.0;       // 顶部半径（树基座）
  const bottomR = 22.0;   // 最外围半径（地台大小）
  const layers = 22;      // 圈数（越多越丝滑）
  
  const yOffset = -3;     // 整体位置
  const gap = 0.21;       // 圈间垂直间隔

  // =============================
  //   由内 → 外 构造同心圆台层
  // =============================
  for (let i = 0; i < layers; i++) {

    const t = i / (layers - 1);
    const radius = THREE.MathUtils.lerp(topR, bottomR, t);  // 半径从小→大

    const y = yOffset - (t * height);   // 高度层层下降圆台轮廓
    const points = Math.floor(280 * (1 - t) + 30);  // 越往外越稀疏(非常关键)

    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(points * 3);

    for (let j = 0; j < points; j++) {
      const angle = Math.random() * Math.PI * 2;

      pos[j * 3]     = Math.cos(angle) * radius;
      pos[j * 3 + 1] = y + (Math.random() * 0.08); // 微抖动避免太整齐
      pos[j * 3 + 2] = Math.sin(angle) * radius;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.01 + (1-t)*0.09,           // 越靠中心粒子更亮更大
      color: new THREE.Color(`hsl(330,30%,${60 - t*30}%)`), // 外圈更暗
      opacity: 0.8 - t * 0.5,         // 外圈更透明
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const ring = new THREE.Points(geo, mat);
    group.add(ring);

  }

  return group;
}