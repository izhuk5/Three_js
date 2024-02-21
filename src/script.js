import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Scale
// mesh.scale.x = 1.5;
// mesh.scale.z = 0.8;
// mesh.scale.y = 1;
mesh.scale.set(1.5, 1, 0.8);

// Axes helper
const axisHelp = new THREE.AxesHelper();
scene.add(axisHelp);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Rotation
mesh.rotation.reorder("YXZ");
mesh.rotation.y = Math.PI * 0.25;
mesh.rotation.x = Math.PI * 0.25;

// Position
// mesh.position.y = -0.6;
// mesh.position.x = 0.7;
// mesh.position.z = 1;
mesh.position.set(3, -0.6, -1);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height
);
camera.position.z = 3;
camera.position.y = 1;
camera.position.x = 1;
scene.add(camera);

camera.lookAt(mesh.position);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
