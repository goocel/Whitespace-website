/*
 * Home-only motion with GSAP + ScrollTrigger: hero intro, hero matrix tilt, runway chart and
 * the Home-only sections. Cubes and the reveals shared with other pages live in js/motion.js.
 * If GSAP failed to load, or the visitor prefers reduced motion, nothing here runs and the
 * CSS-only animations stay in charge.
 */
(function () {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    /* ---------- Hero intro ---------- */
    gsap.from([".hero .display", ".hero .lead", ".hero__actions", ".hero__caption"], {
      y: 32,
      autoAlpha: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.09,
      delay: 0.1,
    });

    /* ---------- Hero matrix follows the cursor, like the live site's 3D camera ----------
       The whole matrix tilts in 3D and drifts toward the cursor, easing back when it leaves.
       (Per-cube parallax was tried and dropped: stacked cubes separate and show gaps.)
       Only for the svg fallback: with WebGL, js/hero-3d.js turns the 3D camera instead. */
    const stage = document.querySelector(".hero__matrix");
    const heroSvg = document.querySelector("#heroMatrix .iso-svg");
    const in3d = document.getElementById("heroMatrix")?.dataset.gl;
    if (stage && heroSvg && !in3d && window.matchMedia("(pointer: fine)").matches) {
      gsap.set(heroSvg, { transformPerspective: 1100, transformOrigin: "50% 60%" });
      const ease = { duration: 0.9, ease: "power3.out" };
      const tiltY = gsap.quickTo(heroSvg, "rotationY", ease);
      const tiltX = gsap.quickTo(heroSvg, "rotationX", ease);
      const shiftX = gsap.quickTo(heroSvg, "x", ease);
      const shiftY = gsap.quickTo(heroSvg, "y", ease);

      const follow = (nx, ny) => {
        // nx, ny: cursor position across the stage, -1 … 1
        tiltY(nx * 10);
        tiltX(-ny * 6);
        shiftX(nx * 12);
        shiftY(ny * 8);
      };

      stage.addEventListener("pointermove", (event) => {
        const box = stage.getBoundingClientRect();
        follow(((event.clientX - box.left) / box.width) * 2 - 1, ((event.clientY - box.top) / box.height) * 2 - 1);
      });
      stage.addEventListener("pointerleave", () => follow(0, 0));
    }

    /* ---------- Runway chart: the runway dips to its low point, then the orange point climbs
       along the recovery curve from the low to break-even, drawing the line behind it ---------- */
    const chart = document.querySelector(".chart svg");
    if (chart) {
      const after = chart.querySelector(".rw-after");
      const end = chart.querySelector(".rw-end");
      const goal = chart.querySelectorAll(".chart__label text")[1]; // "Break-even EBITDA"
      const length = after.getTotalLength();
      const climb = { progress: 0 };
      const moveEnd = () => {
        const point = after.getPointAtLength(climb.progress * length);
        end.setAttribute("cx", point.x.toFixed(1));
        end.setAttribute("cy", point.y.toFixed(1));
      };
      const CLIMB = { duration: 2.2, ease: "power1.inOut" };

      // Lines use pathLength="1", so the dash offset runs 1 → 0. GSAP rounds px values to whole
      // pixels (1px, then 0px), so the offset is written from a plain number instead.
      const draw = (line, vars) => {
        const state = { offset: 1 };
        const apply = () => (line.style.strokeDashoffset = state.offset.toFixed(4));
        return gsap.fromTo(state, { offset: 1 }, { offset: 0, ...vars, onStart: apply, onUpdate: apply });
      };

      // Loops while the chart is on screen: hold on break-even, fade the drawing out, start again.
      const drawn = chart.querySelectorAll(".rw-line, .rw-pivot, .rw-end, .chart__label text:nth-child(2)");
      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.5 });
      tl.set(goal, { autoAlpha: 0 })
        .set(chart.querySelectorAll(".rw-line"), { autoAlpha: 1 }, 0)
        // draw() writes the offset in onUpdate, which a repeat does not call: undraw both lines here
        .call(() => chart.querySelectorAll(".rw-line").forEach((line) => (line.style.strokeDashoffset = "1")), null, 0)
        .add(draw(chart.querySelector(".rw-before"), { duration: 1.1, ease: "power2.in" }), 0)
        .fromTo(chart.querySelector(".rw-pivot"), { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)" }, 1)
        // Line and point share timing and ease, so the line ends exactly under the moving point.
        .add(draw(after, CLIMB), 1.3)
        .fromTo(climb, { progress: 0 }, { progress: 1, ...CLIMB, onUpdate: moveEnd, onStart: moveEnd }, 1.3)
        .fromTo(end, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 1.3)
        .to(end, { scale: 1.45, transformOrigin: "50% 50%", duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, 3.5)
        .to(goal, { autoAlpha: 1, duration: 0.4 }, 3.5)
        .to(drawn, { autoAlpha: 0, duration: 0.5, ease: "power1.in" }, 6.5);
      ScrollTrigger.create({
        trigger: chart,
        start: "top 80%",
        end: "bottom 20%",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    }

    /* ---------- Home-only content reveals on scroll ---------- */
    const reveal = (selector, vars = {}) => {
      gsap.set(selector, { y: 28, autoAlpha: 0 });
      ScrollTrigger.batch(selector, {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true, ...vars }),
      });
    };

    reveal(".solutions > .solution", { stagger: 0.1 });
    reveal(".how-list > .how-step", { stagger: 0.08 });
    reveal(".case__text > *");

    /* Comparison table: the Whitespace ticks pop in one by one */
    if (document.querySelector(".why-table")) {
      gsap.from(".why-table__us .mark", {
        scale: 0,
        duration: 0.6,
        ease: "back.out(2.5)",
        stagger: 0.08,
        delay: 0.3,
        clearProps: "transform",
        scrollTrigger: { trigger: ".why-table", start: "top 75%", once: true },
      });
    }
  });
})();
