// CONFIG
const COOKIE_PASSWORD_HASH = "f28704a52edcb96c768940a21093f2dd511c50b9a268580ae37a174b95f529b0";
const HCAPTCHA_SITE_KEY = "b194b53a-fba0-4868-ba9a-e8ce33b4deaa"; // Replace

// Secret command function
window.Cookie = function(pass) {
  if (typeof pass !== "string") return;
  crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass.trim()))
    .then(hashBuffer => {
      const hash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
      if (hash === COOKIE_PASSWORD_HASH) {
        localStorage.removeItem("cookieAcceptedDate");
        location.reload();
      }
    });
};

// Stealth console logs
(function(){
  const noop = () => {};
  console.log = noop;
  console.warn = noop;
  console.info = noop;
  console.debug = noop;
})();

// Show popup function
function showCookiePopup() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn { from {opacity:0; transform:scale(0.8);} to {opacity:1; transform:scale(1);} }
    @keyframes spin { 0% {transform:rotate(0deg);} 100% {transform:rotate(360deg);} }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.6);display:flex;justify-content:center;align-items:center;
    z-index:9999;animation:fadeIn 0.3s ease;
  `;

  const popup = document.createElement('div');
  popup.style.cssText = `
    background:white;padding:25px 30px;max-width:400px;text-align:center;
    border-radius:15px;box-shadow:0 0 30px rgba(0,0,0,0.3);
    font-family:'Segoe UI',sans-serif;animation:fadeIn 0.3s ease;
  `;

  popup.innerHTML = `
    <h2 style="margin-top:0;color:#333;">Cookies & Privacy</h2>
    <p style="font-size:14px;color:#555;">
      This website uses cookies only to save your human score and preferences.
    </p>
    <div id="hcaptcha-container" style="margin:10px 0;min-height:80px;display:flex;justify-content:center;align-items:center;">
      <div id="spinner" style="
        width:30px;height:30px;border:4px solid #ccc;border-top:4px solid #4CAF50;
        border-radius:50%;animation:spin 1s linear infinite;
      "></div>
    </div>
    <button class="accept" style="
      background:#4CAF50;color:white;padding:10px 18px;border:none;border-radius:8px;
      cursor:pointer;margin:5px;transition:0.2s;
    ">Accept</button>
    <button class="deny" style="
      background:#e53935;color:white;padding:10px 18px;border:none;border-radius:8px;
      cursor:pointer;margin:5px;transition:0.2s;
    ">Deny</button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  popup.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
    btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
  });

  let captchaSolved = false;

  function renderCaptchaWhenReady() {
    if (window.hcaptcha && document.getElementById("hcaptcha-container")) {
      const spinner = document.getElementById("spinner");
      if (spinner) spinner.remove();
      window.hcaptcha.render('hcaptcha-container', {
        sitekey: HCAPTCHA_SITE_KEY,
        callback: () => { captchaSolved = true; }
      });
    } else {
      setTimeout(renderCaptchaWhenReady, 200);
    }
  }
  renderCaptchaWhenReady();

  popup.querySelector('.accept').onclick = () => {
    if (!captchaSolved) {
      alert("Please complete the hCaptcha first!");
      return;
    }
    localStorage.setItem('cookieAcceptedDate', new Date().toDateString());
    overlay.remove();
  };

  popup.querySelector('.deny').onclick = () => {
    if (!captchaSolved) {
      alert("Please complete the hCaptcha first!");
      return;
    }
    document.body.innerHTML = `
      <div style="
        display:flex;flex-direction:column;justify-content:center;align-items:center;
        height:100vh;text-align:center;font-family:'Segoe UI',sans-serif;
      ">
        <h2 style="color:red;">The site need cookies to run safe.</h2>
        <button onclick="location.reload()" style="
          margin-top:20px;padding:10px 20px;border:none;background:#2196f3;color:white;
          border-radius:8px;cursor:pointer;font-size:16px;transition:0.2s;
        ">Go Back</button>
      </div>
    `;
  };
}

const lastAccepted = localStorage.getItem('cookieAcceptedDate');
const today = new Date().toDateString();
if (lastAccepted !== today) {
  showCookiePopup();
}
