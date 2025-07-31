// ===== Animated Cookie Consent Popup =====
function showCookiePopup() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center;
        z-index: 9999; animation: fadeIn 0.3s ease;
    `;

    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white; padding: 25px 30px; max-width: 400px; text-align: center;
        border-radius: 15px; box-shadow: 0 0 30px rgba(0,0,0,0.3);
        font-family: 'Segoe UI', sans-serif; animation: fadeIn 0.3s ease;
    `;

    popup.innerHTML = `
        <h2 style="margin-top:0;color:#333;">Cookies & Privacy</h2>
        <p style="font-size:14px;color:#555;">
            This website uses cookies only to save your human score and preferences.
            This ensures your settings are remembered and improves your experience.
        </p>
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

    // Hover effect
    popup.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
    });

    // Accept
    popup.querySelector('.accept').onclick = () => {
        localStorage.setItem('cookieAcceptedDate', new Date().toDateString());
        overlay.remove();
    };

    // Deny
    popup.querySelector('.deny').onclick = () => {
        document.body.innerHTML = `
            <div style="
                display:flex;flex-direction:column;justify-content:center;align-items:center;
                height:100vh;text-align:center;font-family:'Segoe UI',sans-serif;
            ">
                <h2 style="color:red;">You denied the cookies, so you can't use the site.</h2>
                <button onclick="location.reload()" style="
                    margin-top:20px;padding:10px 20px;border:none;background:#2196f3;color:white;
                    border-radius:8px;cursor:pointer;font-size:16px;transition:0.2s;
                ">Go Back</button>
            </div>
        `;
    };
}

// Show popup once per day until accepted
const lastAccepted = localStorage.getItem('cookieAcceptedDate');
const today = new Date().toDateString();

if (lastAccepted !== today) {
    showCookiePopup();
}
