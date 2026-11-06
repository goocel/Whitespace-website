/*
 * Looping motion for the isometric cube illustrations (the svgs drawn by js/isometric.js), the same
 * build as the 3D inner-page heroes (js/page-hero-3d.js): cubes grow from nothing while rising a
 * little into place, from the bottom layer up (orange last); the shape rests, then shrinks away
 * top layer first, and builds again. Cubes stay opaque the whole time, so no half-transparent cube
 * shows the faces behind it, and nothing moves above its own place.
 *
 * Light on phones: the loop runs in phases (build, rest, shrink, gap) and only the build and the
 * shrink animate. While the shape rests the finished animations just hold their last frame, so the
 * browser has nothing to redraw. Each illustration stops completely while it is off-screen and
 * starts a fresh build when it comes back. Phones also rest a little longer between rounds.
 *
 * Takes over from the one-off reveal in js/motion.js / base.css (Web Animations sit above it).
 * Plain Web Animations API, no library. Skipped for reduced motion, for the 3D heroes (inside
 * [data-gl]), the Home hero and the About hero (js/about-morph.js).
 */
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window) || !Element.prototype.animate) return;

  var LIGHT = window.matchMedia("(pointer: coarse), (max-width: 900px)").matches;
  var RISE = 0.6;      // cube heights each cube rises into place
  var LAYER = 300;     // ms between layers (z)
  var STEP = 35;       // ms between diagonal steps inside a layer
  var ORANGE = 200;    // extra ms for the orange accents
  var GROW = 1000;     // ms a cube takes to grow and rise
  var HOLD = LIGHT ? 4000 : 3000; // ms the finished shape rests
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

  function setup(svg) {
    if (svg.dataset.loop || skip(svg)) return;
    svg.dataset.loop = "1";

    var cubes = Array.prototype.slice.call(svg.querySelectorAll(".c"));
    if (!cubes.length) return;
    var items = cubes.map(function (c) {
      var p = (c.dataset.v || "0,0,0").split(",").map(Number);
      var x = num(c, "--ax"), y = num(c, "--ay");
      return {
        c: c,
        order: p[2] * LAYER + (p[0] + p[1]) * STEP + (c.dataset.tone === "orange" ? ORANGE : 0),
        // Local (0, 0) of every cube is its centre, so scale() shrinks it into its own middle.
        home: "translate(" + x + "px," + y + "px) scale(1)",
        low: "translate(" + x + "px," + (y + RISE) + "px) scale(" + TINY + ")",
        gone: "translate(" + x + "px," + y + "px) scale(" + TINY + ")",
      };
    });
    var last = Math.max.apply(null, items.map(function (i) { return i.order; }));

    var anims = [], timer = null, run = 0;

    function clear() {
      clearTimeout(timer);
      anims.forEach(function (a) { a.cancel(); });
      anims = [];
    }
    function after(list, ms, next, id) {
      Promise.all(list.map(function (a) { return a.finished; }))
        .then(function () { if (id === run) timer = setTimeout(function () { if (id === run) next(id); }, ms); })
        .catch(function () {}); // cancelled: scrolled away
    }
    function build(id) {
      clear();
      anims = items.map(function (i) {
        return i.c.animate(
          [{ transform: i.low, opacity: 1 }, { transform: i.home, opacity: 1 }],
          { duration: GROW, delay: i.order, easing: EASE_GROW, fill: "both" }
        );
      });
      after(anims, HOLD, shrink, id);
    }
    function shrink(id) {
      var built = anims;
      anims = items.map(function (i) {
        return i.c.animate(
          [{ transform: i.home, opacity: 1 }, { transform: i.gone, opacity: 1 }],
          { duration: SHRINK, delay: (last - i.order) * OUT_STEP, easing: EASE_SHRINK, fill: "both" }
        );
      });
      built.forEach(function (a) { a.cancel(); });
      after(anims, GAP, build, id);
    }

    new IntersectionObserver(function (entries) {
      run++;
      if (entries[0].isIntersecting) build(run);
      else clear(); // the plain finished shape stays, nothing animates
    }, { threshold: 0.1 }).observe(svg);
  }

  function init() { document.querySelectorAll(".iso-svg").forEach(setup); }
  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);
})();
