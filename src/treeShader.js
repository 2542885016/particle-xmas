import * as THREE from "three";

// 你可直接在 main.js 中调用 createTreeParticles()

export function createTreeParticles() {
  const group = new THREE.Group();

  // ============================================================
  // ① 外层随机壳：大范围 + 渐变密度
  // ============================================================
  {
    const count = 8000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // y 高度：0 到 10
      const y = Math.random() * 10;

      // 基础半径（顶部窄，底部宽）
      let r = (1 - y / 10) * 4.2;

      // 给一点噪声，使外层看起来“云雾化”
      r += (Math.random() - 0.5) * 0.8;

      const angle = Math.random() * Math.PI * 2;

      positions[i3 + 0] = Math.cos(angle) * r;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(angle) * r;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xff88cc,
      opacity: 0.4,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    group.add(new THREE.Points(geom, mat));
  }

  // ============================================================
  // ② 内部螺旋（多层亮圈）
  // ============================================================
  {
    const layers = 6; // 圈数
    const pointsPerLayer = 350;

    for (let k = 0; k < layers; k++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(pointsPerLayer * 3);

      for (let i = 0; i < pointsPerLayer; i++) {
        const t = i / pointsPerLayer;

        // y 为向上递增
        const y = t * 10;

        // 半径随高度变小
        const r = (1 - t) * 3.8 + 0.2 * Math.sin(t * 10 + k);

        const angle = t * Math.PI * 6 + k * 0.4;

        positions[i * 3 + 0] = Math.cos(angle) * r;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(angle) * r;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: 0.08,
        color: 0xffccee,
        opacity: 0.9,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      group.add(new THREE.Points(geometry, material));
    }
  }

  return group;
}