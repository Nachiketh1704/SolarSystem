// Enhanced Solar System 3D Simulation - NASA Edition
// Advanced features with realistic textures and educational content

// === Loading System ===
let loadingProgress = 0;
const loadingFacts = [
  "The Sun contains 99.86% of the mass in our solar system!",
  "Jupiter is so massive it could fit all other planets inside it!",
  "Venus is the hottest planet, not Mercury, due to its thick atmosphere!",
  "A day on Venus is longer than its year!",
  "Saturn's rings are made of billions of ice and rock particles!",
  "Uranus rotates on its side, probably due to an ancient collision!",
  "Neptune's winds can reach speeds of up to 2,100 km/h!",
  "Mars has the largest volcano in the solar system - Olympus Mons!",
  "Earth is the only known planet with liquid water on its surface!",
  "The asteroid belt contains over 1 million asteroids larger than 1 km!",
];

function updateLoadingProgress(progress, text) {
  loadingProgress = progress;
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  const loadingFact = document.getElementById("loading-fact");

  if (progressFill) progressFill.style.width = progress + "%";
  if (progressText)
    progressText.textContent =
      text || `Initializing solar system... ${Math.round(progress)}%`;
  if (loadingFact && Math.floor(progress) % 20 === 0) {
    loadingFact.textContent =
      loadingFacts[Math.floor(Math.random() * loadingFacts.length)];
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 500);
  }
}

// === Scene Setup ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000510);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(0, 30, 150);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
document.getElementById("container").appendChild(renderer.domElement);

// === Enhanced Lighting ===
const ambientLight = new THREE.AmbientLight(0x404040, 0.8); // CHANGED: Increased from 0.4 to 0.8 for brighter planets
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 3.5, 0, 2); // CHANGED: Increased intensity from 2.5 to 3.5
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

// === Texture Loader with Progress ===
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
let texturesLoaded = 0;
let totalTextures = 0;

function loadTexture(url, onLoad, onError) {
  // Skip external texture loading - use fallback colors instead
  // This prevents the loading screen from getting stuck
  texturesLoaded++;
  totalTextures++;

  setTimeout(() => {
    updateLoadingProgress(
      (texturesLoaded / totalTextures) * 90,
      `Initializing solar system... ${Math.round(
        (texturesLoaded / totalTextures) * 100
      )}%`
    );
    if (onLoad) onLoad(null); // Pass null to indicate no texture loaded
  }, 100); // Small delay to show progress

  return null; // Return null texture
}

// === Enhanced Planet Data with Accurate Colors ===
const PLANETS = [
  {
    name: "Mercury",
    color: 0x8c7853, // Grayish-brown like real Mercury
    size: 1.2,
    distance: 15,
    speed: 4.15,
    tilt: 0.01,
    rotationSpeed: 0.0058,
    // Removed texture URL - using fallback colors instead
    description:
      "Mercury is the smallest planet in our solar system and the closest to the Sun. It has extreme temperatures and no atmosphere to speak of.",
    facts: [
      "Mercury has no moons or rings",
      "One day on Mercury equals 59 Earth days",
      "Mercury has a very thin atmosphere called an exosphere",
      "It's the second hottest planet despite being closest to the Sun",
    ],
    stats: {
      diameter: "4,879 km",
      distance: "58 million km",
      period: "88 Earth days",
      day: "58.6 Earth days",
      temperature: "427°C (day) / -173°C (night)",
      moons: "0",
    },
  },
  {
    name: "Venus",
    color: 0xffc649, // Bright yellowish-orange like Venus's clouds
    size: 1.8,
    distance: 20,
    speed: 3.24,
    tilt: (177.4 * Math.PI) / 180,
    rotationSpeed: -0.0024,
    // Removed texture URL - using fallback colors instead
    description:
      "Venus is the hottest planet in our solar system, with surface temperatures hot enough to melt lead. It's often called Earth's twin due to similar size.",
    facts: [
      "Venus rotates backwards compared to most planets",
      "A day on Venus is longer than its year",
      "Venus has the densest atmosphere of any terrestrial planet",
      "It's the brightest planet in our night sky",
    ],
    stats: {
      diameter: "12,104 km",
      distance: "108 million km",
      period: "225 Earth days",
      day: "243 Earth days",
      temperature: "462°C",
      moons: "0",
    },
  },
  {
    name: "Earth",
    color: 0x6b93d6, // Blue like Earth's oceans
    size: 2,
    distance: 25,
    speed: 2.98,
    tilt: (23.5 * Math.PI) / 180,
    rotationSpeed: 0.0167,
    // Removed texture URL - using fallback colors instead
    description:
      "Earth is the only known planet with life. It has liquid water, a protective atmosphere, and a magnetic field that shields us from harmful solar radiation.",
    facts: [
      "Earth is the only known planet with life",
      "71% of Earth's surface is covered with water",
      "Earth's magnetic field protects us from solar radiation",
      "Earth has one natural satellite - the Moon",
    ],
    stats: {
      diameter: "12,756 km",
      distance: "150 million km",
      period: "365.25 days",
      day: "24 hours",
      temperature: "15°C (average)",
      moons: "1",
    },
  },
  {
    name: "Mars",
    color: 0xcd5c5c, // Rusty red like Mars's iron oxide surface
    size: 1.6,
    distance: 30,
    speed: 2.41,
    tilt: (25.2 * Math.PI) / 180,
    rotationSpeed: 0.0166,
    // Removed texture URL - using fallback colors instead
    description:
      "Mars is known as the Red Planet due to iron oxide on its surface. It has the largest volcano and canyon in the solar system.",
    facts: [
      "Mars has the largest volcano in the solar system - Olympus Mons",
      "Mars has seasons similar to Earth",
      "Mars has polar ice caps made of water and carbon dioxide",
      "A day on Mars is about 24 hours and 37 minutes",
    ],
    stats: {
      diameter: "6,792 km",
      distance: "228 million km",
      period: "687 Earth days",
      day: "24h 37m",
      temperature: "-65°C (average)",
      moons: "2",
    },
  },
  {
    name: "Jupiter",
    color: 0xd8ca9d, // Tan/beige like Jupiter's bands
    size: 6,
    distance: 40,
    speed: 1.31,
    tilt: (3.1 * Math.PI) / 180,
    rotationSpeed: 0.0417,
    // Removed texture URL - using fallback colors instead
    description:
      "Jupiter is the largest planet in our solar system. It's a gas giant with a Great Red Spot - a storm larger than Earth that has raged for centuries.",
    facts: [
      "Jupiter is more massive than all other planets combined",
      "Jupiter's Great Red Spot is a storm larger than Earth",
      "Jupiter has at least 79 moons",
      "Jupiter acts as a 'cosmic vacuum cleaner' protecting inner planets",
    ],
    stats: {
      diameter: "142,984 km",
      distance: "778 million km",
      period: "11.9 Earth years",
      day: "9h 56m",
      temperature: "-110°C",
      moons: "79+",
    },
  },
  {
    name: "Saturn",
    color: 0xfad5a5, // Pale gold like Saturn's atmosphere
    size: 5,
    distance: 50,
    speed: 0.97,
    tilt: (26.7 * Math.PI) / 180,
    rotationSpeed: 0.0378,
    // Removed texture URL - using fallback colors instead
    description:
      "Saturn is famous for its prominent ring system. It's a gas giant that's less dense than water - it would float!",
    facts: [
      "Saturn could float in water due to its low density",
      "Saturn's rings are made of billions of ice and rock particles",
      "Saturn has at least 82 moons",
      "Saturn's largest moon, Titan, has a substantial atmosphere",
    ],
    stats: {
      diameter: "120,536 km",
      distance: "1.4 billion km",
      period: "29.5 Earth years",
      day: "10h 42m",
      temperature: "-140°C",
      moons: "82+",
    },
    hasRings: true,
  },
  {
    name: "Uranus",
    color: 0x4fd0e4, // Cyan-blue like Uranus's methane atmosphere
    size: 3.2,
    distance: 60,
    speed: 0.68,
    tilt: (97.8 * Math.PI) / 180,
    rotationSpeed: -0.0142,
    // Removed texture URL - using fallback colors instead
    description:
      "Uranus is unique because it rotates on its side. It's an ice giant with a faint ring system and 27 known moons.",
    facts: [
      "Uranus rotates on its side, probably due to an ancient collision",
      "Uranus was the first planet discovered with a telescope",
      "Uranus has a faint ring system",
      "Uranus has 27 known moons",
    ],
    stats: {
      diameter: "51,118 km",
      distance: "2.9 billion km",
      period: "84 Earth years",
      day: "17h 14m",
      temperature: "-195°C",
      moons: "27",
    },
  },
  {
    name: "Neptune",
    color: 0x4b70dd, // Deep blue like Neptune's methane atmosphere
    size: 3.1,
    distance: 70,
    speed: 0.54,
    tilt: (28.3 * Math.PI) / 180,
    rotationSpeed: 0.0158,
    // Removed texture URL - using fallback colors instead
    description:
      "Neptune is the windiest planet in our solar system, with winds reaching speeds of up to 2,100 km/h. It's a deep blue ice giant.",
    facts: [
      "Neptune has the fastest winds in the solar system",
      "Neptune takes 165 Earth years to orbit the Sun",
      "Neptune was discovered through mathematical calculations",
      "Neptune has 14 known moons",
    ],
    stats: {
      diameter: "49,528 km",
      distance: "4.5 billion km",
      period: "165 Earth years",
      day: "16h 6m",
      temperature: "-200°C",
      moons: "14",
    },
  },
];

// === Enhanced Space Background ===
function createSpaceBackground() {
  // Create a simple starfield background instead of loading external textures
  scene.background = new THREE.Color(0x000510);
}

// === Enhanced Sun Creation ===
function createSun() {
  const sunGeometry = new THREE.SphereGeometry(8, 64, 64);

  // CHANGED: More realistic sun material with enhanced colors and effects
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700, // CHANGED: Brighter gold color
    emissive: 0xffa500, // CHANGED: Orange emissive for more realistic glow
    emissiveIntensity: 1.2, // CHANGED: Increased from 0.8 to 1.2
  });

  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // CHANGED: Enhanced corona with more realistic solar activity colors
  const coronaGeometry = new THREE.SphereGeometry(12, 32, 32);
  const coronaMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.15, // CHANGED: Increased from 0.1 to 0.15 for more visible corona
    side: THREE.BackSide,
  });
  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
  sun.add(corona);

  // CHANGED: Enhanced animated glow with solar flare effects
  const glowGeometry = new THREE.SphereGeometry(15, 32, 32);
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0xffd700) }, // CHANGED: Brighter gold for glow
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec3 vPosition;
      void main() {
        float intensity = 0.4 + 0.3 * sin(time + length(vPosition)); // CHANGED: Enhanced intensity variation
        gl_FragColor = vec4(color, intensity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  sun.add(glow);

  // NEW: Adding solar prominence effects (additional glow layers)
  const prominenceGeometry = new THREE.SphereGeometry(18, 32, 32);
  const prominenceMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0xff4500) }, // Orange-red for solar prominences
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec3 vPosition;
      void main() {
        float intensity = 0.1 + 0.15 * sin(time * 0.5 + length(vPosition) * 2.0);
        gl_FragColor = vec4(color, intensity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  const prominence = new THREE.Mesh(prominenceGeometry, prominenceMaterial);
  sun.add(prominence);

  return sun;
}

// === Planet Creation ===
const planets = [];
const planetSpeeds = [];
const planetAngles = [];
const planetMeshes = [];
const planetOrbits = [];

// === Enhanced Planet Creation ===
function createPlanet(planetData, index) {
  const geometry = new THREE.SphereGeometry(planetData.size, 64, 64);

  // Create material with enhanced colors instead of textures
  const material = new THREE.MeshPhongMaterial({
    color: planetData.color,
    shininess: 30,
    specular: 0x333333,
    // Add some variation based on planet properties
    emissive: new THREE.Color(planetData.color).multiplyScalar(0.1),
  });

  const planet = new THREE.Mesh(geometry, material);
  planet.position.set(planetData.distance, 0, 0);
  planet.rotation.z = planetData.tilt;
  planet.castShadow = true;
  planet.receiveShadow = true;

  // Enhanced visual features for specific planets
  if (planetData.name === "Earth") {
    createEarthFeatures(planet, planetData.size);
    createEarthMoon(planet, planetData.size);
  } else if (planetData.name === "Mars") {
    createMarsFeatures(planet, planetData.size);
  } else if (planetData.name === "Saturn") {
    createSaturnRings(planet, planetData.size);
  } else if (planetData.name === "Jupiter") {
    createJupiterFeatures(planet, planetData.size);
  }

  scene.add(planet);
  planetMeshes[index] = planet;
  planetAngles[index] = Math.random() * Math.PI * 2;
  planetSpeeds[index] = planetData.speed;

  // Create orbit path
  createOrbitPath(planetData.distance, index);

  // Simulate texture loading for progress bar
  loadTexture("", null, null);
}

function createOrbitPath(distance, index) {
  const orbitGeometry = new THREE.RingGeometry(
    distance - 0.1,
    distance + 0.1,
    128
  );
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0x444444,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);
  planetOrbits[index] = orbit;
}

function createEarthFeatures(planet, size) {
  // Add some atmospheric glow
  const atmosphereGeometry = new THREE.SphereGeometry(size * 1.05, 32, 32);
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x87ceeb,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  planet.add(atmosphere);
}

function createJupiterFeatures(planet, size) {
  // Add some atmospheric bands
  for (let i = 0; i < 3; i++) {
    const bandGeometry = new THREE.TorusGeometry(
      size * 1.1 + i * 0.2,
      0.05,
      8,
      32
    );
    const bandMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.1, 0.6, 0.4 + i * 0.1),
      transparent: true,
      opacity: 0.3,
    });
    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.rotation.x = Math.PI / 2;
    planet.add(band);
  }
}

function createSaturnRings(planet, size) {
  const ringGeometry = new THREE.RingGeometry(size * 1.2, size * 2.2, 128);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xb8860b,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  planet.add(ring);
}

function createEarthMoon(planet, size) {
  const moonGeometry = new THREE.SphereGeometry(size * 0.27, 32, 32);
  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    shininess: 5,
  });
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(size * 4, 0, 0);
  moon.userData = {
    isMoon: true,
    orbitRadius: size * 4,
    angle: 0,
    speed: 0.1,
  };
  planet.add(moon);
  planet.userData.moon = moon;
}

function createMarsFeatures(planet, size) {
  // Polar ice caps
  const capGeometry = new THREE.SphereGeometry(size * 0.2, 16, 16);
  const capMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

  const northCap = new THREE.Mesh(capGeometry, capMaterial);
  northCap.position.y = size * 0.9;
  planet.add(northCap);

  const southCap = new THREE.Mesh(capGeometry, capMaterial);
  southCap.position.y = -size * 0.9;
  planet.add(southCap);
}

// === Asteroid Belt ===
function createAsteroidBelt() {
  const asteroidBelt = new THREE.Group();
  const asteroidCount = 1000;

  for (let i = 0; i < asteroidCount; i++) {
    const size = Math.random() * 0.1 + 0.05;
    const geometry = new THREE.SphereGeometry(size, 8, 8);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(0.1, 0.3, 0.3 + Math.random() * 0.3),
    });
    const asteroid = new THREE.Mesh(geometry, material);

    const distance = 32 + Math.random() * 6;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 2;

    asteroid.position.set(
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance
    );

    asteroid.userData = {
      angle: angle,
      distance: distance,
      speed: 0.001 + Math.random() * 0.002,
    };

    asteroidBelt.add(asteroid);
  }

  scene.add(asteroidBelt);
  return asteroidBelt;
}

// === Enhanced Starfield ===
function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 2000;
    positions[i3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i3 + 2] = (Math.random() - 0.5) * 2000;

    const color = new THREE.Color().setHSL(
      0.6 + Math.random() * 0.2,
      0.8,
      0.7 + Math.random() * 0.3
    );
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const starMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 2,
    transparent: true,
    opacity: 0.8,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  return stars;
}

// === Initialize Scene ===
let sun, asteroidBelt, stars;
let globalTimeScale = 1;
let isPaused = false;
let simulationDate = new Date(2024, 0, 1);

function initializeScene() {
  updateLoadingProgress(95, "Creating solar system...");

  // Create celestial bodies
  sun = createSun();
  asteroidBelt = createAsteroidBelt();
  stars = createStarfield();

  // Create planets
  PLANETS.forEach((planetData, index) => {
    createPlanet(planetData, index);
  });

  // Initialize UI
  setupUI();
  setupEventListeners();

  updateLoadingProgress(100, "Ready to explore!");

  setTimeout(() => {
    hideLoadingScreen();
    startAnimation();
  }, 1000);
}

// === UI Setup ===
function setupUI() {
  // Setup planet speed controls
  PLANETS.forEach((planet, index) => {
    const slider = document.getElementById(
      `speed-${planet.name.toLowerCase()}`
    );
    const valueSpan = document.getElementById(
      `val-${planet.name.toLowerCase()}`
    );

    if (slider && valueSpan) {
      slider.addEventListener("input", (e) => {
        const factor = parseFloat(e.target.value);
        planetSpeeds[index] = planet.speed * factor;
        valueSpan.textContent = factor.toFixed(2) + "x";
      });

      // Make value span editable
      valueSpan.contentEditable = true;
      valueSpan.addEventListener("blur", () => {
        let factor = parseFloat(valueSpan.textContent.replace("x", ""));
        if (isNaN(factor) || factor < 0.1) factor = 0.1;
        if (factor > 5) factor = 5;
        slider.value = factor;
        planetSpeeds[index] = planet.speed * factor;
        valueSpan.textContent = factor.toFixed(2) + "x";
      });
    }
  });

  // Setup time scale control
  const timeScaleSelect = document.getElementById("time-scale-select");
  if (timeScaleSelect) {
    timeScaleSelect.addEventListener("change", (e) => {
      globalTimeScale = parseFloat(e.target.value);
      updateTimeDisplay();
    });
  }

  // Setup planet selector
  const planetSelect = document.getElementById("planet-select");
  if (planetSelect) {
    planetSelect.addEventListener("change", (e) => {
      const index = parseInt(e.target.value);
      if (isNaN(index)) {
        resetCamera();
      } else {
        focusOnPlanet(index);
      }
    });
  }

  // Setup view presets
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document
        .querySelectorAll(".preset-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const view = btn.dataset.view;
      switch (view) {
        case "overview":
          resetCamera();
          break;
        case "inner":
          focusOnInnerSystem();
          break;
        case "outer":
          focusOnOuterSystem();
          break;
      }
    });
  });
}

function setupEventListeners() {
  // Time controls
  document.getElementById("pause-btn")?.addEventListener("click", () => {
    isPaused = true;
    document.getElementById("pause-btn").style.display = "none";
    document.getElementById("resume-btn").style.display = "inline-block";
  });

  document.getElementById("resume-btn")?.addEventListener("click", () => {
    isPaused = false;
    document.getElementById("pause-btn").style.display = "inline-block";
    document.getElementById("resume-btn").style.display = "none";
  });

  document.getElementById("fast-forward-btn")?.addEventListener("click", () => {
    globalTimeScale = globalTimeScale < 1000 ? globalTimeScale * 10 : 1;
    document.getElementById("time-scale-select").value = globalTimeScale;
    updateTimeDisplay();
  });

  document.getElementById("reverse-btn")?.addEventListener("click", () => {
    globalTimeScale = -Math.abs(globalTimeScale);
    updateTimeDisplay();
  });

  // Panel controls
  document.getElementById("collapse-btn")?.addEventListener("click", () => {
    document.getElementById("control-panel").style.display = "none";
    document.getElementById("expand-btn").style.display = "block";
  });

  document.getElementById("expand-btn")?.addEventListener("click", () => {
    document.getElementById("control-panel").style.display = "block";
    document.getElementById("expand-btn").style.display = "none";
  });

  // Info panel
  document.getElementById("close-info")?.addEventListener("click", () => {
    document.getElementById("info-panel").classList.remove("active");
  });

  // Help panel
  document.getElementById("help-btn")?.addEventListener("click", () => {
    document.getElementById("help-panel").classList.add("active");
  });

  document.getElementById("close-help")?.addEventListener("click", () => {
    document.getElementById("help-panel").classList.remove("active");
  });

  // Bottom UI
  document
    .getElementById("screenshot-btn")
    ?.addEventListener("click", takeScreenshot);
  document
    .getElementById("fullscreen-btn")
    ?.addEventListener("click", toggleFullscreen);

  // Toggle controls
  document
    .getElementById("toggle-orbits")
    ?.addEventListener("click", toggleOrbits);
  document
    .getElementById("toggle-asteroids")
    ?.addEventListener("click", toggleAsteroids);
  document
    .getElementById("toggle-labels")
    ?.addEventListener("click", toggleLabels);
}

// === Camera Controls ===
let cameraControls = {
  isDragging: false,
  lastX: 0,
  lastY: 0,
  theta: 0,
  phi: Math.PI / 2,
  radius: 150,
  target: new THREE.Vector3(0, 0, 0),
};

function setupCameraControls() {
  // Mouse controls
  renderer.domElement.addEventListener("mousedown", (e) => {
    cameraControls.isDragging = true;
    cameraControls.lastX = e.clientX;
    cameraControls.lastY = e.clientY;
  });

  window.addEventListener("mousemove", (e) => {
    if (!cameraControls.isDragging) return;

    const deltaX = e.clientX - cameraControls.lastX;
    const deltaY = e.clientY - cameraControls.lastY;

    cameraControls.theta -= deltaX * 0.01;
    cameraControls.phi -= deltaY * 0.01;
    cameraControls.phi = Math.max(
      0.1,
      Math.min(Math.PI - 0.1, cameraControls.phi)
    );

    updateCameraPosition();

    cameraControls.lastX = e.clientX;
    cameraControls.lastY = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    cameraControls.isDragging = false;
  });

  // Scroll controls
  renderer.domElement.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1.1 : 0.9;
    cameraControls.radius *= delta;
    cameraControls.radius = Math.max(20, Math.min(500, cameraControls.radius));
    updateCameraPosition();
  });

  // Touch controls
  let touchStartX, touchStartY;
  renderer.domElement.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  });

  renderer.domElement.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;

      cameraControls.theta -= deltaX * 0.01;
      cameraControls.phi -= deltaY * 0.01;
      cameraControls.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, cameraControls.phi)
      );

      updateCameraPosition();

      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  });

  // Enhanced Keyboard controls with automatic description display
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        if (selectedPlanetIndex > 0) {
          focusOnPlanet(selectedPlanetIndex - 1);
          showPlanetInfo(selectedPlanetIndex - 1);
        } else if (selectedPlanetIndex === -1) {
          // If no planet selected, start with the last planet
          focusOnPlanet(PLANETS.length - 1);
          showPlanetInfo(PLANETS.length - 1);
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        if (selectedPlanetIndex < PLANETS.length - 1) {
          focusOnPlanet(selectedPlanetIndex + 1);
          showPlanetInfo(selectedPlanetIndex + 1);
        } else if (selectedPlanetIndex === -1) {
          // If no planet selected, start with the first planet
          focusOnPlanet(0);
          showPlanetInfo(0);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        // Quick navigation - jump by 2 planets forward
        const nextIndex = Math.min(selectedPlanetIndex + 2, PLANETS.length - 1);
        if (nextIndex !== selectedPlanetIndex) {
          focusOnPlanet(nextIndex);
          showPlanetInfo(nextIndex);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        // Quick navigation - jump by 2 planets backward
        const prevIndex = Math.max(selectedPlanetIndex - 2, 0);
        if (prevIndex !== selectedPlanetIndex) {
          focusOnPlanet(prevIndex);
          showPlanetInfo(prevIndex);
        }
        break;
      case " ":
        e.preventDefault();
        togglePause();
        break;
      case "Escape":
        e.preventDefault();
        // Close info panel and return to overview
        document.getElementById("info-panel").classList.remove("active");
        resetCamera();
        break;
      case "h":
      case "H":
        e.preventDefault();
        // Toggle help panel
        const helpPanel = document.getElementById("help-panel");
        helpPanel.classList.toggle("active");
        break;
    }
  });
}

function updateCameraPosition() {
  const x =
    cameraControls.radius *
    Math.sin(cameraControls.phi) *
    Math.sin(cameraControls.theta);
  const y = cameraControls.radius * Math.cos(cameraControls.phi);
  const z =
    cameraControls.radius *
    Math.sin(cameraControls.phi) *
    Math.cos(cameraControls.theta);

  camera.position.set(x, y, z);
  camera.lookAt(cameraControls.target);
}

// === Planet Selection and Focus ===
let selectedPlanetIndex = -1;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function setupPlanetSelection() {
  renderer.domElement.addEventListener("click", (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
      const planetIndex = planetMeshes.indexOf(intersects[0].object);
      if (planetIndex !== -1) {
        focusOnPlanet(planetIndex);
        showPlanetInfo(planetIndex);
      }
    }
  });

  // Hover effects
  renderer.domElement.addEventListener("mousemove", (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
      renderer.domElement.style.cursor = "pointer";
    } else {
      renderer.domElement.style.cursor = "default";
    }
  });
}

function focusOnPlanet(index) {
  selectedPlanetIndex = index;
  const planet = planetMeshes[index];
  const planetData = PLANETS[index];

  // Animate camera to planet
  const targetDistance = planetData.size * 8;
  const targetPosition = planet.position
    .clone()
    .add(new THREE.Vector3(0, planetData.size * 2, targetDistance));

  animateCamera(targetPosition, planet.position);

  // Update UI
  document.getElementById("planet-select").value = index;

  // Enhanced planet highlighting with pulsing effect
  planetMeshes.forEach((mesh, i) => {
    if (i === index) {
      mesh.material.emissive.setHex(0x666666);
      mesh.material.emissiveIntensity = 0.4;
      
      // Add pulsing animation to selected planet
      const originalScale = mesh.scale.clone();
      const pulseAnimation = () => {
        if (selectedPlanetIndex === i) {
          const time = Date.now() * 0.003;
          const scale = 1 + Math.sin(time) * 0.1;
          mesh.scale.setScalar(scale);
          requestAnimationFrame(pulseAnimation);
        } else {
          mesh.scale.copy(originalScale);
        }
      };
      pulseAnimation();
    } else {
      mesh.material.emissive.setHex(0x000000);
      mesh.material.emissiveIntensity = 0;
    }
  });

  // Add visual feedback notification
  showPlanetNotification(planetData.name);
}

function showPlanetInfo(index) {
  const planetData = PLANETS[index];
  const infoPanel = document.getElementById("info-panel");

  // Update info panel content
  document.getElementById("info-title").textContent = planetData.name;
  document.getElementById("info-diameter").textContent =
    planetData.stats.diameter;
  document.getElementById("info-distance").textContent =
    planetData.stats.distance;
  document.getElementById("info-period").textContent = planetData.stats.period;
  document.getElementById("info-day").textContent = planetData.stats.day;
  document.getElementById("info-temperature").textContent =
    planetData.stats.temperature;
  document.getElementById("info-moons").textContent = planetData.stats.moons;
  document.getElementById("info-description-text").textContent =
    planetData.description;

  // Update facts list
  const factsList = document.getElementById("info-facts-list");
  factsList.innerHTML = "";
  planetData.facts.forEach((fact) => {
    const li = document.createElement("li");
    li.textContent = fact;
    factsList.appendChild(li);
  });

  // Show panel
  infoPanel.classList.add("active");
}

// Enhanced visual feedback notification for planet navigation
function showPlanetNotification(planetName) {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.planet-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'planet-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">🌍</div>
      <div class="notification-text">
        <strong>Focusing on ${planetName}</strong>
        <div class="notification-subtitle">Use ← → arrows to navigate | ESC to close</div>
      </div>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    background: linear-gradient(135deg, rgba(15, 15, 25, 0.95), rgba(15, 15, 25, 0.8));
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 12px;
    padding: 15px 20px;
    z-index: 1000;
    opacity: 0;
    animation: notificationSlideIn 0.4s ease forwards;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  `;

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes notificationSlideIn {
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    @keyframes notificationSlideOut {
      to {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
    }
    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
    }
    .notification-icon {
      font-size: 1.5rem;
    }
    .notification-text strong {
      color: #ffd700;
      font-size: 1rem;
      display: block;
    }
    .notification-subtitle {
      color: #bbb;
      font-size: 0.8rem;
      margin-top: 2px;
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'notificationSlideOut 0.3s ease forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
}

function resetCamera() {
  selectedPlanetIndex = -1;
  cameraControls.target.set(0, 0, 0);
  cameraControls.radius = 150;
  cameraControls.theta = 0;
  cameraControls.phi = Math.PI / 2;
  updateCameraPosition();

  // Remove planet highlights
  planetMeshes.forEach((mesh) => {
    mesh.material.emissive.setHex(0x000000);
    mesh.material.emissiveIntensity = 0;
  });

  document.getElementById("planet-select").value = "";
  document.getElementById("info-panel").classList.remove("active");
}

function animateCamera(targetPosition, lookAtTarget) {
  const startPosition = camera.position.clone();
  const startLookAt = cameraControls.target.clone();
  let progress = 0;

  function animate() {
    progress += 0.02;
    if (progress >= 1) {
      progress = 1;
    }

    // Smooth easing
    const ease = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(startPosition, targetPosition, ease);
    cameraControls.target.lerpVectors(startLookAt, lookAtTarget, ease);
    camera.lookAt(cameraControls.target);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

// === Utility Functions ===
function updateTimeDisplay() {
  const timeScaleElement = document.getElementById("time-scale");
  const currentDateElement = document.getElementById("current-date");

  if (timeScaleElement) {
    const scaleText =
      globalTimeScale === 1
        ? "1x Speed"
        : globalTimeScale > 1
        ? `${globalTimeScale}x Fast`
        : globalTimeScale < 0
        ? `${Math.abs(globalTimeScale)}x Reverse`
        : `${globalTimeScale}x Slow`;
    timeScaleElement.textContent = scaleText;
  }

  if (currentDateElement) {
    currentDateElement.textContent = simulationDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  }
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pause-btn").style.display = isPaused
    ? "none"
    : "inline-block";
  document.getElementById("resume-btn").style.display = isPaused
    ? "inline-block"
    : "none";
}

function toggleOrbits() {
  const btn = document.getElementById("toggle-orbits");
  const show = btn.classList.contains("active");

  planetOrbits.forEach((orbit) => {
    orbit.visible = !show;
  });

  btn.classList.toggle("active");
}

function toggleAsteroids() {
  const btn = document.getElementById("toggle-asteroids");
  const show = btn.classList.contains("active");

  if (asteroidBelt) {
    asteroidBelt.visible = !show;
  }

  btn.classList.toggle("active");
}

function toggleLabels() {
  const btn = document.getElementById("toggle-labels");
  btn.classList.toggle("active");
  // Label toggle logic would go here
}

function takeScreenshot() {
  const canvas = renderer.domElement;
  const link = document.createElement("a");
  link.download = "solar-system-screenshot.png";
  link.href = canvas.toDataURL();
  link.click();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function focusOnInnerSystem() {
  cameraControls.target.set(0, 0, 0);
  cameraControls.radius = 80;
  updateCameraPosition();
}

function focusOnOuterSystem() {
  cameraControls.target.set(0, 0, 0);
  cameraControls.radius = 200;
  updateCameraPosition();
}

// === Animation Loop ===
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    const delta = clock.getDelta();
    const scaledDelta = delta * globalTimeScale;

    // Update simulation date
    simulationDate.setTime(
      simulationDate.getTime() + scaledDelta * 1000 * 60 * 60 * 24
    );

    // Update planets
    PLANETS.forEach((planetData, index) => {
      if (planetMeshes[index]) {
        // Orbital motion
        planetAngles[index] +=
          (planetSpeeds[index] / planetData.distance) * scaledDelta * 0.1;
        const x = Math.cos(planetAngles[index]) * planetData.distance;
        const z = Math.sin(planetAngles[index]) * planetData.distance;
        planetMeshes[index].position.set(x, 0, z);

        // Planetary rotation
        planetMeshes[index].rotation.y +=
          planetData.rotationSpeed * scaledDelta;

        // Update moon if exists
        if (planetMeshes[index].userData.moon) {
          const moon = planetMeshes[index].userData.moon;
          moon.userData.angle += moon.userData.speed * scaledDelta;
          const moonX =
            Math.cos(moon.userData.angle) * moon.userData.orbitRadius;
          const moonZ =
            Math.sin(moon.userData.angle) * moon.userData.orbitRadius;
          moon.position.set(moonX, 0, moonZ);
        }
      }
    });

    // Update asteroid belt
    if (asteroidBelt) {
      asteroidBelt.children.forEach((asteroid) => {
        asteroid.userData.angle += asteroid.userData.speed * scaledDelta;
        const x =
          Math.cos(asteroid.userData.angle) * asteroid.userData.distance;
        const z =
          Math.sin(asteroid.userData.angle) * asteroid.userData.distance;
        asteroid.position.x = x;
        asteroid.position.z = z;
      });
    }

    // CHANGED: Update sun glow and prominence effects
    if (sun && sun.children.length > 1) {
      const glow = sun.children[1];
      if (glow.material.uniforms) {
        glow.material.uniforms.time.value += scaledDelta;
      }

      // NEW: Update prominence effect if it exists
      if (sun.children.length > 2) {
        const prominence = sun.children[2];
        if (prominence.material.uniforms) {
          prominence.material.uniforms.time.value += scaledDelta * 0.7; // Slower animation for prominence
        }
      }
    }

    // Update time display periodically
    if (Math.floor(clock.getElapsedTime()) % 1 === 0) {
      updateTimeDisplay();
    }
  }

  renderer.render(scene, camera);
}

function startAnimation() {
  setupCameraControls();
  setupPlanetSelection();
  updateTimeDisplay();
  animate();
}

// === Window Resize ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Initialize Application ===
document.addEventListener("DOMContentLoaded", () => {
  // Start loading after a brief delay
  setTimeout(() => {
    createSpaceBackground();
    initializeScene();
  }, 500);
});
