/* Home page only: the interactive hero matrix. */
(function () {
  const { render, heightMap } = window.Isometric;

  const CELL_LABELS = [
    "AI use-case assessment", "Agents and AI tools", "Process automation",
    "Automated reporting", "Knowledge capture", "Team training and adoption",
    "Invoice OCR", "Tender engine", "Chat-based AI assistant",
    "360° diagnostic", "Corporate strategy", "Business model design",
    "Lean operations", "Transformation office", "Dashboards and BI",
    "Turnaround and restructuring", "Organizational productivity", "Deals and growth",
    "Capital management", "Fundraising story", "Working capital",
    "Interim C-level", "Business development as a service", "Embedded partner",
    "Executive coaching",
  ];

  const heroEl = document.getElementById("heroMatrix");
  const heroCaption = document.getElementById("heroCaption");
  if (!heroEl || !heroCaption) return;

  // Touch screens cannot hover, so they get the caption without the hover hint.
  if (!window.matchMedia("(hover: hover)").matches) {
    heroCaption.textContent = "Illustrative: your business as a matrix.";
  }
  const defaultCaption = heroCaption.textContent;
  const HERO_SIZE = 9;
  const WHITESPACE_CELL = "5,4";

  const heroTones = (r) => (r > 0.93 ? "dark" : r > 0.62 ? "mid" : "light");
  heroTones.base = "light";
  const heroVoxels = heightMap({ size: HERO_SIZE, seed: 42, maxHeight: 4, tones: heroTones });

  // The "whitespace": a highlighted empty cell sitting on top of the matrix.
  const [wx, wy] = WHITESPACE_CELL.split(",").map(Number);
  const wsTop = Math.max(...heroVoxels.filter((v) => v.x === wx && v.y === wy).map((v) => v.z));
  heroVoxels.push({ x: wx, y: wy, z: wsTop + 1, tone: "ghost" });

  const topFaces = new Map();
  const heroSvg = render(heroVoxels, {
    step: 45,
    onFace(el, voxel, side) {
      const key = `${voxel.x},${voxel.y}`;
      el.dataset.col = key;
      if (side === "top") topFaces.set(key, el); // sorted bottom-up, so the last one is the highest
    },
  });
  heroEl.appendChild(heroSvg);

  function cellLabel(key) {
    if (key === WHITESPACE_CELL) return "Your whitespace: the cell no one has mapped yet.";
    const [x, y] = key.split(",").map(Number);
    const row = String.fromCharCode(65 + y);
    return `${row}${x + 1} · ${CELL_LABELS[(x * HERO_SIZE + y) % CELL_LABELS.length]}`;
  }

  let activeFace = null;
  heroSvg.addEventListener("mouseover", (event) => {
    const key = event.target.dataset && event.target.dataset.col;
    if (!key) return;
    const face = topFaces.get(key);
    if (face === activeFace) return;
    if (activeFace) activeFace.classList.remove("is-hover");
    activeFace = face;
    face.classList.add("is-hover");
    heroCaption.textContent = cellLabel(key);
  });
  heroSvg.addEventListener("mouseleave", () => {
    if (activeFace) activeFace.classList.remove("is-hover");
    activeFace = null;
    heroCaption.textContent = defaultCaption;
  });

  // Shared with js/hero-3d.js, which draws the same matrix in WebGL on top of this svg.
  window.HeroMatrix = { svg: heroSvg, voxels: heroVoxels, caption: heroCaption, defaultCaption, cellLabel };
})();

/* Home page only: practice cards and "How it works" rows open on point (window.openOnPoint, js/site.js).
   Card points close again once the pointer leaves the list; "How it works" goes back to its first row. */
(function () {
  const { openOnPoint, canHover } = window.Points;
  document.querySelectorAll(".solution").forEach((card) =>
    openOnPoint([...card.querySelectorAll(".point")], ".point__toggle", {
      closable: !canHover,
      closeOnLeave: card.querySelector(".solution__points"),
    })
  );
  openOnPoint([...document.querySelectorAll(".how-step")], ".how-step__toggle", {
    closeOnLeave: document.querySelector(".how-list"),
    restoreOnLeave: true,
  });
})();

/* Home page only: "The problem" card stack loops on its own (wide screens, motion allowed).
   Runs only while the section is on screen and pauses while the pointer is on the cards. */
(function () {
  const section = document.querySelector(".problem");
  const stage = section && section.querySelector(".problem__stage");
  if (!stage) return;
  const cards = [...section.querySelectorAll(".shift")];
  const mq = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
  const STEP_TIME = 2800;

  let step = 0;
  let timer = 0;
  let inView = false;
  let hovered = false;

  const show = (next) => {
    step = next;
    const n = cards.length;
    cards.forEach((card, i) => (card.dataset.d = (step - i + n) % n));
  };

  const run = () => {
    clearInterval(timer);
    timer = 0;
    if (mq.matches && inView && !hovered) timer = setInterval(() => show((step + 1) % cards.length), STEP_TIME);
  };

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    run();
  }, { threshold: 0.35 }).observe(stage);
  stage.addEventListener("mouseenter", () => {
    hovered = true;
    run();
  });
  stage.addEventListener("mouseleave", () => {
    hovered = false;
    run();
  });

  const setMode = () => {
    section.classList.toggle("is-stack", mq.matches);
    if (mq.matches) show(0);
    else cards.forEach((card) => (card.dataset.d = 0));
    run();
  };
  setMode();
  mq.addEventListener("change", setMode);
})();
