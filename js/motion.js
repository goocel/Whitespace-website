/*
 * Shared page motion with GSAP + ScrollTrigger, loaded on every page.
 * Replaces the CSS transitions (base.css / components.css) with GSAP timelines for smoother easing.
 * Home-only motion (hero matrix, runway chart) lives in js/home-motion.js.
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

    /* ---------- Inner page hero intro ---------- */
    const intro = [
      ".breadcrumb",
      ".page-hero .display",
      ".page-hero .lead",
      ".page-hero__aside p",
      ".contact-page__intro > .display",
      ".contact-page__intro > .lead",
      ".contact-page__intro > .details > div",
    ].filter((selector) => document.querySelector(selector));
    if (intro.length) {
      gsap.from(intro, { y: 32, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, delay: 0.1 });
    }

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

    /* ---------- Engagement timelines: bars grow from the left ---------- */
    document.querySelectorAll(".data-table").forEach((table) => {
      const bars = table.querySelectorAll(".timeline__bar");
      if (!bars.length) return;
      gsap.set(bars, { scaleX: 0, transformOrigin: "0 50%" });
      ScrollTrigger.create({
        trigger: table,
        start: "top 85%",
        once: true,
        onEnter: () => gsap.to(bars, { scaleX: 1, duration: 1.2, ease: "expo.out", stagger: 0.12, delay: 0.3 }),
      });
    });

    /* ---------- Working-model diagrams (AI Implementation): each one acts out its model ----------
       build: we build next to you, then hand the solution over (the small cube moves to YOU).
       cobuild: your IT and us start apart and slide together into one overlapping block.
       embed: your team appears, then we drop in beside IT.
       Plays once in view; hovering the card plays it again. */
    const modelMotion = {
      build: (svg, tl) =>
        tl
          .from(svg.querySelector(".m-you"), { autoAlpha: 0, y: 10, duration: 0.5, ease: "power2.out" })
          .from(svg.querySelector(".m-us"), { x: 40, autoAlpha: 0, duration: 0.8, ease: "expo.out" }, 0.15)
          .fromTo(
            svg.querySelector(".m-piece"),
            { x: 94, y: -14, scale: 0.3, autoAlpha: 0, transformOrigin: "50% 50%" },
            { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(2)" },
            0.75
          )
          .to(svg.querySelector(".m-piece"), { x: 0, duration: 0.8, ease: "power2.inOut" }, 1.1)
          .to(svg.querySelector(".m-piece"), { keyframes: { y: [-14, -36, 0] }, duration: 0.8, ease: "sine.inOut" }, 1.1),
      cobuild: (svg, tl) =>
        tl
          .from(svg.querySelector(".m-it"), { x: -26, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, 0)
          .from(svg.querySelector(".m-us"), { x: 26, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, 0.1),
      embed: (svg, tl) =>
        tl
          .from(svg.querySelector(".m-team"), { autoAlpha: 0, scale: 0.92, transformOrigin: "50% 50%", duration: 0.6, ease: "power2.out" })
          .from(svg.querySelector(".m-it"), { autoAlpha: 0, y: 8, duration: 0.4, ease: "power2.out" }, 0.3)
          .from(svg.querySelector(".m-us"), { y: -64, autoAlpha: 0, duration: 0.8, ease: "back.out(1.4)" }, 0.55),
    };
    const modelTimelines = [];
    document.querySelectorAll(".model__diagram svg[data-model]").forEach((svg) => {
      const build = modelMotion[svg.dataset.model];
      if (!build) return;
      const tl = build(svg, gsap.timeline({ paused: true }));
      modelTimelines.push(tl);
      svg.closest(".model").addEventListener("mouseenter", () => {
        if (tl.progress() === 1) tl.restart();
      });
    });
    if (modelTimelines.length) {
      ScrollTrigger.create({
        trigger: ".models",
        start: "top 80%",
        once: true,
        onEnter: () => modelTimelines.forEach((tl, i) => gsap.delayedCall(i * 0.25, () => tl.play())),
      });
    }

    /* ---------- Content reveals on scroll ---------- */
    const reveal = (selector, vars = {}) => {
      if (!document.querySelector(selector)) return;
      gsap.set(selector, { y: 28, autoAlpha: 0 });
      ScrollTrigger.batch(selector, {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true, ...vars }),
      });
    };

    reveal(".section-label, .split--head > *, .split > .title");
    reveal(".values > .value", { stagger: 0.1 });
    reveal(".phase__art, .phase__title");
    reveal(".step", { stagger: 0.05 });
    reveal(".features > .feature", { stagger: 0.1 });
    reveal(".tiles > li", { stagger: 0.05 });
    reveal(".roles > .role", { stagger: 0.1 });
    reveal(".form > .field, .form__footer", { stagger: 0.05 });
    reveal(".compare__row", { stagger: 0.06 });
    reveal(".overlap > *", { stagger: 0.1 });
    reveal(".approach > li", { stagger: 0.08 });
    reveal(".journeys > .journey", { stagger: 0.08 });
    reveal(".offer-grid > .offer", { stagger: 0.1 });
    reveal(".service-list > .service-row", { stagger: 0.08 });
    reveal(".insight-grid, .insight-filters");
    reveal(".pullquote, .why__wrap");
    reveal(".table-wrap");
    reveal(".next-link");
    reveal(".contact__box");

    return () => root.classList.remove("gsap-motion");
  });
})();
