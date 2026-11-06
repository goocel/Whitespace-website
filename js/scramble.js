/* Home "The problem": looping scramble on "slide deck" — plain JS, no plugin needed */
(function () {
  var el = document.querySelector(".problem .title-accent");
  if (!el) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var text = el.textContent.trim();
  var chars = "abcdefghijklmnopqrstuvwxyz";
  var DURATION = 1800;   // ms for one scramble
  var PAUSE = 3200;      // ms between loops
  var timer = null, raf = null;

  function lockWidth() {
    el.style.minWidth = "";
    el.style.minWidth = el.getBoundingClientRect().width + "px";
  }
  lockWidth();
  window.addEventListener("resize", function () {
    cancelAnimationFrame(raf); clearTimeout(timer);
    el.textContent = text; lockWidth(); timer = setTimeout(run, PAUSE);
  });

  function run() {
    var start = null;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / DURATION, 1);
      var reveal = Math.floor(p * text.length);
      var out = "";
      for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        out += (c === " " || i < reveal) ? c : chars.charAt(Math.floor(Math.random() * chars.length));
      }
      el.textContent = out;
      if (p < 1) raf = requestAnimationFrame(frame);
      else { el.textContent = text; timer = setTimeout(run, PAUSE); }
    }
    raf = requestAnimationFrame(frame);
  }
  timer = setTimeout(run, 1000);
})();
