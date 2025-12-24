import * as THREE from "three";

export function createHeartParticle() {
  const particleCount = 5000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  // 随机生成心形粒子位置
  for (let i = 0; i < particleCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const u = Math.random() * Math.PI;
    const r = Math.random() * 1.2; // 心形半径
    // 心形隐函数 param
    const x = 16 * Math.pow(Math.sin(t), 3) * r * 0.15;
    const y =
      (13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)) *
        r *
        0.15 +
       7.8 + Math.random() * 0.4; // 放到树顶
    const z = (Math.random() - 0.5) * 1.2; 
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xff69b4) }, // 粉色
    },
    vertexShader: `
      uniform float uTime;
      varying float vY;
      void main() {
        vec3 pos = position;
        // 心形粒子轻微漂浮
        pos.x += sin(uTime + pos.y*5.0)*0.02;
        pos.y += cos(uTime + pos.x*5.0)*0.02;
        pos.z += sin(uTime + pos.x*3.0)*0.02;
        vY = pos.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
        gl_PointSize = 4.0;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vY;
      void main() {
        float alpha = 1.0 - length(gl_PointCoord - 0.5)*2.0; // 边缘透明
        alpha *= smoothstep(7.5,8.5,vY); // 高度渐变
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}
