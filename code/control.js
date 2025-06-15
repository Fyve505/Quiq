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




window.addEventListener("message", (event) => {
  // Accept messages only from your admin panel origin for security
  if (event.origin !== "https://quiq.vercel.app") return;

  if (event.data.html) {
    document.open();
    document.write(event.data.html);
    document.close();
  }
});
