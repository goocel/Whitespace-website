/*
 * Reusable form sender for the site (window.FormSend).
 *
 * Two modes, chosen by the caller:
 *   "preview"  No network request at all. Resolves { status: "preview" } with the exact payload that
 *              would be sent, so the page can show it. Use this until FormSubmit activation for
 *              contact@whitespace.id is confirmed. It never reports a message as sent.
 *   "live"     POST to FormSubmit's AJAX endpoint. Resolves { status: "sent" } only when FormSubmit
 *              answers success: "true"; anything else (including "this form needs activation"),
 *              a network error or a timeout resolves { status: "failed", error }.
 *
 * No keys or secrets: FormSubmit only needs the public address. The promise never rejects.
 */
(function () {
  const EMAIL = "contact@whitespace.id";
  const ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`;
  const TIMEOUT_MS = 15000;
  const MAILTO_MAX = 1800; // keep mailto: links under the ~2,000 characters many mail apps accept

  /** Fields as readable "Label: value" lines (empty values skipped). */
  function toText(fields) {
    return Object.entries(fields)
      .filter(([, value]) => value !== "" && value != null)
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n");
  }

  /** A mailto: link with subject and body, the body shortened if the link would be too long. */
  function mailto({ subject, body }) {
    const head = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=`;
    let text = body;
    while (text.length && (head + encodeURIComponent(text)).length > MAILTO_MAX) {
      text = text.slice(0, Math.floor(text.length * 0.9));
    }
    if (text.length < body.length) text += "\n…(shortened, please add any missing details)";
    return head + encodeURIComponent(text);
  }

  /**
   * send({ mode, subject, fields, extra, honey })
   *   fields: { "Label": "value", … } — what the team reads (FormSubmit renders it as a table)
   *   extra:  { key: value }          — extra machine-readable fields (e.g. config_json)
   *   honey:  value of the spam-trap input (people leave it empty)
   */
  async function send({ mode = "preview", subject, fields, extra = {}, honey = "" }) {
    const payload = { _subject: subject, _template: "table", _captcha: "false", _honey: honey, ...fields, ...extra };

    if (mode !== "live") return { status: "preview", payload };

    const controller = "AbortController" in window ? new AbortController() : null;
    const timer = controller && setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || String(result.success) !== "true") {
        return { status: "failed", payload, error: result.message || `HTTP ${response.status}` };
      }
      return { status: "sent", payload };
    } catch (error) {
      return { status: "failed", payload, error: error.name === "AbortError" ? "The request timed out." : error.message };
    } finally {
      clearTimeout(timer);
    }
  }

  window.FormSend = { EMAIL, send, toText, mailto };
})();
