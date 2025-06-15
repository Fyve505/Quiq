// controlled.js

(function () {
  const allowedOrigin = "https://quiq.vercel.app/code/control"; // Change this to your actual admin page origin

  console.log("[ControlledJS] Ready to receive full HTML.");

  window.addEventListener("message", (event) => {
    if (event.origin !== allowedOrigin) {
      console.warn("[ControlledJS] Blocked message from", event.origin);
      return;
    }

    const { html } = event.data;

    if (html) {
      document.open();
      document.write(html);
      document.close();
    }
  });
})();
