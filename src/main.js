//three.js的入口 汇总
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { createTreeParticles } from "./tree.js";
import { createStars } from "./starField.js";
import { createHeartParticle } from "./heartShader.js";
import { createSnows } from "./snowFlow.js";
import { createGroundRing } from "./groundRing.js";
import { createUIText } from "./text.js";


const ALLOWED_HOSTS = [".github.io", "localhost", "127.0.0.1"];

if (!ALLOWED_HOSTS.includes(window.location.hostname)) {
  const el = document.createElement("div");
  el.id = "unauth";
  el.innerHTML = "<div><h2>Unauthorized</h2><p>This demo is private.</p></div>";
  document.body.appendChild(el);
  console.warn("Unauthorized host: ", window.location.hostname);
} else {
  //
  const canvas = document.getElementById("webgl");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.02);

  //
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 13, 17);
  camera.layers.enable(1);

  //
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false; //画面伸缩
  controls.minDistance = controls.maxDistance = camera.position.length();

  controls.minPolarAngle = Math.PI * 0.1;
  controls.maxPolarAngle = Math.PI * 0.48;

  controls.enablePan = false;

  controls.target.set(0, 2, 0);

  //
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  //
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    2.2,
    0.6,
    0.65
  );
  //强度 半径 阈值
  bloomPass.strength = 1.5;
  bloomPass.radius = 1.0;
  bloomPass.threshold = 0;
  bloomPass.renderToScreen = true;
  composer.addPass(bloomPass);


  //
  const ambient = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambient);

  const dir = new THREE.DirectionalLight(0xffffff, 0.3);
  dir.position.set(10, 10, 10);
  scene.add(dir);

  //!!
  const treeParticles = createTreeParticles();
  console.log(treeParticles);
  scene.add(treeParticles.points);
  treeParticles.points.position.y -= 2;
  treeParticles.points.position.z -= 1;

  const stars = createStars();
  console.log(stars);
  scene.add(stars);

  const heart = createHeartParticle();
  console.log(heart);
  scene.add(heart);
  heart.position.x += 0.3;

  const snow = createSnows();
  console.log(snow);
  scene.add(snow);

  
  const text = createUIText();
  console.log(text);
  if(text) scene.add(text);
  

  const groundRing = createGroundRing();
  groundRing.tick = function (t) {
    this.rotation.y += 0.00015 + Math.sin(t * 0.0003) * 0.0005;
    // 你甚至可以做更多东西
    // this.position.y = Math.sin(t * 0.002) * 0.2;
  };

  console.log(groundRing);
  scene.add(groundRing);

  const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta(); // 每帧时间间隔
    const t = clock.getElapsedTime();

    // ⭐ 星空旋转（不依赖 delta，可以保持慢速分层）
    stars.children.forEach((layer, idx) => {
      layer.rotation.y += 0.0005 * (idx + 1);
    });

    // 使用 delta 保证旋转稳定
    snow.tick(delta);
    treeParticles.tick(delta);
    heart.tick(delta);

    stars.position.copy(camera.position);
    stars.rotation.set(0, 0, 0);

    if (groundRing.tick) groundRing.tick(t);

    composer.render();
    controls.update();
}

animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });
}


