/*
 * Contact page: preselect the topic from ?practice=…, validate the form with visible messages,
 * and compose the message as an email.
 *
 * There is no backend: "Compose email" opens the visitor's email app with the message filled in
 * (mailto:). Nothing is sent or stored by this site, so the status message never says the
 * message was sent — only that the email app should open, with the address as a fallback.
 */
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const EMAIL = "contact@whitespace.id";
  const topic = form.elements.practice;
  const area = form.elements.area;
  const areaField = document.getElementById("f-area-field");
  const status = document.getElementById("formStatus");
  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.innerHTML;

  /* ---------- Topic and Business Transformation practice ---------- */
  // Links from before Oct 2026 point at the four old practices, now part of Business Transformation:
  // they select Business Transformation and fill in the practice.
  const OLD_PRACTICES = ["turnaround-transformation", "organizational-productivity", "deals-growth", "capital-management-advisory"];
  const syncArea = () => {
    const show = topic.value === "business-transformation";
    areaField.hidden = !show;
    if (!show) area.value = "";
  };
  let practice = new URLSearchParams(window.location.search).get("practice");
  if (OLD_PRACTICES.includes(practice)) {
    area.value = practice;
    practice = "business-transformation";
  }
  if (practice && [...topic.options].some((o) => o.value === practice)) topic.value = practice;
  syncArea();
  topic.addEventListener("change", syncArea);

  /* ---------- Validation with visible messages ---------- */
  const MESSAGES = {
    name: () => "Please enter your name.",
    email: (input) => (input.validity.valueMissing ? "Please enter your work email." : "Please enter a valid email address, e.g. name@company.com."),
    message: () => "Please tell us briefly what you would like to talk about.",
  };

  const showError = (input, text) => {
    const error = document.getElementById(`${input.id}-error`);
    input.setAttribute("aria-invalid", text ? "true" : "false");
    input.closest(".field").classList.toggle("is-invalid", Boolean(text));
    if (!error) return;
    error.textContent = text || "";
    error.hidden = !text;
  };

  const check = (input) => {
    input.value = input.value.trim() === "" ? "" : input.value;
    const ok = input.checkValidity();
    showError(input, ok ? "" : MESSAGES[input.name](input));
    return ok;
  };

  const required = Object.keys(MESSAGES).map((name) => form.elements[name]);
  required.forEach((input) => {
    // Re-check while typing only once a message is showing, so nobody is warned mid-word.
    input.addEventListener("input", () => input.getAttribute("aria-invalid") === "true" && check(input));
    input.addEventListener("blur", () => input.value && check(input));
  });

  /* ---------- Submit: open the email app, then say what happens next ---------- */
  const setStatus = (html) => {
    status.innerHTML = html;
    status.hidden = !html;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus("");
    const invalid = required.filter((input) => !check(input));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const field = (name) => form.elements[name].value.trim();
    const label = (select) => (select.value ? select.options[select.selectedIndex].text : "Not sure yet");
    const topicLabel = label(topic);
    const details = [
      `Name: ${field("name")}`,
      field("position") && `Position: ${field("position")}`,
      field("institution") && `Company: ${field("institution")}`,
      field("phone") && `Phone: ${field("phone")}`,
      `Email: ${field("email")}`,
      `Topic: ${topicLabel}`,
      topic.value === "business-transformation" && area.value && `Practice: ${label(area)}`,
    ].filter(Boolean);
    const body = [field("message"), "", ...details].join("\n");
    const subject = `Conversation request: ${topicLabel}`;

    button.disabled = true;
    button.textContent = "Opening your email app…";
    try {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch (error) {
      // Fall through to the message below, which gives the address to write to directly.
    }
    window.setTimeout(() => {
      button.disabled = false;
      button.innerHTML = buttonLabel;
      setStatus(
        `<strong>Your email app should now be open with the message ready.</strong> ` +
          `Press send there to reach us; nothing is sent from this page. ` +
          `If no email app opened, write to <a href="mailto:${EMAIL}">${EMAIL}</a>.`
      );
    }, 1200);
  });
})();
