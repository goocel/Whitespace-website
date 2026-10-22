/*
 * Inner-page hero illustration in 3D (three.js, WebGL), like the Home and About heroes. Used on
 * the three practice pages and Careers: the cubes of the page's <div class="page-hero__art"
 * data-illustration="…"> come from the same builder in js/isometric.js, and play the same intro
 * (where each cube starts, its delay, whether it fades in) with GSAP, as js/motion.js does for
 * the svg.
 *
 * Renderer, camera fit and lights come from js/iso-gl.js, so the canvas lands exactly on the svg
 * and the layout does not change. The canvas reaches past the svg (bleed) so cubes that fly in
 * from outside the frame are drawn on their way in. No WebGL, no GSAP, or three.js failed to
 * load → the svg stays. Reduced motion → the finished shape, still.
 */
(function () {
  const { gsap, Isometric } = window;
  const holder = document.querySelector(".page-hero__art[data-illustration]");
  const svg = holder && holder.querySelector(".iso-svg");
  const build = holder && Isometric && Isometric.ILLUSTRATIONS[holder.dataset.illustration];
  if (!svg || !build || !gsap || !window.IsoGL || !IsoGL.supported()) return;

  holder.dataset.gl = "loading";
  IsoGL.load()
    .then(start)
    .catch(() => delete holder.dataset.gl);

  function start(THREE) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Same voxels and intro as the svg: later voxels at a position win, then the default motion.
    const unique = new Map();
    build().forEach((v) => unique.set(`${v.x},${v.y},${v.z}`, v));
    const voxels = Isometric.withMotion([...unique.values()], 70).filter((v) => v.tone !== "ghost");

    const mid = (key) => (Math.min(...voxels.map((v) => v[key])) + Math.max(...voxels.map((v) => v[key])) + 1) / 2;
    let gl;
    try {
      gl = IsoGL.stage(THREE, { holder, svg, target: [mid("x"), mid("y"), mid("z")], bleed: 0.35 });
    } catch (error) {
      delete holder.dataset.gl;
      return;
    }
    const { scene, draw } = gl;

    /* ---------- Cubes: lit greys; orange keeps the svg's flat faces, as on the live site ---------- */
    const TONE = { paper: "#f6f7f8", light: "#e9ebee", mid: "#b9bec4", dark: "#3a3f45", night: "#30353b", nightHi: "#3c4148" };
    // BoxGeometry faces: +x (right), −x, +y (top), −y, +z (left), −z
    const ORANGE_FACES = ["#999999", "#1a1a1a", "#f2902a", "#1a1a1a", "#1a1a1a", "#999999"];
    const geometry = new THREE.BoxGeometry(0.94, 0.94, 0.94);
    const at = (p, [x, y, z]) => p.set(x + 0.5, z + 0.5, y + 0.5);

    const cubes = voxels.map((v) => {
      const material =
        v.tone === "orange"
          ? ORANGE_FACES.map((color) => new THREE.MeshBasicMaterial({ color, transparent: true }))
          : new THREE.MeshLambertMaterial({ color: TONE[v.tone] || TONE.light, transparent: true });
      const mesh = new THREE.Mesh(geometry, material);
      at(mesh.position, [v.x, v.y, v.z]);
      scene.add(mesh);
      return { v, mesh, materials: [].concat(material) };
    });

    /* ---------- Intro: each cube slides from `from` to its place, as js/motion.js does ---------- */
    const intro = gsap.timeline({ paused: true });
    if (!reduced) {
      cubes.forEach(({ v, mesh, materials }) => {
        const delay = (v.delay || 0) / 1000;
        const from = new THREE.Vector3();
        at(from, v.from || [v.x, v.y, v.z]);
        intro.fromTo(mesh.position, { x: from.x, y: from.y, z: from.z }, { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z, duration: 1.3, ease: "expo.out" }, delay);
        if (v.fade) intro.fromTo(materials, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.out" }, delay);
      });
    }

    /* ---------- Draw only while something moves: the intro or the camera ---------- */
    let wasActive = false;
    const render = () => {
      const turning = gl.step();
      const active = intro.isActive();
      // One more frame after the intro ends, so its last step is drawn too.
      if (active || wasActive || turning) draw();
      wasActive = active;
    };

    const stage = holder.closest(".page-hero") || holder;
    if (!reduced) {
      stage.addEventListener("pointermove", (event) => gl.aim(...IsoGL.pointerIn(stage, event)));
      stage.addEventListener("pointerleave", () => gl.aim(0, 0));
    }

    holder.dataset.gl = "on";
    draw();
    if (reduced) return;

    gsap.ticker.add(render);
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      intro.play();
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => entry.isIntersecting && play(), { threshold: 0.35 }).observe(holder);
    } else {
      play();
    }
  }
})();
