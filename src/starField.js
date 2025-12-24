//星星 -> 功能：生成一个包含多层星星的点云 THREE.Group
import * as THREE from "three";

//new: 加载圆形纹理
const starTexture = new THREE.TextureLoader().load("src/circle-64.ico");

export function createStars() {
  //创建 Group 容器
  const group = new THREE.Group(); //组合多个对象进行批量操作

  //定义多层星星参数 -> 不同层的大小和数量不同: 形成“远近、密度差异”的星空效果
  const layers = [
    { count: 10000, size: 0.2, speed: 0.02 },
    { count: 30000, size: 0.1, speed: 0.01 },
    { count: 50000, size: 0.05, speed: 0.005 },
  ];

  //循环 遍历每层生成粒子
  layers.forEach((layer) => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(layer.count * 3);

    for (let i = 0; i < layer.count; i++) {
      //乘数增大 改变距离 避免过大的像素点
      positions[i * 3] = (Math.random() - 0.5) * 400; //x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400; //y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400; //z
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // new: 圆形纹理
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(0.8, 0.8, 1.0),
      opacity: 0.6,
      size: 0.1,
      map: starTexture,
      transparent: true,
      alphaTest: 0.2,
      depthTest: 0.2,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    group.add(points);
  });

  return group;
}
