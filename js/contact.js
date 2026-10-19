/* Contact page: preselect the topic from ?practice=… and compose the message as an email. */
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const practice = new URLSearchParams(window.location.search).get("practice");
  const topic = form.elements.practice;
  if (practice && [...topic.options].some((o) => o.value === practice)) topic.value = practice;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const field = (name) => form.elements[name].value.trim();
    const topicLabel = topic.value ? topic.options[topic.selectedIndex].text : "Not sure yet";
    const details = [
      `Name: ${field("name")}`,
      field("position") && `Position: ${field("position")}`,
      field("institution") && `Company: ${field("institution")}`,
      field("phone") && `Phone: ${field("phone")}`,
      `Email: ${field("email")}`,
      `Topic: ${topicLabel}`,
    ].filter(Boolean);
    const body = [field("message"), "", ...details].join("\n");

    const subject = `Conversation request: ${topicLabel}`;
    window.location.href =
      `mailto:contact@whitespace.id?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  });
})();
