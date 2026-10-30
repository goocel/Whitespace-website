/* Shared behaviour for every page: navigation, dropdown, isometric illustrations, footer year. */
(function () {
  const { render, ILLUSTRATIONS } = window.Isometric;

  /* ---------- Mobile navigation ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");

  function setNavOpen(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  navToggle.addEventListener("click", () => setNavOpen(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNavOpen(false)));

  /* ---------- Header follows the scroll and the band under it ----------
     .is-scrolled once the page leaves the top (full-width header → floating bar);
     .is-dark while the middle of the header sits over a dark band (black sections, CTA + footer). */
  const header = document.querySelector(".header");
  const darkBands = document.querySelectorAll(".section--dark, .dark, [data-header='dark']");
  let headerFrame = 0;

  function updateHeaderTone() {
    headerFrame = 0;
    const y = header.offsetHeight / 2;
    const dark = [...darkBands].some((band) => {
      const rect = band.getBoundingClientRect();
      return rect.top <= y && rect.bottom >= y;
    });
    header.classList.toggle("is-dark", dark);
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  const queueHeaderTone = () => {
    if (!headerFrame) headerFrame = requestAnimationFrame(updateHeaderTone);
  };
  window.addEventListener("scroll", queueHeaderTone, { passive: true });
  window.addEventListener("resize", queueHeaderTone);
  updateHeaderTone();

  /* ---------- Practices dropdown ---------- */
  const dropdown = document.querySelector(".nav__dropdown");
  const dropdownToggle = dropdown.querySelector(".nav__dropdown-toggle");

  function setDropdownOpen(open) {
    dropdown.classList.toggle("is-open", open);
    dropdownToggle.setAttribute("aria-expanded", String(open));
  }

  dropdownToggle.addEventListener("click", () => setDropdownOpen(!dropdown.classList.contains("is-open")));
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) setDropdownOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setDropdownOpen(false);
      setNavOpen(false);
    }
  });

  /* ---------- Static isometric illustrations: <div class="iso" data-illustration="name" [data-pad="0.4"]> ---------- */
  document.querySelectorAll("[data-illustration]").forEach((el) => {
    const name = el.dataset.illustration;
    const build = ILLUSTRATIONS[name];
    if (!build) return;
    const pad = el.dataset.pad ? parseFloat(el.dataset.pad) : undefined;
    el.appendChild(render(build(), { pad }));
  });

  /* ---------- Reveal-on-scroll: [data-reveal] gets data-on="true" when 40% visible ---------- */
  const reveals = document.querySelectorAll("[data-reveal]");
  const showAll = () => reveals.forEach((el) => (el.dataset.on = "true"));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.on = "true";
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Practice matrix: highlight the row being explored ---------- */
  const practices = document.querySelectorAll(".practice");

  function activatePractice(target) {
    practices.forEach((p) => p.classList.toggle("is-active", p === target));
  }

  practices.forEach((practice) => {
    practice.addEventListener("mouseenter", () => activatePractice(practice));
    practice.addEventListener("focusin", () => activatePractice(practice));
  });

  /* ---------- Points that open on point ----------
     Pointing at an item opens it after a short pause (so sweeping across the list does not open every item
     on the way); on touch screens a tap does the same. One open item per list. Used by the Home practice
     cards and "How it works" rows (js/home.js), and by any <ul data-points> list of li.point (Industries). */
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const HOVER_DELAY = 120;
  const LEAVE_DELAY = 250;

  function openOnPoint(items, toggleSelector, { closable = false, closeOnLeave = null, restoreOnLeave = false } = {}) {
    const open = (item, on = true) => {
      items.forEach((it) => {
        const state = it === item && on;
        it.classList.toggle("is-open", state);
        it.querySelector(toggleSelector).setAttribute("aria-expanded", state);
      });
    };
    const initial = items.find((it) => it.classList.contains("is-open"));
    let timer;
    items.forEach((item) => {
      const toggle = item.querySelector(toggleSelector);
      toggle.addEventListener("click", () => open(item, closable ? !item.classList.contains("is-open") : true));
      if (!canHover) return;
      item.addEventListener("mouseenter", () => {
        clearTimeout(timer);
        if (!item.classList.contains("is-open")) timer = setTimeout(() => open(item), HOVER_DELAY);
      });
      item.addEventListener("mouseleave", () => clearTimeout(timer));
    });
    if (canHover && closeOnLeave) {
      closeOnLeave.addEventListener("mouseenter", () => clearTimeout(timer));
      closeOnLeave.addEventListener("mouseleave", () => {
        clearTimeout(timer);
        timer = setTimeout(() => (restoreOnLeave && initial ? open(initial) : open(null, false)), LEAVE_DELAY);
      });
    }
  }

  window.Points = { openOnPoint, canHover };
  document.querySelectorAll("[data-points]").forEach((list) =>
    openOnPoint([...list.querySelectorAll(".point")], ".point__toggle", { closable: !canHover, closeOnLeave: list })
  );

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
