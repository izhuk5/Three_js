import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

// Debug
const gui = new GUI();

const cylinderSmallParams = {
  radius: 0.5,
};

const cylinderSmallFolder = gui.addFolder("Cylinder Small");
cylinderSmallFolder
  .add(cylinderSmallParams, "radius", 0.1, 1, 0.1)
  .name("Radius")
  .onChange(updateCylinderSmall);

const sphereParams = {
  radius: 0.3,
};

const sphereFolder = gui.addFolder("Sphere");
sphereFolder
  .add(sphereParams, "radius", 0.1, 1, 0.1)
  .name("Radius")
  .onChange(() => {
    updateSphere();
  });

const cylinderMediumParams = {
  radius: 0.5,
};

const cylinderMediumFolder = gui.addFolder("Cylinder Medium");
cylinderMediumFolder
  .add(cylinderMediumParams, "radius", 0.1, 1, 0.1)
  .name("Radius")
  .onChange(() => {
    updateCylinderMedium();
  });

const boxParams = {
  size: 0.25,
};

const boxFolder = gui.addFolder("Cube");
boxFolder
  .add(boxParams, "size", 0.01, 1, 0.05)
  .name("Cube size")
  .onChange(() => {
    updateCube();
  });

const coneParams = {
  initialRadius: 0.2,
  initialHeight: 0.3,
  scale: 1,
};

const coneFolder = gui.addFolder("Cone");
coneFolder
  .add(coneParams, "scale", 0.5, 2, 0.1)
  .name("Scale")
  .onChange(() => {
    updateCone();
  });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights

const hemisphereLight = new THREE.HemisphereLight("white", "grey", 0.9);
scene.add(hemisphereLight);

// Objects

// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const cylinderSmall = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
  material
);
cylinderSmall.rotateX(300);

// function updateCylinderSmall() {
//   cylinderSmall.geometry.dispose();
//   cylinderSmall.geometry = new THREE.CylinderGeometry(
//     cylinderSmallParams.radius,
//     cylinderSmallParams.radius,
//     0.2,
//     32
//   );
// }

let previousRadius = cylinderSmallParams.radius;

function updateCylinderSmall() {
  cylinderSmall.geometry.dispose();
  cylinderSmall.geometry = new THREE.CylinderGeometry(
    cylinderSmallParams.radius,
    cylinderSmallParams.radius,
    0.2,
    32
  );

  if (cylinderSmallParams.radius > previousRadius) {
    sphere.position.y += 0.01;
  } else if (cylinderSmallParams.radius < previousRadius) {
    sphere.position.y -= 0.01;
  }

  previousRadius = cylinderSmallParams.radius;
}

const cylinderMedium = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 0.02, 32),
  material
);

cylinderMedium.position.y = 1.11;

function updateCylinderMedium() {
  cylinderMedium.geometry.dispose();
  cylinderMedium.geometry = new THREE.CylinderGeometry(
    cylinderMediumParams.radius,
    cylinderMediumParams.radius,
    0.02,
    32
  );
}

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), material);
sphere.position.y = 0.8;

function updateSphere() {
  sphere.geometry.dispose();
  sphere.geometry = new THREE.SphereGeometry(sphereParams.radius, 16, 16);
}

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), material);
cube.position.y = 1.24;

function updateCube() {
  cube.geometry.dispose();
  cube.geometry = new THREE.BoxGeometry(
    boxParams.size,
    boxParams.size,
    boxParams.size
  );
}

const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 32), material);
cone.position.y = 1.51;
cone.rotateX(Math.PI);

function updateCone() {
  cone.geometry.dispose();
  cone.geometry = new THREE.ConeGeometry(
    coneParams.initialRadius * coneParams.scale,
    coneParams.initialHeight * coneParams.scale,
    32
  );
}

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

scene.add(plane, sphere, cube, cone, cylinderSmall, cylinderMedium);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// Update Size
