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

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
