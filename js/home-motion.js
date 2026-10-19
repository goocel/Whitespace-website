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
       (Per-cube parallax was tried and dropped: stacked cubes separate and show gaps.) */
    const stage = document.querySelector(".hero__matrix");
    const heroSvg = document.querySelector("#heroMatrix .iso-svg");
    if (stage && heroSvg && window.matchMedia("(pointer: fine)").matches) {
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

    /* ---------- Runway chart: lines draw, points pop in ---------- */
    const chart = document.querySelector(".chart svg");
    if (chart) {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(chart.querySelector(".rw-before"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0)
        .fromTo(chart.querySelector(".rw-pivot"), { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)" }, 0.85)
        .fromTo(chart.querySelector(".rw-after"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0.9)
        .fromTo(chart.querySelector(".rw-end"), { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2.5)" }, 2.4);
      ScrollTrigger.create({ trigger: chart, start: "top 80%", once: true, onEnter: () => tl.play() });
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

    reveal(".about__body > p");
    reveal(".matrix > .practice");
    reveal(".case__text > *");
  });
})();
