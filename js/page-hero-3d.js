/*
 * Inner-page hero illustration in 3D (three.js, WebGL), like the Home and About heroes. Used on
 * the three practice pages, Careers and Contact: the cubes of the page's <div class="page-hero__art">
 * (or .contact-page__art) with data-illustration="…" come from the same builder in
 * js/isometric.js. With GSAP they build from the bottom layer up (each cube rises a little and
 * fades in), rest, fade out and build again, in a loop. Floating cubes keep their own fly-in.
 *
 * Renderer, camera fit and lights come from js/iso-gl.js, so the canvas lands exactly on the svg
 * and the layout does not change. The canvas reaches past the svg (bleed) so cubes that fly in
 * from outside the frame are drawn on their way in. No WebGL, no GSAP, or three.js failed to
 * load → the svg stays. Reduced motion → the finished shape, still.
 */
(function () {
  const { gsap, Isometric } = window;
  const holder = document.querySelector(".page-hero__art[data-illustration], .contact-page__art[data-illustration]");
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
    const TONE = { paper: "#f6f7f8", light: "#e9ebee", mid: "#cdd1d6", dark: "#5b6169", night: "#30353b", nightHi: "#3c4148" };
    // BoxGeometry faces: +x (right), −x, +y (top), −y, +z (left), −z
    const ORANGE_FACES = ["#a3a8ae", "#363a40", "#f2902a", "#363a40", "#363a40", "#a3a8ae"];
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

    /* ---------- Build: cubes rise into place from the bottom layer up, growing from nothing ----------
       The same build opens the hero and then repeats: rest, shrink away top-first, build again.
       Cubes stay opaque and scale instead of fading, so no half-transparent cube ever shows the
       faces behind it. They rise from just below their place, so nothing leaves the top of the
       frame (no clash with the header). */
    const floaters = cubes.filter(({ v }) => v.float);
    // Careers: the orange cube does not grow in place; it appears at the foot of the stairs and
    // climbs them, one step per hop, to the top of the column.
    const CLIMB = holder.dataset.illustration === "careers" ? [[-1, 1, 0], [0, 1, 1], [1, 1, 2], [2, 1, 3], [3, 1, 4], [4, 1, 5]] : null;
    const climber = CLIMB ? cubes.find(({ v }) => v.tone === "orange") : null;
    const builders = cubes.filter((c) => !c.v.float && c !== climber);
    const RISE = 0.6, HOLD = 3, GAP = 0.35, HOP = 0.5, HOP_REST = 0.12, HOP_HIGH = 0.4;
    const loop = gsap.timeline({ paused: true, repeat: -1 });
    if (!reduced && builders.length) {
      const orderOf = (v) => v.z * 0.3 + (v.x + v.y) * 0.035 + (v.tone === "orange" ? 0.2 : 0);
      const last = Math.max(...builders.map(({ v }) => orderOf(v)));
      let settled = last + 1.1;

      if (climber) {
        const { mesh, materials } = climber;
        materials.forEach((m) => (m.transparent = false));
        const p = (i) => { const out = new THREE.Vector3(); at(out, CLIMB[i]); return out; };
        let t = last + 0.9;
        const foot = p(0);
        loop.set(mesh.position, { x: foot.x, y: foot.y, z: foot.z }, 0);
        loop.set(mesh.scale, { x: 0.001, y: 0.001, z: 0.001 }, 0);
        loop.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.6)" }, t);
        t += 0.6;
        for (let i = 1; i < CLIMB.length; i++) {
          const to = p(i);
          // Forward and sideways evenly; up in an arc that clears the step's edge, then lands.
          loop.to(mesh.position, { x: to.x, z: to.z, duration: HOP, ease: "power1.inOut" }, t);
          loop.to(mesh.position, { y: to.y + HOP_HIGH, duration: HOP * 0.55, ease: "power2.out" }, t);
          loop.to(mesh.position, { y: to.y, duration: HOP * 0.45, ease: "power2.in" }, t + HOP * 0.55);
          t += HOP + HOP_REST;
        }
        settled = Math.max(settled, t);
        mesh.position.copy(foot);
        mesh.scale.setScalar(0.001);
      }

      const outAt = settled + HOLD;
      if (climber) loop.to(climber.mesh.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.45, ease: "power2.in" }, outAt);
      const outStart = outAt + (climber ? 0.25 : 0);
      builders.forEach(({ v, mesh, materials }) => {
        materials.forEach((m) => (m.transparent = false));
        const home = mesh.position.y;
        const order = orderOf(v);
        loop.set(mesh.position, { y: home - RISE }, 0);
        loop.set(mesh.scale, { x: 0.001, y: 0.001, z: 0.001 }, 0);
        loop.to(mesh.position, { y: home, duration: 1.1, ease: "expo.out" }, order);
        loop.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "back.out(1.6)" }, order);
        // Out: top layer first, each cube shrinks into its own centre
        loop.to(mesh.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.45, ease: "power2.in" }, outStart + (last - order) * 0.35);
      });
      loop.to({}, { duration: GAP });
      // Hidden until the hero comes into view
      builders.forEach(({ mesh }) => {
        mesh.position.y -= RISE;
        mesh.scale.setScalar(0.001);
      });
    }

    /* ---------- Floating cubes (voxel.float, e.g. Contact "meet"): fly in once, then bob gently ---------- */
    const intro = gsap.timeline({ paused: true });
    if (!reduced) {
      floaters.forEach(({ v, mesh, materials }) => {
        const delay = (v.delay || 0) / 1000;
        const from = new THREE.Vector3();
        at(from, v.from || [v.x, v.y, v.z]);
        intro.fromTo(mesh.position, { x: from.x, y: from.y, z: from.z }, { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z, duration: 1.3, ease: "expo.out" }, delay);
        if (v.fade) intro.fromTo(materials, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.out" }, delay);
        intro.to(mesh.position, { y: "+=0.22", duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
    }

    /* ---------- Draw only while something moves: the intro, a floating cube or the camera ---------- */
    let wasActive = false;
    const render = () => {
      const turning = gl.step();
      const active = intro.isActive() || loop.isActive();
      // One more frame after the intro ends, so its last step is drawn too.
      if (active || wasActive || turning) draw();
      wasActive = active;
    };

    const stage = holder.closest(".page-hero, .contact-page") || holder;
    if (!reduced) {
      stage.addEventListener("pointermove", (event) => gl.aim(...IsoGL.pointerIn(stage, event)));
      stage.addEventListener("pointerleave", () => gl.aim(0, 0));
    }

    holder.dataset.gl = "on";
    draw();
    if (reduced) return;

    gsap.ticker.add(render);
    let played = false;
    const show = (visible) => {
      if (visible && !played) { played = true; intro.play(); }
      visible ? loop.play() : loop.pause();
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => show(entry.isIntersecting), { threshold: 0.35 }).observe(holder);
    } else {
      show(true);
    }
  }
})();
