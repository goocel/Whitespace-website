/*
 * Home page motion with GSAP + ScrollTrigger.
 * Replaces the CSS transitions (base.css / components.css) with GSAP timelines for smoother easing.
 * If GSAP failed to load, or the visitor prefers reduced motion, nothing here runs and the
 * CSS-only animations stay in charge.
 */
(function () {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const root = document.documentElement;
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Switches off the CSS transitions so GSAP is the only thing moving these elements.
    root.classList.add("gsap-motion");

    /* ---------- Hero intro ---------- */
    gsap.from([".hero .display", ".hero .lead", ".hero__actions", ".hero__caption"], {
      y: 32,
      autoAlpha: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.09,
      delay: 0.1,
    });

    /* ---------- Isometric cubes: slide from (--bx, --by) to (--ax, --ay) ---------- */
    document.querySelectorAll(".iso-svg").forEach((svg) => {
      const tl = gsap.timeline({ paused: true });

      svg.querySelectorAll(".c").forEach((cube) => {
        const css = (name) => cube.style.getPropertyValue(name).trim();
        const at = parseFloat(css("--d")) / 1000 || 0;
        const fades = css("--bo") === "0";

        tl.fromTo(
          cube,
          { "--tx": css("--bx"), "--ty": css("--by") },
          { "--tx": css("--ax"), "--ty": css("--ay"), duration: 1.3, ease: "expo.out" },
          at
        );
        if (fades) tl.fromTo(cube, { "--to": 0 }, { "--to": 1, duration: 0.6, ease: "power1.out" }, at);
      });

      ScrollTrigger.create({ trigger: svg, start: "top 88%", once: true, onEnter: () => tl.play() });
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

    /* ---------- Content reveals on scroll ---------- */
    const reveal = (selector, vars = {}) => {
      gsap.set(selector, { y: 28, autoAlpha: 0 });
      ScrollTrigger.batch(selector, {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true, ...vars }),
      });
    };

    reveal(".split--head > *, .split > .title");
    reveal(".about__body > p");
    reveal(".values > .value", { stagger: 0.1 });
    reveal(".matrix > .practice");
    reveal(".phase__art, .phase__title");
    reveal(".step", { stagger: 0.05 });
    reveal(".case__text > *");
    reveal(".table-wrap");
    reveal(".contact__box");

    return () => root.classList.remove("gsap-motion");
  });
})();
