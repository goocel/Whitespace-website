/*
 * About hero in 3D (three.js, WebGL), like the Home hero: the same 28 cubes and the same three
 * shapes as the svg morph in js/about-morph.js, drawn as lit cubes with thin gaps. The cubes keep
 * morphing between the shapes with the same timing and arcs, and the camera turns a little toward
 * the cursor.
 *
 * Renderer, camera fit and lights come from js/iso-gl.js, so the canvas lands exactly on the svg
 * and the layout does not change. While the 3D version runs, the svg loop stays off. No WebGL,
 * no GSAP, or three.js failed to load → the svg version stays. Reduced motion → the first shape,
 * still.
 */
(function () {
  const morph = window.AboutMorph;
  const { gsap } = window;
  if (!morph || !gsap || !window.IsoGL || !IsoGL.supported()) return;

  const { holder, svg, shapes, timing } = morph;
  holder.dataset.gl = "loading";
  IsoGL.load()
    .then(start)
    .catch(() => delete holder.dataset.gl);

  function start(THREE) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { HOLD, MOVE, LIFT, RIPPLE, START } = timing;

    // The camera turns around the middle of all three shapes.
    const all = shapes.flat();
    const mid = (key) => (Math.min(...all.map((p) => p[key])) + Math.max(...all.map((p) => p[key])) + 1) / 2;
    let gl;
    try {
      gl = IsoGL.stage(THREE, { holder, svg, target: [mid("x"), mid("y"), 1] });
    } catch (error) {
      delete holder.dataset.gl;
      return;
    }
    const { scene, draw } = gl;

    /* ---------- Cubes ----------
       Grey and white cubes are lit; orange cubes keep the svg's flat faces (orange top, dark
       left, grey right), as the live site draws its orange cube. Orange cubes stay orange in
       every shape (js/about-morph.js pairs orange with orange). */
    // Lit, so a shade darker on the sides; chosen to read like the svg's white and light grey.
    const TONE = { paper: new THREE.Color("#f6f7f8"), light: new THREE.Color("#dde0e4") };
    const flat = (color) => new THREE.MeshBasicMaterial({ color });
    // BoxGeometry faces: +x (right), −x, +y (top), −y, +z (left), −z
    const orangeFaces = [flat("#999999"), flat("#1a1a1a"), flat("#f2902a"), flat("#1a1a1a"), flat("#1a1a1a"), flat("#999999")];
    const geometry = new THREE.BoxGeometry(0.94, 0.94, 0.94);

    const first = shapes[0];
    const place = (mesh, x, y, z) => mesh.position.set(x + 0.5, z + 0.5, y + 0.5);
    const meshes = first.map((p) => {
      const orange = p.tone === "orange";
      const mesh = new THREE.Mesh(geometry, orange ? orangeFaces : new THREE.MeshLambertMaterial({ color: (TONE[p.tone] || TONE.light).clone() }));
      place(mesh, p.x, p.y, p.z);
      scene.add(mesh);
      return mesh;
    });

    const render = () => {
      gl.step();
      draw();
    };

    /* ---------- Intro: as the svg, the five orange tops drop in from above ---------- */
    const intro = gsap.timeline({ paused: true });
    first.forEach((p, i) => {
      if (p.tone !== "orange" || reduced) return;
      const mesh = meshes[i];
      const at = (400 + (p.x + p.y) * 90) / 1000;
      mesh.visible = false;
      intro
        .set(mesh, { visible: true }, at)
        .fromTo(mesh.position, { y: p.z + 0.5 + 5 }, { y: p.z + 0.5, duration: 1.3, ease: "expo.out" }, at);
    });

    /* ---------- Morph loop: same arcs, ripple and timing as the svg version ---------- */
    const depth = (p) => p.x + p.y + p.z;
    const morphTo = (from, to) => {
      const tl = gsap.timeline();
      meshes.forEach((mesh, i) => {
        const a = from[i];
        const b = to[i];
        const still = a.x === b.x && a.y === b.y && a.z === b.z;
        const colorFrom = TONE[a.tone];
        const colorTo = TONE[b.tone];
        const flight = { t: 0 };
        tl.fromTo(
          flight,
          { t: 0 },
          {
            t: 1,
            duration: MOVE,
            ease: "sine.inOut",
            // Draw nothing until the tween runs; otherwise building the last morph (shape 3 → 1)
            // would put every cube at its shape-3 spot straight away.
            immediateRender: false,
            onUpdate: () => {
              const t = flight.t;
              const lift = still ? 0 : Math.sin(Math.PI * t) * LIFT;
              place(mesh, a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t + lift);
              // Colour shifts in the middle 70% of the move, as in the svg
              if (colorFrom && colorTo) mesh.material.color.lerpColors(colorFrom, colorTo, Math.min(1, Math.max(0, (t - 0.15) / 0.7)));
            },
          },
          depth(a) * RIPPLE
        );
      });
      return tl;
    };
    const loop = gsap.timeline({ repeat: -1, paused: true });
    shapes.forEach((shape, i) => loop.add(morphTo(shape, shapes[(i + 1) % shapes.length]), `+=${HOLD}`));

    /* ---------- Cursor: the camera follows ---------- */
    const stage = holder.closest(".page-hero") || holder;
    if (!reduced) {
      stage.addEventListener("pointermove", (event) => gl.aim(...IsoGL.pointerIn(stage, event)));
      stage.addEventListener("pointerleave", () => gl.aim(0, 0));
    }

    /* ---------- Start once on screen; pause everything while off screen ---------- */
    morph.pauseSvg();
    holder.dataset.gl = "on";
    draw();
    if (reduced) return;

    let started = false;
    let looping = null;
    const play = () => {
      gsap.ticker.add(render);
      if (!started) {
        started = true;
        intro.play();
        looping = gsap.delayedCall(START, () => loop.play());
      } else if (looping.progress() === 1) {
        loop.resume();
      }
    };
    const pause = () => {
      gsap.ticker.remove(render);
      loop.pause();
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause())).observe(holder);
    } else {
      play();
    }
  }
})();
