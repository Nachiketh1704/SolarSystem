// Solar System 3D Simulation using Three.js
// Author: [Your Name]

// === Scene Setup ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101020);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Center the solar system vertically by raising the camera's Y position and looking at the origin
camera.position.set(0, 0, 120);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// === Lighting (brighter for vibrant planets) ===
scene.add(new THREE.AmbientLight(0xffffff, 1.1));
const sunLight = new THREE.PointLight(0xffffff, 3.5, 0, 2);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(40, 60, 80);
scene.add(dirLight);

// === Sun with Enhanced Glow and Realistic Material ===
const sunGeometry = new THREE.SphereGeometry(7, 64, 64);
const sunMaterial = new THREE.MeshPhongMaterial({
  color: 0xffe066,
  emissive: 0xffe066,
  emissiveIntensity: 1.2,
  shininess: 100,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
// Add glow effect to Sun (bigger and more prominent)
const sunGlowMaterial = new THREE.MeshBasicMaterial({
  color: 0xfff7ae,
  transparent: true,
  opacity: 0.45,
});
const sunGlowGeometry = new THREE.SphereGeometry(12, 32, 32);
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
sunGlow.material.depthWrite = false;
sunGlow.material.blending = THREE.AdditiveBlending;
sun.add(sunGlow);

const PLANETS = [
  {
    name: "Mercury",
    color: 0xaaa9ad,
    size: 1,
    distance: 12,
    speed: 4.8,
    slider: "speed-mercury",
    val: "val-mercury",
    material: new THREE.MeshStandardMaterial({
      color: 0xaaa9ad,
      metalness: 0.7,
      roughness: 0.5,
    }),
    tilt: 0.01,
  },
  {
    name: "Venus",
    color: 0xe6c97b,
    size: 1.5,
    distance: 16,
    speed: 3.5,
    slider: "speed-venus",
    val: "val-venus",
    material: new THREE.MeshStandardMaterial({
      color: 0xe6c97b,
      metalness: 0.3,
      roughness: 0.7,
    }),
    tilt: (177.4 * Math.PI) / 180,
  },
  {
    name: "Earth",
    color: 0x3a7bd5,
    size: 1.6,
    distance: 20,
    speed: 2.98,
    slider: "speed-earth",
    val: "val-earth",
    material: new THREE.MeshStandardMaterial({
      color: 0x3a7bd5,
      metalness: 0.2,
      roughness: 0.6,
      emissive: 0x1a3a7b,
      emissiveIntensity: 0.2,
    }),
    tilt: (23.5 * Math.PI) / 180,
  },
  {
    name: "Mars",
    color: 0xc1440e,
    size: 1.2,
    distance: 24,
    speed: 2.4,
    slider: "speed-mars",
    val: "val-mars",
    material: new THREE.MeshStandardMaterial({
      color: 0xc1440e,
      metalness: 0.4,
      roughness: 0.8,
    }),
    tilt: (25.2 * Math.PI) / 180,
  },
  {
    name: "Jupiter",
    color: 0xe0c38a,
    size: 3.5,
    distance: 30,
    speed: 1.3,
    slider: "speed-jupiter",
    val: "val-jupiter",
    material: new THREE.MeshStandardMaterial({
      color: 0xe0c38a,
      metalness: 0.2,
      roughness: 0.7,
    }),
    tilt: (3.1 * Math.PI) / 180,
  },
  {
    name: "Saturn",
    color: 0xf7e7b6,
    size: 3,
    distance: 36,
    speed: 0.96,
    slider: "speed-saturn",
    val: "val-saturn",
    material: new THREE.MeshStandardMaterial({
      color: 0xf7e7b6,
      metalness: 0.2,
      roughness: 0.8,
    }),
    tilt: (26.7 * Math.PI) / 180,
    hasRings: true,
  },
  {
    name: "Uranus",
    color: 0x7ad7f0,
    size: 2.2,
    distance: 42,
    speed: 0.68,
    slider: "speed-uranus",
    val: "val-uranus",
    material: new THREE.MeshStandardMaterial({
      color: 0x7ad7f0,
      metalness: 0.3,
      roughness: 0.7,
    }),
    tilt: (97.8 * Math.PI) / 180,
  },
  {
    name: "Neptune",
    color: 0x4062bb,
    size: 2.1,
    distance: 48,
    speed: 0.54,
    slider: "speed-neptune",
    val: "val-neptune",
    material: new THREE.MeshStandardMaterial({
      color: 0x4062bb,
      metalness: 0.3,
      roughness: 0.7,
    }),
    tilt: (28.3 * Math.PI) / 180,
  },
];

const planetTextureURLs = {
  Mercury: "https://threejs.org/examples/textures/planets/mercury.jpg",
  Venus: "https://threejs.org/examples/textures/planets/venus.jpg",
  Earth: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  Mars: "https://threejs.org/examples/textures/planets/mars_1k_color.jpg",
  Jupiter: "https://threejs.org/examples/textures/planets/jupiter.jpg",
  Saturn: "https://threejs.org/examples/textures/planets/saturn.jpg",
  Uranus: "https://threejs.org/examples/textures/planets/uranus.jpg",
  Neptune: "https://threejs.org/examples/textures/planets/neptune.jpg",
};
const textureLoader = new THREE.TextureLoader();

scene.background = textureLoader.load(
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/space/px.jpg"
);

const planets = [];
const planetOrbits = [];
const planetSpeeds = [];
const planetAngles = [];

const PLANET_DETAILS = {
  Mercury: {
    diameter: "4,880 km",
    period: "88 days",
    fact: "Mercury has almost no atmosphere.",
  },
  Venus: {
    diameter: "12,104 km",
    period: "225 days",
    fact: "Venus spins in the opposite direction to most planets.",
  },
  Earth: {
    diameter: "12,742 km",
    period: "365.25 days",
    fact: "Earth is the only planet known to support life.",
  },
  Mars: {
    diameter: "6,779 km",
    period: "687 days",
    fact: "Mars has the tallest volcano in the solar system.",
  },
  Jupiter: {
    diameter: "139,820 km",
    period: "11.9 years",
    fact: "Jupiter has a giant storm called the Great Red Spot.",
  },
  Saturn: {
    diameter: "116,460 km",
    period: "29.5 years",
    fact: "Saturn could float in water due to its low density.",
  },
  Uranus: {
    diameter: "50,724 km",
    period: "84 years",
    fact: "Uranus rotates on its side.",
  },
  Neptune: {
    diameter: "49,244 km",
    period: "165 years",
    fact: "Neptune has the fastest winds in the solar system.",
  },
};

PLANETS.forEach((p, i) => {
  const orbitGeometry = new THREE.RingGeometry(
    p.distance - 0.05,
    p.distance + 0.05,
    100
  );
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0x888888,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);
  planetOrbits.push(orbit);

  const geometry = new THREE.SphereGeometry(p.size, 48, 48);
  let material;
  if (p.name === "Earth") {
    material = new THREE.MeshPhongMaterial({
      map: textureLoader.load(planetTextureURLs[p.name]),
      shininess: 40,
      specular: 0x888888,
      emissive: 0x222222,
      emissiveIntensity: 0.25,
    });
  } else {
    material = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.3,
      roughness: 0.7,
    });
  }
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(p.distance, 0, 0);
  mesh.rotation.z = p.tilt || 0;
  scene.add(mesh);
  planets.push(mesh);
  planetSpeeds.push(p.speed);
  planetAngles.push(Math.random() * Math.PI * 2);

  if (p.name === "Saturn") {
    const ringGeometry = new THREE.RingGeometry(
      p.size * 1.3,
      p.size * 2.1,
      128
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load(
        "https://threejs.org/examples/textures/planets/saturnringcolor.jpg"
      ),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.2;
    ring.position.set(0, 0, 0);
    mesh.add(ring);
  }

  if (p.name === "Jupiter") {
    const ringGeometry = new THREE.RingGeometry(p.size * 1.1, p.size * 1.3, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xe0c38a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.2;
    ring.position.set(0, 0, 0);
    mesh.add(ring);
  }

  if (p.name === "Uranus") {
    const ringGeometry = new THREE.RingGeometry(p.size * 1.2, p.size * 1.7, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xb2e6f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.1;
    ring.position.set(0, 0, 0);
    mesh.add(ring);
  }

  if (p.name === "Neptune") {
    const ringGeometry = new THREE.RingGeometry(p.size * 1.1, p.size * 1.5, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x8bb3e6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.1;
    ring.position.set(0, 0, 0);
    mesh.add(ring);
  }

  if (p.name === "Mars") {
    const capGeometry = new THREE.SphereGeometry(
      p.size * 0.25,
      24,
      24,
      0,
      Math.PI * 2,
      0,
      Math.PI / 6
    );
    const capMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const northCap = new THREE.Mesh(capGeometry, capMaterial);
    northCap.position.y = p.size * 0.98;
    mesh.add(northCap);
    const southCap = new THREE.Mesh(capGeometry, capMaterial);
    southCap.position.y = -p.size * 0.98;
    southCap.rotation.x = Math.PI;
    mesh.add(southCap);

    const phobosGeometry = new THREE.SphereGeometry(p.size * 0.18, 16, 16);
    const phobosMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.5,
      roughness: 0.7,
    });
    const phobos = new THREE.Mesh(phobosGeometry, phobosMaterial);
    phobos.position.set(p.size * 2.2, 0, 0);
    mesh.add(phobos);
  }

  if (p.name === "Venus") {
    const cloudGeometry = new THREE.SphereGeometry(p.size * 1.04, 32, 32);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    mesh.add(clouds);
  }

  if (p.name === "Earth") {
    const moonOrbitRadius = p.size * 3.2;
    const moonGeometry = new THREE.SphereGeometry(p.size * 0.27, 24, 24);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.4,
      roughness: 0.7,
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.userData = {
      isMoon: true,
      orbitRadius: moonOrbitRadius,
      angle: Math.random() * Math.PI * 2,
    };
    mesh.add(moon);
    mesh.userData.moon = moon;
  }
});

let starTwinkleOffsets = [];
function addStars(numStars = 400) {
  const starGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  const starColors = [];
  starTwinkleOffsets = [];
  for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * 800;
    const y = (Math.random() - 0.5) * 800;
    const z = (Math.random() - 0.5) * 800;
    starVertices.push(x, y, z);

    const color = new THREE.Color().setHSL(
      0.6 + Math.random() * 0.1,
      0.7,
      0.8 + Math.random() * 0.2
    );
    starColors.push(color.r, color.g, color.b);
    starTwinkleOffsets.push(Math.random() * Math.PI * 2);
  }
  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );
  starGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(starColors, 3)
  );
  const starMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.8,
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  stars.name = "stars";
  scene.add(stars);
}
addStars();

PLANETS.forEach((p, i) => {
  const slider = document.getElementById(p.slider);
  const valSpan = document.getElementById(p.val);
  let label = slider.closest("label");
  if (label) {
    const img = label.querySelector(".planet-img");
    if (img) img.remove();
    label.style.justifyContent = "center";
    label.style.textAlign = "center";
    label.style.display = "flex";
    label.style.alignItems = "center";
  }
  valSpan.contentEditable = "true";
  valSpan.style.cursor = "text";
  valSpan.title = "Click to edit speed multiplier";

  valSpan.addEventListener("focus", () => {
    let txt = valSpan.textContent.replace("x", "").trim();
    valSpan.textContent = txt;

    const range = document.createRange();
    range.selectNodeContents(valSpan);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
  valSpan.addEventListener("blur", () => {
    let factor = parseFloat(valSpan.textContent);
    if (isNaN(factor) || factor < 0.1) factor = 0.1;
    if (factor > 5) factor = 5;
    slider.value = factor;
    planetSpeeds[i] = p.speed * factor;
    valSpan.textContent = factor.toFixed(2) + "x";
  });
  valSpan.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      valSpan.blur();
    }
  });

  slider.addEventListener("input", (e) => {
    const factor = parseFloat(e.target.value);
    planetSpeeds[i] = p.speed * factor;
    valSpan.textContent = factor.toFixed(2) + "x";
  });
});

let paused = false;
const pauseBtn = document.getElementById("pause-btn");
const resumeBtn = document.getElementById("resume-btn");
pauseBtn.onclick = () => {
  paused = true;
  pauseBtn.style.display = "none";
  resumeBtn.style.display = "inline-block";
};
resumeBtn.onclick = () => {
  paused = false;
  pauseBtn.style.display = "inline-block";
  resumeBtn.style.display = "none";
};

const clock = new THREE.Clock();
let lastTimestamp = performance.now();
let pausedAt = null;
let running = true;
function animate(now) {
  requestAnimationFrame(animate);
  let delta = 0;
  if (!paused) {
    if (pausedAt !== null) {
      lastTimestamp += now - pausedAt;
      pausedAt = null;
    }
    delta = (now - lastTimestamp) / 1000;
    lastTimestamp = now;
    PLANETS.forEach((p, i) => {
      planetAngles[i] += (planetSpeeds[i] / p.distance) * delta * 0.5;
      const x = Math.cos(planetAngles[i]) * p.distance;
      const z = Math.sin(planetAngles[i]) * p.distance;
      planets[i].position.set(x, 0, z);
      planets[i].rotation.y += 0.02;
      if (p.name === "Earth" && planets[i].userData.moon) {
        const moon = planets[i].userData.moon;
        moon.userData.angle += delta * 1.5;
        const mx = Math.cos(moon.userData.angle) * moon.userData.orbitRadius;
        const mz = Math.sin(moon.userData.angle) * moon.userData.orbitRadius;
        moon.position.set(mx, 0, mz);
      }
    });
    const stars = scene.getObjectByName("stars");
    if (stars) {
      const time = now / 1000;
      stars.material.size = 0.8 + 0.3 * Math.sin(time * 2);
    }
  } else {
    if (pausedAt === null) pausedAt = now;
  }
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const minZoom = 40;
const maxZoom = 300;
renderer.domElement.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    const delta = event.deltaY > 0 ? 1 : -1;

    let newZ = camera.position.z + delta * 8;
    newZ = Math.max(minZoom, Math.min(maxZoom, newZ));
    camera.position.z = newZ;
    camera.lookAt(0, 0, 0);
  },
  { passive: false }
);

let isDragging = false;
let lastX = 0,
  lastY = 0;
let theta = 0;
let phi = Math.PI / 2;
let radius = camera.position.z;

function updateCamera() {
  phi = Math.max(0.15, Math.min(Math.PI - 0.15, phi));
  camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
  camera.position.y = radius * Math.cos(phi);
  camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
  camera.lookAt(0, 0, 0);
}

renderer.domElement.addEventListener("mousedown", (e) => {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  theta -= dx * 0.01;
  phi -= dy * 0.01;
  updateCamera();
});
window.addEventListener("mouseup", () => {
  isDragging = false;
});

renderer.domElement.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }
});
window.addEventListener("touchmove", (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  const dx = e.touches[0].clientX - lastX;
  const dy = e.touches[0].clientY - lastY;
  lastX = e.touches[0].clientX;
  lastY = e.touches[0].clientY;
  theta -= dx * 0.01;
  phi -= dy * 0.01;
  updateCamera();
});
window.addEventListener("touchend", () => {
  isDragging = false;
});

renderer.domElement.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 1 : -1;
    let newRadius = radius + delta * 8;
    newRadius = Math.max(minZoom, Math.min(maxZoom, newRadius));
    radius = newRadius;
    updateCamera();
  },
  { passive: false }
);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let labelDiv = null;
let tooltipDiv = null;

function showLabel(name, x, y) {
  if (!labelDiv) {
    labelDiv = document.createElement("div");
    labelDiv.style.position = "fixed";
    labelDiv.style.background = "rgba(30,30,60,0.95)";
    labelDiv.style.color = "#fff";
    labelDiv.style.padding = "4px 10px";
    labelDiv.style.borderRadius = "6px";
    labelDiv.style.pointerEvents = "none";
    labelDiv.style.fontSize = "0.95rem";
    labelDiv.style.zIndex = 1000;
    document.body.appendChild(labelDiv);
  }
  labelDiv.textContent = name;
  labelDiv.style.left = x + 12 + "px";
  labelDiv.style.top = y + 8 + "px";
  labelDiv.style.display = "block";

  if (!tooltipDiv) {
    tooltipDiv = document.createElement("div");
    tooltipDiv.style.position = "fixed";
    tooltipDiv.style.background = "rgba(20,20,40,0.98)";
    tooltipDiv.style.color = "#fff";
    tooltipDiv.style.padding = "10px 16px";
    tooltipDiv.style.borderRadius = "10px";
    tooltipDiv.style.pointerEvents = "none";
    tooltipDiv.style.fontSize = "0.97rem";
    tooltipDiv.style.zIndex = 1001;
    tooltipDiv.style.boxShadow = "0 2px 12px #0008";
    document.body.appendChild(tooltipDiv);
  }
  const d = PLANET_DETAILS[name];
  if (d) {
    let desc = d.description
      ? `<div style='margin-bottom:6px;'>${d.description}</div>`
      : "";
    tooltipDiv.innerHTML = `${desc}<b>${name}</b><br>Diameter: ${d.diameter}<br>Orbital Period: ${d.period}<br><i>${d.fact}</i>`;
    tooltipDiv.style.left = x + 12 + "px";
    tooltipDiv.style.top = y + 36 + "px";
    tooltipDiv.style.display = "block";
  } else {
    tooltipDiv.style.display = "none";
  }
}
function hideLabel() {
  if (labelDiv) labelDiv.style.display = "none";
  if (tooltipDiv) tooltipDiv.style.display = "none";
}

renderer.domElement.addEventListener("mousemove", (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets);
  if (intersects.length > 0) {
    const idx = planets.indexOf(intersects[0].object);
    showLabel(PLANETS[idx].name, event.clientX, event.clientY);
  } else {
    hideLabel();
  }
});

renderer.domElement.addEventListener("mouseleave", hideLabel);

renderer.domElement.addEventListener("click", (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets);
  if (intersects.length > 0) {
    const idx = planets.indexOf(intersects[0].object);

    const target = planets[idx].position.clone();
    const camTarget = target.clone().add(new THREE.Vector3(0, 6, 12));
    let t = 0;
    const startPos = camera.position.clone();
    function zoomAnim() {
      t += 0.04;
      camera.position.lerpVectors(startPos, camTarget, Math.min(t, 1));
      camera.lookAt(target);
      if (t < 1) requestAnimationFrame(zoomAnim);
    }
    zoomAnim();
  }
});

const controlPanel = document.getElementById("control-panel");
const collapseBtn = document.createElement("button");
collapseBtn.textContent = "⮜";
collapseBtn.id = "collapse-btn";
collapseBtn.style.position = "absolute";
collapseBtn.style.top = "10px";
collapseBtn.style.left = "100%";
collapseBtn.style.marginLeft = "8px";
collapseBtn.style.zIndex = 20;
collapseBtn.style.width = "28px";
collapseBtn.style.height = "28px";
collapseBtn.style.borderRadius = "50%";
collapseBtn.style.border = "none";
collapseBtn.style.background = "#ffb300";
collapseBtn.style.color = "#222";
collapseBtn.style.fontWeight = "bold";
collapseBtn.style.cursor = "pointer";
controlPanel.appendChild(collapseBtn);

const expandBtn = document.createElement("button");
expandBtn.textContent = "⮞";
expandBtn.id = "expand-btn";
expandBtn.style.position = "fixed";
expandBtn.style.top = "50%";
expandBtn.style.left = "0px";
expandBtn.style.transform = "translateY(-50%)";
expandBtn.style.zIndex = 100;
expandBtn.style.width = "28px";
expandBtn.style.height = "28px";
expandBtn.style.borderRadius = "50%";
expandBtn.style.border = "none";
expandBtn.style.background = "#ffb300";
expandBtn.style.color = "#222";
expandBtn.style.fontWeight = "bold";
expandBtn.style.cursor = "pointer";
expandBtn.style.display = "none";
document.body.appendChild(expandBtn);

collapseBtn.onclick = () => {
  controlPanel.style.display = "none";
  expandBtn.style.display = "block";
};
expandBtn.onclick = () => {
  controlPanel.style.display = "flex";
  expandBtn.style.display = "none";
};

let selectedPlanetIndex = null;
function showPlanetDetails(idx) {
  if (idx == null || idx < 0 || idx >= PLANETS.length) {
    if (tooltipDiv) tooltipDiv.style.display = "none";
    return;
  }
  const name = PLANETS[idx].name;
  const d = PLANET_DETAILS[name];
  if (!tooltipDiv) {
    tooltipDiv = document.createElement("div");
    tooltipDiv.style.position = "fixed";
    tooltipDiv.style.background = "rgba(20,20,40,0.98)";
    tooltipDiv.style.color = "#fff";
    tooltipDiv.style.padding = "10px 16px";
    tooltipDiv.style.borderRadius = "10px";
    tooltipDiv.style.pointerEvents = "none";
    tooltipDiv.style.fontSize = "0.97rem";
    tooltipDiv.style.zIndex = 1001;
    tooltipDiv.style.boxShadow = "0 2px 12px #0008";
    document.body.appendChild(tooltipDiv);
  }
  let desc =
    d && d.description
      ? `<div style='margin-bottom:6px;'>${d.description}</div>`
      : "";
  tooltipDiv.innerHTML = `${desc}<b>${name}</b><br>Diameter: ${
    d?.diameter || ""
  }<br>Orbital Period: ${d?.period || ""}<br><i>${d?.fact || ""}</i>`;
  tooltipDiv.style.left = "50%";
  tooltipDiv.style.bottom = "32px";
  tooltipDiv.style.top = "";
  tooltipDiv.style.transform = "translateX(-50%)";
  tooltipDiv.style.display = "block";
}
function hidePlanetDetails() {
  if (tooltipDiv) tooltipDiv.style.display = "none";
}
function focusPlanet(idx) {
  if (idx < 0 || idx >= PLANETS.length) return;
  selectedPlanetIndex = idx;
  const target = planets[idx].position.clone();
  const camTarget = target.clone().add(new THREE.Vector3(0, 6, 12));
  let t = 0;
  const startPos = camera.position.clone();
  function zoomAnim() {
    t += 0.04;
    camera.position.lerpVectors(startPos, camTarget, Math.min(t, 1));
    camera.lookAt(target);
    if (t < 1) requestAnimationFrame(zoomAnim);
  }
  zoomAnim();
  planets.forEach((p, i) => {
    p.material.emissive = p.material.emissive || { set: () => {} };
    if (i === idx) {
      if (p.material.emissive) p.material.emissive.set(0xffff00);
      p.material.emissiveIntensity = 0.5;
    } else {
      if (p.material.emissive) p.material.emissive.set(0x000000);
      p.material.emissiveIntensity = 0.0;
    }
  });
  showPlanetDetails(idx);
}
function clearPlanetFocus() {
  selectedPlanetIndex = null;
  planets.forEach((p) => {
    if (p.material.emissive) p.material.emissive.set(0x000000);
    p.material.emissiveIntensity = 0.0;
  });
  hidePlanetDetails();
}
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    if (selectedPlanetIndex === null) {
      focusPlanet(0);
    } else if (selectedPlanetIndex < PLANETS.length - 1) {
      focusPlanet(selectedPlanetIndex + 1);
    } else {
      clearPlanetFocus();
      let t = 0;
      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(0, 0, 120);
      function zoomOutAnim() {
        t += 0.04;
        camera.position.lerpVectors(startPos, endPos, Math.min(t, 1));
        camera.lookAt(0, 0, 0);
        if (t < 1) requestAnimationFrame(zoomOutAnim);
      }
      zoomOutAnim();
    }
  } else if (e.key === "ArrowLeft") {
    if (selectedPlanetIndex === null || selectedPlanetIndex === 0) {
    } else {
      focusPlanet(selectedPlanetIndex - 1);
    }
  }
});
