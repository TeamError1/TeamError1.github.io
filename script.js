/* Three.js + GSAP animations for the TeamError1 landing page */

// Grab the canvas element and detect motion preferences.
const canvas = document.getElementById("hero-canvas");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const isSmallScreen = window.innerWidth < 768;
const hasThree = typeof THREE !== "undefined";

// --- THREE.JS BACKGROUND ---
if (canvas && hasThree && !prefersReducedMotion && !isSmallScreen) {
  // Scene + camera setup.
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 5;

  // Renderer draws to the canvas with transparency.
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Light setup: ambient + directional for a soft glow.
  const ambientLight = new THREE.AmbientLight(0x8aa2ff, 0.6);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(2, 2, 4);
  scene.add(ambientLight, directionalLight);

  // Simple geometry: rotating cube for performance.
  const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
  const material = new THREE.MeshStandardMaterial({
    color: 0x7c3aed,
    emissive: 0x120024,
    metalness: 0.45,
    roughness: 0.3,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  let targetRotationX = 0;
  let targetRotationY = 0;
  let baseRotationX = 0;
  let baseRotationY = 0;

  // Mouse interaction for subtle rotation.
  window.addEventListener("mousemove", (event) => {
    targetRotationY = (event.clientX / window.innerWidth - 0.5) * 0.6;
    targetRotationX = (event.clientY / window.innerHeight - 0.5) * 0.6;
  });

  // Animation loop: rotate the cube and redraw the scene.
  const animate = () => {
    baseRotationX += 0.003;
    baseRotationY += 0.004;

    cube.rotation.x = baseRotationX + targetRotationX;
    cube.rotation.y = baseRotationY + targetRotationY;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  // Keep the canvas and camera responsive.
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
} else if (canvas) {
  // Hide the canvas if reduced motion is preferred or on small screens.
  canvas.style.display = "none";
}

// --- GSAP ANIMATIONS ---
if (window.gsap && !prefersReducedMotion) {
  const hasScrollTrigger = typeof ScrollTrigger !== "undefined";
  const hasScrollTo = typeof ScrollToPlugin !== "undefined";

  if (hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (hasScrollTo) {
    gsap.registerPlugin(ScrollToPlugin);
  }

  // Fade-in hero content on load.
  gsap.from(".hero-title", {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: "power3.out",
  });
  gsap.from(".hero-subtitle", {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 0.2,
    ease: "power3.out",
  });

  // Subtle floating animation for the hero stack.
  gsap.to(".hero-stack", {
    y: -12,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // Scroll-triggered reveal animations for each section.
  gsap.utils.toArray(".reveal").forEach((element) => {
    const animationConfig = {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: "power2.out",
    };

    if (hasScrollTrigger) {
      gsap.from(element, {
        ...animationConfig,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
        },
      });
    } else {
      gsap.from(element, animationConfig);
    }
  });

  // Smooth scroll for anchor links.
  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) {
        return;
      }
      event.preventDefault();
      if (hasScrollTo) {
        gsap.to(window, {
          duration: 1,
          scrollTo: target,
          ease: "power2.out",
        });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Hover animation for CTA buttons.
  document.querySelectorAll(".cta-button").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, { scale: 1.05, duration: 0.2, ease: "power2.out" });
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, { scale: 1, duration: 0.2, ease: "power2.out" });
    });
  });
}
