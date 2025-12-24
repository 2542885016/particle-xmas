import * as THREE from "three";

const snowTexture = new THREE.TextureLoader().load("src/circle-64.ico");

export function createSnows() {
  //basic setting
  const count = 10000;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count); // 每个粒子的独立速度

  const rangeX = 100;
  const rangeY = 90;
  const rangeZ = 100;

  for (let i = 0; i < count; i++) {
    const ix = i * 3;

    // 初始化位置
    positions[ix] = (Math.random() - 0.5) * rangeX; // X
    positions[ix + 1] = Math.random() * rangeY; // Y
    positions[ix + 2] = (Math.random() - 0.5) * rangeZ; // Z

    // 每个雪花下落速度不同，避免机械感
    speeds[i] = 0.1 + Math.random() * 0.3;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("speed", new THREE.BufferAttribute(speeds, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.1,
    map: snowTexture,
    transparent: true,
    alphaTest: 0.2,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xffffff,
    sizeAttenuation: true,
  });

  const snow = new THREE.Points(geo, mat);

  // ★★ 给外部渲染循环使用的 update 方法 ★★
  snow.tick = (delta) => {
    const pos = geo.attributes.position.array;
    const spd = geo.attributes.speed.array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;

      pos[ix + 1] -= spd[i] * delta * 30; // Y 下降

      // 雪花掉到底之后从顶部重生
      if (pos[ix + 1] < -20) {
        pos[ix] = (Math.random() - 0.5) * rangeX;
        pos[ix + 1] = rangeY;
        pos[ix + 2] = (Math.random() - 0.5) * rangeZ;
      }
    }
    geo.attributes.position.needsUpdate = true;
  };

  return snow;
}
