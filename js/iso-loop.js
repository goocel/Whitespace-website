/*
 * Looping motion for the isometric cube illustrations (the svgs drawn by js/isometric.js), the same
 * build as the 3D inner-page heroes (js/page-hero-3d.js): cubes grow from nothing while rising a
 * little into place, from the bottom layer up (orange last); the shape rests, then shrinks away
 * top layer first, and builds again. Cubes stay opaque the whole time, so no half-transparent cube
 * shows the faces behind it, and nothing moves above its own place.
 * Takes over from the one-off reveal in js/motion.js / base.css (Web Animations sit above it).
 * Plain Web Animations API, no library. Paused while off-screen. Skipped for reduced motion, for
 * the 3D heroes (inside [data-gl]), the Home hero and the About hero (js/about-morph.js).
 */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window) || !Element.prototype.animate) return;

  var RISE = 0.6;      // cube heights each cube rises into place
  var LAYER = 300;     // ms between layers (z)
  var STEP = 35;       // ms between diagonal steps inside a layer
  var ORANGE = 200;    // extra ms for the orange accents
  var GROW = 1000;     // ms a cube takes to grow and rise
  var HOLD = 3000;     // ms the finished shape rests
  var SHRINK = 450;    // ms a cube takes to shrink away
  var OUT_STEP = 0.35; // shrink stagger, as a share of the build stagger
  var GAP = 350;       // ms of empty frame before the next build
  var EASE_GROW = "cubic-bezier(0.22, 1.25, 0.36, 1)"; // eases out with a slight settle
  var EASE_SHRINK = "cubic-bezier(0.55, 0, 1, 0.45)";
  var TINY = 0.001;

  function num(cube, name) { return parseFloat(cube.style.getPropertyValue(name)) || 0; }

  function skip(svg) {
    var holder = svg.parentElement;
    return (holder && holder.hasAttribute("data-gl")) ||
      svg.closest(".hero, [data-illustration='about']");
  }

  function build(svg) {
    var cubes = Array.prototype.slice.call(svg.querySelectorAll(".c"));
    if (!cubes.length) return [];
    var items = cubes.map(function (c) {
      var p = (c.dataset.v || "0,0,0").split(",").map(Number);
      var order = p[2] * LAYER + (p[0] + p[1]) * STEP + (c.dataset.tone === "orange" ? ORANGE : 0);
      return { c: c, order: order };
    });
    var last = Math.max.apply(null, items.map(function (i) { return i.order; }));
    var outAt = last + GROW + HOLD;
    var C = outAt + last * OUT_STEP + SHRINK + GAP; // whole cycle
    var at = function (ms) { return Math.min(1, Math.max(0, ms / C)); };

    return items.map(function (i) {
      var x = num(i.c, "--ax"), y = num(i.c, "--ay");
      // Local (0, 0) of every cube is its centre, so scale() shrinks it into its own middle.
      var home = "translate(" + x + "px," + y + "px) scale(1)";
      var low = "translate(" + x + "px," + (y + RISE) + "px) scale(" + TINY + ")";
      var gone = "translate(" + x + "px," + y + "px) scale(" + TINY + ")";
      var out = outAt + (last - i.order) * OUT_STEP;
      return i.c.animate(
        [
          { transform: low, opacity: 1, offset: 0 },
          { transform: low, opacity: 1, offset: at(i.order), easing: EASE_GROW },
          { transform: home, opacity: 1, offset: at(i.order + GROW) },
          { transform: home, opacity: 1, offset: at(out), easing: EASE_SHRINK },
          { transform: gone, opacity: 1, offset: at(out + SHRINK) },
          { transform: gone, opacity: 1, offset: 1 },
        ],
        { duration: C, iterations: Infinity }
      );
    });
  }

  function setup(svg) {
    if (svg.dataset.loop || skip(svg)) return;
    svg.dataset.loop = "1";
    var anims = null;
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!anims) anims = build(svg);
        anims.forEach(function (a) { a.play(); });
      } else if (anims) {
        anims.forEach(function (a) { a.pause(); });
      }
    }, { threshold: 0.1 }).observe(svg);
  }

  function init() { document.querySelectorAll(".iso-svg").forEach(setup); }
  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);
})();
