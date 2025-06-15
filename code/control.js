// controlled.js - Origin check skipped (unsafe, for testing only)
(function () {
  console.log("[ControlledJS] Ready to receive full HTML.");

  window.addEventListener("message", (event) => {
    // WARNING: skipping origin check — only for testing!
    // Remove this check in production for security.

    const { html } = event.data;
    if (html) {
      document.open();
      document.write(html);
      document.close();
    }
  });
})();
