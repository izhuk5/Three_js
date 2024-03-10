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
  .add(sphereParams, "radius", 0.2, 0.31, 0.001)
  .name("Radius")
  .onChange(() => {
    updateSphere();
  });

const cylinderMediumParams = {
  radius: 0.5,
};

const cylinderMediumFolder = gui.addFolder("Cylinder Medium");
cylinderMediumFolder
  .add(cylinderMediumParams, "radius", 0.1, 1, 0.01)
  .name("Radius")
  .onChange(updateCylinderMedium);

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

const hemisphereLight = new THREE.HemisphereLight("white", "grey", 5);
scene.add(hemisphereLight);

// Objects

// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
const cylinderSmallMaterial = new THREE.MeshStandardMaterial({
  color: "#6061fe",
});

const cylinderMediumMaterial = new THREE.MeshStandardMaterial({
  color: "#ff45b7",
});
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "#ff8a7b",
});
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: "#ffdb7b",
});
const coneMaterial = new THREE.MeshStandardMaterial({
  color: "#f5fca5",
});

// Objects
const cylinderSmall = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
  cylinderSmallMaterial
);
cylinderSmall.rotateX(300);

let previousRadius = cylinderSmallParams.radius;

function updateCylinderSmall() {
  cylinderSmall.geometry.dispose();
  cylinderSmall.geometry = new THREE.CylinderGeometry(
    cylinderSmallParams.radius,
    cylinderSmallParams.radius,
    0.2,
    32
  );

  let scaleChange;
  let coneScaleChange;

  if (cylinderSmallParams.radius > previousRadius) {
    sphere.position.y += 0.1;
    cylinderMedium.position.y += 0.1;
    cube.position.y += 0.1;
    scaleChange = 1.01;
    coneScaleChange = 1.02;
    cone.position.y += 0.1;
  } else if (cylinderSmallParams.radius < previousRadius) {
    sphere.position.y -= 0.1;
    cylinderMedium.position.y -= 0.1;
    cube.position.y -= 0.1;
    scaleChange = 0.99;
    coneScaleChange = 0.98;
    cone.position.y -= 0.1;
  } else {
    scaleChange = 1;
    coneScaleChange = 1;
  }

  cube.geometry.dispose();
  cube.geometry = new THREE.BoxGeometry(
    boxParams.size * scaleChange,
    boxParams.size * scaleChange,
    boxParams.size * scaleChange
  );

  cone.geometry.dispose();
  const newRadius = coneParams.initialRadius * coneScaleChange;
  const newHeight = coneParams.initialHeight * coneScaleChange;
  cone.geometry = new THREE.ConeGeometry(newRadius, newHeight, 32);

  coneParams.initialRadius = newRadius;
  coneParams.initialHeight = newHeight;

  previousRadius = cylinderSmallParams.radius;
}

const cylinderMedium = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 0.02, 32),
  cylinderMediumMaterial
);
cylinderMedium.position.y = 1.11;

let previousCylinderMediumRadius = cylinderMediumParams.radius;

function updateCylinderMedium() {
  let radiusChange = cylinderMediumParams.radius - previousCylinderMediumRadius;

  let deltaY = radiusChange > 0 ? 0.1 : radiusChange < 0 ? -0.1 : 0;

  cylinderMedium.geometry.dispose();
  cylinderMedium.geometry = new THREE.CylinderGeometry(
    cylinderMediumParams.radius,
    cylinderMediumParams.radius,
    0.2,
    32
  );

  if (deltaY !== 0) {
    cylinderMedium.position.y += deltaY;
    sphere.position.y += deltaY;
    cylinderSmall.position.y += deltaY;
    cube.position.y += deltaY;
    cone.position.y += deltaY;
  }

  previousCylinderMediumRadius = cylinderMediumParams.radius;

  renderer.render(scene, camera);
}

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 16, 16),
  sphereMaterial
);
sphere.position.y = 0.8;

let previousSphereRadius = sphereParams.radius;

function updateSphere() {
  sphere.geometry.dispose();
  sphere.geometry = new THREE.SphereGeometry(sphereParams.radius, 32, 32);

  let deltaY;
  let scaleChange = 1;

  if (sphereParams.radius > previousSphereRadius) {
    deltaY = 0.05;
    scaleChange = 1.005;
  } else if (sphereParams.radius < previousSphereRadius) {
    deltaY = -0.05;
    scaleChange = 0.995;
  } else {
    deltaY = 0;
  }

  cube.geometry.dispose();
  cube.geometry = new THREE.BoxGeometry(
    boxParams.size * scaleChange,
    boxParams.size * scaleChange,
    boxParams.size * scaleChange
  );

  cone.geometry.dispose();
  const newConeRadius = coneParams.initialRadius * scaleChange;
  const newConeHeight = coneParams.initialHeight * scaleChange;
  cone.geometry = new THREE.ConeGeometry(newConeRadius, newConeHeight, 32);

  sphere.position.y += deltaY;
  cylinderSmall.position.y += deltaY;
  cylinderMedium.position.y += deltaY;
  cube.position.y += deltaY;
  cone.position.y += deltaY;

  previousSphereRadius = sphereParams.radius;
}

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.25, 0.25, 0.25),
  cubeMaterial
);
cube.position.y = 1.24;

let previousCubeSize = boxParams.size;

function updateCube() {
  let sizeChange = boxParams.size - previousCubeSize;
  let deltaY = sizeChange > 0 ? 0.1 : sizeChange < 0 ? -0.1 : 0;

  cube.geometry.dispose();
  cube.geometry = new THREE.BoxGeometry(
    boxParams.size,
    boxParams.size,
    boxParams.size
  );

  if (deltaY !== 0) {
    cube.position.y += deltaY;
    sphere.position.y += deltaY;
    cylinderSmall.position.y += deltaY;
    cylinderMedium.position.y += deltaY;
    cone.position.y += deltaY;
  }
  previousCubeSize = boxParams.size;

  renderer.render(scene, camera);
}

const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 32), coneMaterial);
cone.position.y = 1.51;
cone.rotateX(Math.PI);

let previousConeScale = coneParams.scale;

function updateCone() {
  let scaleChange = coneParams.scale - previousConeScale;
  let deltaY = scaleChange > 0 ? 0.05 : scaleChange < 0 ? -0.05 : 0;

  cone.geometry.dispose();
  cone.geometry = new THREE.ConeGeometry(
    coneParams.initialRadius * coneParams.scale,
    coneParams.initialHeight * coneParams.scale,
    32
  );

  if (deltaY !== 0) {
    cone.position.y += deltaY;
    cylinderSmall.position.y += deltaY;
    cylinderMedium.position.y += deltaY;
    sphere.position.y += deltaY;
    cube.position.y += deltaY;
  }

  previousConeScale = coneParams.scale;

  renderer.render(scene, camera);
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
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

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
