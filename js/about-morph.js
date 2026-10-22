/*
 * About hero: after the intro, the cubes of the "about" illustration keep transforming between
 * three shapes in a loop. The same 28 cubes move to new positions and change colour, so the shape
 * morphs instead of swapping. Every shape shows all 28 (hidden cubes are dropped with
 * Isometric.visibleOnly), so no cube appears from or vanishes into the inside of a shape.
 *   1. The live-site field with five orange-topped towers (the starting shape)
 *   2. A stepped mound with an orange ridge along the back
 *   3. A 4×4×3 block with a two-deep hole in the front corner (the whitespace), hugged by orange
 * Needs GSAP (html.gsap-motion); without it, or with reduced motion, the first shape stays still.
 */
(function () {
  const { gsap, ScrollTrigger, Isometric } = window;
  if (!gsap || !Isometric) return;

  const svg = document.querySelector('[data-illustration="about"] .iso-svg');
  if (!svg) return;

  const { project, darken, visibleOnly, TONES, SEAM } = Isometric;
  const COUNT = 28; // cubes in every shape
  const PAD = 0.4;
  const HOLD = 0.5; // seconds each shape stays put
  const MOVE = 1.1; // seconds per cube move
  const LIFT = 0.9; // cubes travel in an arc this many cubes high, so they pass over each other
  const RIPPLE = 0.02; // seconds between depth steps of the back-to-front ripple

  const v = (x, y, z, tone) => ({ x, y, z, tone });

  // Shape 2: tiers 7×4 and 6×3, then a ridge of five orange cubes along the back. 28 show.
  function mound() {
    const out = [];
    for (let x = 0; x < 7; x++) for (let y = 0; y < 4; y++) out.push(v(x, y, 0, "paper"));
    for (let x = 0; x < 6; x++) for (let y = 0; y < 3; y++) out.push(v(x, y, 1, "light"));
    for (let x = 0; x < 5; x++) out.push(v(x, 0, 2, "orange"));
    return visibleOnly(out);
  }

  // Shape 3: a 4×4×3 block with the front corner column hollowed two cubes deep. 28 show.
  // Five orange cubes on the top layer hug the hole.
  function notchedBlock() {
    const orange = new Set(["2,1", "3,1", "2,2", "3,2", "2,3"]);
    const out = [];
    for (let x = 0; x < 4; x++)
      for (let y = 0; y < 4; y++)
        for (let z = 0; z < 3; z++) {
          if (x === 3 && y === 3 && z >= 1) continue;
          const tone = z === 2 ? (orange.has(`${x},${y}`) ? "orange" : "light") : "paper";
          out.push(v(x, y, z, tone));
        }
    return visibleOnly(out);
  }

  // The starting shape, read back from the rendered cubes.
  const cubes = [...svg.querySelectorAll(".c")].map((g) => {
    const [x, y, z] = g.dataset.v.split(",").map(Number);
    return { g, faces: g.querySelectorAll("polygon"), pos: { x, y, z, tone: g.dataset.tone } };
  });
  if (cubes.length !== COUNT) return; // the shapes above are built for exactly COUNT cubes

  /* Give every cube a target in the next shape: orange goes to orange, and every cube takes the
     nearest free spot (closest pairs first), so cubes make short moves and rarely cross paths. */
  const dist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z) * 1.5;
  function assign(fromShape, targets) {
    const isOrange = (p) => p.tone === "orange";
    const result = new Map();
    [true, false].forEach((wantOrange) => {
      const src = cubes.filter((c) => isOrange(fromShape.get(c)) === wantOrange);
      const dst = targets.filter((p) => isOrange(p) === wantOrange);
      const pairs = [];
      src.forEach((c) => dst.forEach((p, j) => pairs.push({ c, j, d: dist(fromShape.get(c), p) })));
      pairs.sort((a, b) => a.d - b.d);
      const usedDst = new Set();
      pairs.forEach(({ c, j }) => {
        if (result.has(c) || usedDst.has(j)) return;
        result.set(c, dst[j]);
        usedDst.add(j);
      });
    });
    return result;
  }

  const first = new Map(cubes.map((c) => [c, { ...c.pos }]));
  const second = assign(first, mound());
  const third = assign(second, notchedBlock());
  const shapes = [first, second, third];

  // One fixed frame that fits all three shapes, so nothing jumps when the shape changes.
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  shapes.forEach((shape) =>
    shape.forEach((p) => {
      for (const [dx, dy, dz] of [[0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1], [1, 0, 0], [0, 1, 0], [1, 1, 0]]) {
        const [px, py] = project(p.x + dx, p.y + dy, p.z + dz);
        minX = Math.min(minX, px); maxX = Math.max(maxX, px);
        minY = Math.min(minY, py); maxY = Math.max(maxY, py);
      }
    })
  );
  svg.setAttribute("viewBox", `${minX - PAD} ${minY - PAD} ${maxX - minX + PAD * 2} ${maxY - minY + PAD * 2}`);

  // Shared with js/about-3d.js, which plays the same morph in WebGL on top of this svg:
  // shapes[i][n] is where cube n sits in shape i. While the 3D version runs, the svg loop stays off.
  const holder = svg.parentElement;
  const in3d = () => Boolean(holder.dataset.gl);
  window.AboutMorph = {
    svg,
    holder,
    shapes: shapes.map((shape) => cubes.map((c) => ({ ...shape.get(c) }))),
    timing: { HOLD, MOVE, LIFT, RIPPLE, START: 2.4 }, // START: right after the orange tops have landed
    pauseSvg: () => {},
  };

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    if (!document.documentElement.classList.contains("gsap-motion")) return;

    const depth = (p) => p.x + p.y + p.z;
    // Paint back to front; a moving cube counts as the nearer of where it is and where it goes.
    const paint = (from, to) =>
      [...cubes]
        .sort((a, b) => {
          const da = Math.max(depth(from.get(a)), depth(to.get(a)));
          const db = Math.max(depth(from.get(b)), depth(to.get(b)));
          return da - db || Math.max(from.get(a).z, to.get(a).z) - Math.max(from.get(b).z, to.get(b).z);
        })
        .forEach((c) => svg.appendChild(c.g));

    function morph(from, to) {
      const tl = gsap.timeline({ onStart: () => paint(from, to), onComplete: () => paint(to, to) });
      cubes.forEach((c) => {
        const a = from.get(c);
        const b = to.get(c);
        // Each cube travels in a low arc: up, across, down. Cubes that stay put do not move.
        const still = a.x === b.x && a.y === b.y && a.z === b.z;
        const flight = { t: 0 };
        const place = () => {
          const t = flight.t;
          const lift = still ? 0 : Math.sin(Math.PI * t) * LIFT;
          const [x, y] = project(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t + lift);
          c.g.style.setProperty("--tx", `${x.toFixed(3)}px`);
          c.g.style.setProperty("--ty", `${y.toFixed(3)}px`);
        };
        // A tidy back-to-front ripple.
        const at = depth(a) * RIPPLE;
        tl.fromTo(flight, { t: 0 }, { t: 1, duration: MOVE, ease: "sine.inOut", onUpdate: place }, at);
        const [top, left, right] = TONES[b.tone];
        [left, right, top].forEach((fill, i) =>
          tl.to(c.faces[i], { fill, stroke: darken(fill, SEAM), duration: MOVE * 0.7, ease: "sine.inOut" }, at + MOVE * 0.15)
        );
      });
      return tl;
    }

    const loop = gsap.timeline({ repeat: -1, paused: true });
    shapes.forEach((shape, i) => {
      loop.add(morph(shape, shapes[(i + 1) % shapes.length]), `+=${HOLD}`);
    });

    // Start once the intro has assembled the first shape; pause while the hero is off screen.
    const begin = gsap.delayedCall(window.AboutMorph.timing.START, () => !in3d() && loop.play());
    window.AboutMorph.pauseSvg = () => loop.pause();
    let trigger;
    if (ScrollTrigger) {
      trigger = ScrollTrigger.create({
        trigger: svg,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? begin.progress() === 1 && !in3d() && loop.resume() : loop.pause()),
      });
    }

    return () => {
      begin.kill();
      loop.kill();
      if (trigger) trigger.kill();
    };
  });
})();
