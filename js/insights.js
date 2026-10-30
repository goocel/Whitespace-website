/* Insights page only: filter buttons show all insights, perspectives or case studies. */
(function () {
  const buttons = [...document.querySelectorAll(".insight-filter")];
  const cards = [...document.querySelectorAll(".insight-grid .insight-card")];
  const count = document.querySelector(".insight-filters__count span");
  if (!buttons.length) return;

  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      let shown = 0;
      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.type === filter;
        card.hidden = !show;
        if (show) shown++;
      });
      count.textContent = shown;
    })
  );
})();
