/*
 * Contact page: preselect the topic from ?practice=…, validate the form with visible messages,
 * and send the message to contact@whitespace.id.
 *
 * There is no backend of our own: messages go through FormSubmit (formsubmit.co, free, no account).
 * The first message ever sent triggers a one-time "Activate form" email to contact@whitespace.id;
 * nothing is delivered until someone clicks it. If the service fails, the visitor is offered the
 * same message as a mailto: link instead.
 */
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const EMAIL = "contact@whitespace.id";
  const ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`;
  const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
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

  /* ---------- Submit: send through FormSubmit, then say what happened ---------- */
  const setStatus = (html) => {
    status.innerHTML = html;
    status.hidden = !html;
  };

  form.addEventListener("submit", async (event) => {
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
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    button.disabled = true;
    button.textContent = "Sending…";
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          _captcha: "false",
          _honey: form.elements._honey.value,
          name: field("name"),
          position: field("position"),
          company: field("institution"),
          phone: field("phone"),
          email: field("email"),
          topic: topicLabel,
          practice: topic.value === "business-transformation" && area.value ? label(area) : "",
          message: field("message"),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || String(result.success) !== "true") throw new Error(result.message || response.status);
      const replyTo = escapeHtml(field("email"));
      form.reset();
      syncArea();
      setStatus(`<strong>Thank you, your message has been sent.</strong> We'll reply to ${replyTo} soon.`);
    } catch (error) {
      // The service could not be reached or refused the message: offer the email app instead.
      console.warn("FormSubmit:", error.message);
      setStatus(
        `<strong>We couldn't send your message just now.</strong> ` +
          (error.message && !/^\d+$/.test(error.message) ? `<small>(${escapeHtml(String(error.message))})</small> ` : "") +
          `<a href="${mailto}">Open it in your email app</a> or write to <a href="mailto:${EMAIL}">${EMAIL}</a>.`
      );
    } finally {
      button.disabled = false;
      button.innerHTML = buttonLabel;
    }
  });
})();
