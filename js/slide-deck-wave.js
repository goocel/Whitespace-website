/* Home "The problem": colour sweep on "slide deck". Splits the word into one span per letter;
   css/components.css (.is-wave) keeps half the letters orange and half white,
   the boundary running left to right (like a row of dots changing colour). Screen readers still read the plain words (aria-label). */
(function () {
  var el = document.querySelector(".problem .title-accent");
  if (!el || el.classList.contains("is-wave")) return;
  var text = el.textContent;
  el.setAttribute("aria-label", text.trim());
  el.textContent = "";
  text.trim().split("").forEach(function (c, i) {
    var s = document.createElement("span");
    s.className = "ch";
    s.setAttribute("aria-hidden", "true");
    s.style.setProperty("--i", i);
    s.textContent = c;
    el.appendChild(s);
  });
  el.style.setProperty("--n", el.children.length);
  el.classList.add("is-wave");
})();
