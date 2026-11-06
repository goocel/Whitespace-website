/* Careers: filter the open-roles table by role name and level. Without JS the full table shows. */
(function () {
  var box = document.querySelector("[data-roles]");
  if (!box) return;
  var form = box.querySelector("form");
  var rows = [].slice.call(box.querySelectorAll("tr[data-role]"));
  var empty = box.querySelector(".roles-table__empty");
  var count = box.querySelector(".roles-table__count");

  function apply() {
    var q = form.q.value.trim().toLowerCase();
    var level = form.level.value;
    var shown = 0;
    rows.forEach(function (r) {
      var ok = (!q || r.textContent.toLowerCase().indexOf(q) > -1) &&
               (!level || r.querySelector('[data-label="Level"]').textContent.trim() === level);
      r.hidden = !ok;
      if (ok) shown++;
    });
    empty.hidden = shown > 0;
    count.textContent = shown + (shown === 1 ? " open role" : " open roles");
  }
  form.addEventListener("input", apply);
  form.addEventListener("change", apply);
  form.addEventListener("reset", function () { setTimeout(apply, 0); });
  apply();
})();
