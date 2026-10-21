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
})();
