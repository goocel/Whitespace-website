/*
 * Tiny isometric voxel renderer for the cube illustrations.
 * Each voxel is { x, y, z, tone }. Axes: x runs down-right, y runs down-left, z runs up.
 */
(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const COS = Math.cos(Math.PI / 6);

  // [top, left face, right face] — light, dark, orange and night match the live site's
  // stone, ink, signal and night tones; paper is the white variant.
  const TONES = {
    light: ["#f4f5f6", "#9aa0a7", "#c6cad0"],
    paper: ["#ffffff", "#c6cad0", "#e2e4e7"],
    mid: ["#c6cad0", "#6b7179", "#9aa0a7"],
    dark: ["#4a4f56", "#15171a", "#2b2e33"],
    orange: ["#f2902a", "#1a1a1a", "#999999"],
    night: ["#30353b", "#1a1d21", "#23272c"],
    nightHi: ["#3c4148", "#1c1f23", "#2b2e33"],
  };

  // How much darker the seam between cubes is than the face it outlines (0–1).
  const SEAM = 0.08;

  function darken(hex, amount) {
    const n = parseInt(hex.slice(1), 16);
    const ch = (shift) => Math.round(((n >> shift) & 255) * (1 - amount));
    return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
  }

  function project(x, y, z) {
    return [(x - y) * COS, (x + y) * 0.5 - z];
  }

  // Every cube is drawn at the origin and moved into place with a CSS translate,
  // so it can animate from `from` (start) to its own position (end).
  function points(corners) {
    return corners
      .map(([x, y, z]) => project(x, y, z).map((n) => n.toFixed(3)).join(","))
      .join(" ");
  }

  const FACES = {
    top: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]],
    left: [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]],
    right: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]],
  };

  function polygon(corners, attrs) {
    const el = document.createElementNS(SVG_NS, "polygon");
    el.setAttribute("points", points(corners));
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    return el;
  }

  const posOf = (v) => [v.x, v.y, v.z];
  const sum = ([x, y, z]) => x + y + z;

  /**
   * Default "assemble" motion: each cube drops in from 3 units above and fades in,
   * rippling diagonally from the back corner. Orange accents land last, ghost
   * outlines fade in at the very end. Voxels that already define `from`/`delay` keep them.
   */
  function withMotion(voxels, step) {
    const out = voxels.map((v) => {
      if (v.tone === "ghost" || v.from) return { ...v };
      return {
        ...v,
        from: [v.x, v.y, v.z + 3],
        fade: true,
        delay: v.delay ?? Math.round((v.x + v.y) * step + v.z * 45 + (v.tone === "orange" ? 350 : 0)),
      };
    });
    const last = Math.max(0, ...out.map((v) => v.delay || 0));
    out.forEach((v) => {
      if (v.tone === "ghost" && v.delay === undefined) Object.assign(v, { fade: true, delay: last + 300 });
    });
    return out;
  }

  /** Play the assemble animation once the svg scrolls into view. */
  function playWhenVisible(svg) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      svg.dataset.on = "true";
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        svg.dataset.on = "true";
        observer.disconnect();
      },
      { threshold: 0.35 }
    );
    observer.observe(svg);
  }

  /**
   * Render voxels into an <svg>.
   * options.animate: false to render the finished state only (default true).
   * options.step: delay in ms per diagonal step of the default motion (default 70).
   * options.pad: empty space around the shape, in cubes (default 0.1; the live site uses 0.4).
   * options.onFace(el, voxel, side): hook to decorate faces (e.g. hover data).
   */
  function render(voxels, options = {}) {
    const animate = options.animate !== false;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "iso-svg");

    // Later voxels with the same position win.
    const unique = new Map();
    voxels.forEach((v) => unique.set(`${v.x},${v.y},${v.z}`, v));
    let list = [...unique.values()];
    if (animate) list = withMotion(list, options.step ?? 70);

    // Paint back to front; a moving cube is ordered by the nearer of its start and end.
    const depth = (v) => Math.max(sum(posOf(v)), sum(v.from || posOf(v)));
    list.sort((a, b) => (a.tone === "ghost") - (b.tone === "ghost") || depth(a) - depth(b) || a.z - b.z);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    list.forEach((voxel) => {
      // Bounds use the final position only; the start position may sit outside the frame.
      Object.values(FACES).flat().forEach(([dx, dy, dz]) => {
        const [px, py] = project(voxel.x + dx, voxel.y + dy, voxel.z + dz);
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);
      });

      const [ax, ay] = project(voxel.x, voxel.y, voxel.z);
      const [bx, by] = project(...(voxel.from || posOf(voxel)));
      const g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("class", `c c-${voxel.tone || "light"}`);
      g.style.setProperty("--ax", `${ax.toFixed(3)}px`);
      g.style.setProperty("--ay", `${ay.toFixed(3)}px`);
      g.style.setProperty("--bx", `${bx.toFixed(3)}px`);
      g.style.setProperty("--by", `${by.toFixed(3)}px`);
      g.style.setProperty("--bo", voxel.fade ? "0" : "1");
      g.style.setProperty("--d", `${voxel.delay || 0}ms`);
      // Position and tone, so other scripts (e.g. js/about-morph.js) can move the cube later.
      g.dataset.v = `${voxel.x},${voxel.y},${voxel.z}`;
      g.dataset.tone = voxel.tone || "light";

      if (voxel.tone === "ghost") {
        const ghost = {
          stroke: "#f2902a",
          "stroke-width": "0.03",
          "stroke-dasharray": "0.08 0.06",
          "stroke-linejoin": "round",
        };
        ["left", "right", "top"].forEach((side) => {
          g.appendChild(polygon(FACES[side], { ...ghost, fill: side === "top" ? "rgba(242, 144, 42, 0.12)" : "none" }));
        });
      } else {
        const [top, left, right] = TONES[voxel.tone] || TONES.light;
        // Thin seam: each face is outlined in a slightly darker shade of its own colour.
        [["left", left], ["right", right], ["top", top]].forEach(([side, fill]) => {
          const el = polygon(FACES[side], { fill, stroke: darken(fill, SEAM), "stroke-width": "0.015", "stroke-linejoin": "round", class: "vx-face" });
          if (options.onFace) options.onFace(el, voxel, side);
          g.appendChild(el);
        });
      }
      svg.appendChild(g);
    });

    const pad = options.pad ?? 0.1;
    svg.setAttribute(
      "viewBox",
      `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`
    );

    if (animate) {
      svg.dataset.on = "false";
      playWhenVisible(svg);
    } else {
      svg.dataset.on = "true";
    }
    return svg;
  }

  /** Fill a dx × dy × dz block with one tone. */
  function box(x0, y0, z0, dx, dy, dz, tone) {
    const out = [];
    for (let x = x0; x < x0 + dx; x++)
      for (let y = y0; y < y0 + dy; y++)
        for (let z = z0; z < z0 + dz; z++) out.push({ x, y, z, tone });
    return out;
  }

  const v = (x, y, z, tone) => ({ x, y, z, tone });

  /** Deterministic pseudo-random generator so the matrices look the same on every load. */
  function seeded(seed) {
    return () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  /** A height-map "city" of cubes, used for the hero and contact matrices. */
  function heightMap({ size, seed, maxHeight, tones }) {
    const rand = seeded(seed);
    const voxels = [];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const height = Math.floor(rand() * maxHeight);
        const tone = tones(rand(), x, y);
        for (let z = 0; z <= height; z++) {
          voxels.push(v(x, y, z, z === height ? tone : tones.base || "light"));
        }
      }
    }
    return voxels;
  }

  /**
   * Drops the cubes that are completely hidden behind or under other cubes in this view, so a
   * shape's cube count is the count you can see. Each cube's three outer faces are sampled on a
   * grid and every sample is traced towards the viewer (+x, +y, +z); a cube stays if any sample
   * reaches the viewer unblocked.
   */
  function visibleOnly(voxels) {
    const taken = new Set(voxels.map((c) => `${c.x},${c.y},${c.z}`));
    const N = 6;
    const faces = [(u, w) => [u, w, 1], (u, w) => [u, 1, w], (u, w) => [1, u, w]];
    const seen = (c) =>
      faces.some((face) => {
        for (let i = 0; i < N; i++)
          for (let j = 0; j < N; j++) {
            const [dx, dy, dz] = face((i + 0.5) / N, (j + 0.5) / N);
            let open = true;
            for (let s = 0.02; s < 24 && open; s += 0.04) {
              open = !taken.has(`${Math.floor(c.x + dx + s)},${Math.floor(c.y + dy + s)},${Math.floor(c.z + dz + s)}`);
            }
            if (open) return true;
          }
        return false;
      });
    return voxels.filter(seen);
  }

  /** Calls fn(x, y) for every cell of a cols × rows grid (row by row). */
  function grid(cols, rows, fn) {
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) fn(x, y);
  }

  /** Same deterministic hash as the live site, so scattered start positions match it. */
  function hash(n) {
    const t = 43758.5453 * Math.sin(91.17 * n + 7.3);
    return t - Math.floor(t);
  }

  /** Marks cubes as stationary: they are drawn in place and skip the default drop-in. */
  const still = (cubes) => cubes.map((c) => ({ ...c, from: [c.x, c.y, c.z] }));

  const ILLUSTRATIONS = {
    deck: () => [
      ...box(0, 0, 0, 3, 4, 1, "light"),
      ...box(0, 0, 1, 1, 2, 1, "dark"),
      ...box(0, 3, 1, 2, 1, 1, "dark"),
      v(2, 3, 1, "dark"),
      v(2, 1, 0, "orange"),
    ],
    /* ---- Value-card icons: shapes and motion copied from the live site ---- */

    // A bar of three; the orange cube hops off the bar and lands out in front.
    proactive: () => [
      ...still([v(0, 0, 0, "light"), v(0, 1, 0, "light"), v(0, 2, 0, "light")]),
      { x: 2, y: 1, z: 0, from: [0, 1, 1], tone: "orange", delay: 300 },
    ],

    // A 2×2×2 block; the orange cube drops into the front top corner.
    ownership: () => [
      ...still([...box(0, 0, 0, 2, 2, 1, "light"), v(0, 0, 1, "dark"), v(1, 0, 1, "dark"), v(0, 1, 1, "dark")]),
      { x: 1, y: 1, z: 1, from: [1, 1, 4], fade: true, tone: "orange", delay: 300 },
    ],

    // Four cubes arrive from four directions and meet.
    strategic: () => [
      { x: 0, y: 0, z: 0, from: [0, 0, 1], tone: "light", delay: 200 },
      { x: 1, y: 0, z: 0, from: [2, -1, 0], tone: "dark", delay: 260 },
      { x: 0, y: 1, z: 0, from: [-1, 2, 0], tone: "paper", delay: 320 },
      { x: 1, y: 1, z: 0, from: [2, 2, 0], tone: "orange", delay: 380 },
    ],

    // A spaced 3×3 grid drops in from the back corner; the orange centre lands last.
    network: () => {
      const out = [];
      grid(3, 3, (x, y) => {
        const centre = x === 1 && y === 1;
        out.push({
          x: 2 * x, y: 2 * y, z: 0,
          from: [2 * x, 2 * y, 2],
          fade: true,
          tone: centre ? "orange" : "light",
          delay: centre ? 600 : (x + y) * 80,
        });
      });
      return out;
    },

    // A 3×2×2 block with one gap; the orange cube drops in to fill it.
    tailored: () => [
      ...still(box(0, 0, 0, 3, 2, 2, "light").filter((c) => !(c.x === 2 && c.y === 1 && c.z === 1))),
      { x: 2, y: 1, z: 1, from: [2, 1, 4], fade: true, tone: "orange", delay: 400 },
    ],

    /* ---- Practice icons: shapes and motion copied from the live site ---- */

    // Steps slide in from behind, one by one; the orange cube tops the last step.
    turnaround: () => {
      const out = [];
      for (let t = 0; t < 5; t++)
        for (let a = 0; a <= t; a++)
          out.push({
            x: t, y: 0, z: a,
            from: [4 - t, -2, a],
            tone: t === 4 && a === 4 ? "orange" : a === t ? "dark" : "light",
            delay: 200 + 120 * t + 40 * a,
          });
      return out;
    },

    // 18 cubes fly in from scattered floor positions and gather into a 3×3×2 block.
    productivity: () => {
      const spots = [];
      for (let t = 0; t < 6; t++) for (let a = 0; a < 6; a++) spots.push([a - 2, t - 2]);
      const shuffled = spots
        .map((c, i) => ({ c, k: hash(i + 13) }))
        .sort((p, q) => p.k - q.k)
        .map((p) => p.c);
      const out = [];
      grid(3, 3, (x, y) => {
        for (let z = 0; z < 2; z++) {
          const n = 6 * x + 2 * y + z;
          const [fx, fy] = shuffled[n];
          out.push({
            x, y, z,
            from: [fx, fy, 0],
            tone: z === 1 && x === 2 && y === 2 ? "orange" : z === 1 ? "dark" : "light",
            delay: 150 + 45 * n,
          });
        }
      });
      return out;
    },

    // Two halves slide together from left and right, then two orange cubes drop on top.
    deals: () => {
      const out = [];
      grid(4, 2, (x, y) => {
        for (let z = 0; z < 2; z++)
          out.push({
            x, y, z,
            from: [x < 2 ? x - 2 : x + 2, y, z],
            tone: x < 2 ? "light" : "dark",
            delay: 150 + 60 * z,
          });
      });
      out.push({ x: 1, y: 0, z: 2, from: [1, 0, 6], fade: true, tone: "orange", delay: 1100 });
      out.push({ x: 2, y: 0, z: 2, from: [2, 0, 6], fade: true, tone: "orange", delay: 1200 });
      return out;
    },

    // A base drops in, then a dark ring, then three orange cubes on top.
    capital: () => {
      const out = [];
      grid(3, 3, (x, y) => out.push({ x, y, z: 0, from: [x, y, 3], fade: true, tone: "light", delay: (x + y) * 50 }));
      grid(3, 3, (x, y) => {
        if (x === 2 && y === 2) return;
        out.push({ x, y, z: 1, from: [x, y, 4], fade: true, tone: "dark", delay: 450 + (x + y) * 50 });
      });
      [[0, 0], [1, 0], [0, 1]].forEach(([x, y], i) =>
        out.push({ x, y, z: 2, from: [x, y, 6], fade: true, tone: "orange", delay: 950 + 90 * i })
      );
      return out;
    },

    /* ---- Pillar icons (Oct 2026) ---- */

    // AI Implementation: a business stack with AI running through it. A light 4×4 base (systems,
    // data), a dark 4×4 process layer floating above it with a 2×2 hole, and a 2×2 core that
    // rises from the base through the hole, its orange top standing above the process layer.
    // Motion: the base ripples in place, the process layer slides in row by row from the back,
    // then the core rises from below. Nothing drops from above: cubes are painted in order of
    // the nearer of their start and end, so a cube starting high would cover its neighbours.
    ai: () => {
      const out = [];
      const inCore = (x, y) => x >= 1 && x <= 2 && y >= 1 && y <= 2;
      grid(4, 4, (x, y) => out.push({ x, y, z: 0, from: [x, y, 0], fade: true, tone: "light", delay: (x + y) * 40 }));
      grid(4, 4, (x, y) => {
        if (inCore(x, y)) return;
        out.push({ x, y, z: 2, from: [x - 4, y, 2], fade: true, tone: "dark", delay: 400 + 110 * y });
      });
      grid(4, 4, (x, y) => {
        if (!inCore(x, y)) return;
        for (let z = 1; z <= 3; z++)
          out.push({ x, y, z, from: [x, y, z - 3], fade: true, tone: z === 3 ? "orange" : "mid", delay: 1050 + (x + y - 2) * 70 });
      });
      return out;
    },

    // Fractional Leadership: a stepped organisation (wide base, smaller tier) with an empty
    // seat on top, at the front corner. The tiers drop in, then the orange cube arrives from
    // outside and slides into that seat: senior capacity joining from outside.
    // Base and tier fade in place: a dropping cube is painted late and would cover the cubes above it.
    fractional: () => {
      const out = [];
      grid(3, 3, (x, y) => out.push({ x, y, z: 0, from: [x, y, 0], fade: true, tone: "light", delay: (x + y) * 60 }));
      grid(2, 2, (x, y) => out.push({ x, y, z: 1, from: [x, y, 1], fade: true, tone: "dark", delay: 450 + (x + y) * 90 }));
      out.push({ x: 1, y: 1, z: 2, from: [1, -3, 2], fade: true, tone: "orange", delay: 1100 });
      return out;
    },

    pre: () => [
      ...box(0, 0, 0, 2, 2, 2, "ghost"),
      v(0, 0, 0, "orange"),
    ],
    engagement: () => [
      ...box(0, 0, 0, 2, 2, 1, "light"),
      v(0, 0, 1, "dark"),
      v(1, 0, 1, "ghost"),
      v(0, 1, 1, "ghost"),
      v(1, 1, 1, "ghost"),
    ],
    partnership: () => [
      ...box(0, 0, 0, 2, 2, 1, "light"),
      ...box(0, 0, 1, 2, 2, 1, "dark"),
      v(1, 1, 1, "orange"),
    ],
    // About hero (copied from the live site): a 6×4 field of 1–2 high stacks; every column where
    // (x + 2y) % 5 === 1 is a 3-high tower whose orange top drops in last. Hidden cubes are
    // dropped: 28 cubes show, the same count as the shapes it morphs into (js/about-morph.js).
    about: () => {
      const out = [];
      grid(6, 4, (x, y) => {
        const tower = (x + 2 * y) % 5 === 1;
        const height = tower ? 3 : 1 + Math.round(hash(5 * x + 11 * y));
        for (let z = 0; z < height; z++) {
          const top = z === height - 1;
          if (tower && top) {
            out.push({ x, y, z, from: [x, y, z + 5], fade: true, tone: "orange", delay: 400 + (x + y) * 90 });
          } else {
            out.push({ x, y, z, from: [x, y, z], tone: top ? "light" : "paper" });
          }
        }
      });
      return visibleOnly(out);
    },
    // Careers hero (copied from the live site): two rows of white steps rising to a 5-high
    // column; the orange cube climbs from the foot of the stairs to the top.
    careers: () => {
      const out = [];
      grid(5, 2, (x, y) => {
        for (let z = 0; z <= x; z++) out.push({ x, y, z, from: [x, y, z], tone: z === x ? "light" : "paper" });
      });
      out.push({ x: 4, y: 1, z: 5, from: [-1, 1, 0], tone: "orange", delay: 400 });
      return out;
    },

    // Contact (copied from the live site): a 2×2 tower, 11 high, builds upward layer by layer
    // on a white base ring; the sixth layer is orange.
    tower: () => {
      const out = [];
      for (let z = 0; z < 11; z++)
        for (const [x, y] of [[0, 0], [1, 0], [0, 1], [1, 1]])
          out.push({ x, y, z, from: [x, y, z + 2], fade: true, tone: z === 5 ? "orange" : z % 3 === 2 ? "paper" : "light", delay: 70 * z });
      for (const [x, y] of [[-1, 2], [0, 2], [1, 2], [2, 2], [2, -1], [2, 0], [2, 1], [-1, -1], [-1, 0], [-1, 1], [0, -1], [1, -1]])
        out.push({ x, y, z: 0, from: [x, y, 0], tone: "paper" });
      return out;
    },
    night: () => {
      const tones = (r) => (r > 0.8 ? "nightHi" : "night");
      tones.base = "night";
      const out = heightMap({ size: 7, seed: 7, maxHeight: 4, tones });
      out.push(v(3, 3, 4, "ghost"));
      return out;
    },
  };

  window.Isometric = { render, withMotion, box, heightMap, seeded, visibleOnly, project, darken, TONES, SEAM, ILLUSTRATIONS };
})();
