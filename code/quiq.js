(function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  function randomClass(len) {
    let str = '';
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  }

  const kL = randomClass(24);

  const styles = `
    .${kL} {
      width: 152px !important;
      position: fixed !important;
      left: 20px !important;
      bottom: 20px !important;
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 10px !important;
      background: rgba(0, 0, 0, 0.85) !important;
      color: #fff !important;
      padding: 6px 12px !important;
      border-radius: 50px !important;
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif !important;
      font-weight: 600 !important;
      font-size: 12px !important;
      overflow: hidden !important;
      will-change: background, width !important;
      transition: 0.25s background, 0.25s width !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7) !important;
      text-decoration: none !important;
      z-index: 10000001 !important;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }
    .${kL}:hover {
      opacity: 1 !important;
      background: #555555 !important;
    }
    .${kL}:hover svg {
      transform: scale(1.1) !important;
      transition: 0.25s transform !important;
    }
    .${kL} p {
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif !important;
      font-style: normal !important;
      font-weight: 600 !important;
      font-size: 12px !important;
      line-height: 125% !important;
      margin: 0 !important;
      padding: 0 4px 0 0 !important;
      color: #fff !important;
    }
    .${kL} svg circle {
      fill: url(#bluePurpleGradient);
      transition: fill 0.25s ease;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  const link = document.createElement('a');
  const baseURL = 'https://quiq.vercel.app/';
  link.href = baseURL + '?fromquiqjs-1';
  link.classList.add(kL);
  link.target = '_blank';
  link.rel = 'nofollow';

  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, 'svg');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');
  svg.setAttribute('viewBox', '0 0 32 32');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');

  const defs = document.createElementNS(xmlns, 'defs');
  const linearGradient = document.createElementNS(xmlns, 'linearGradient');
  linearGradient.setAttribute('id', 'bluePurpleGradient');
  linearGradient.setAttribute('x1', '0');
  linearGradient.setAttribute('y1', '0');
  linearGradient.setAttribute('x2', '32');
  linearGradient.setAttribute('y2', '32');
  linearGradient.setAttribute('gradientUnits', 'userSpaceOnUse');

  const stop1 = document.createElementNS(xmlns, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#3B82F6');

  const stop2 = document.createElementNS(xmlns, 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#8B5CF6');

  linearGradient.appendChild(stop1);
  linearGradient.appendChild(stop2);
  defs.appendChild(linearGradient);
  svg.appendChild(defs);

  const circle = document.createElementNS(xmlns, 'circle');
  circle.setAttribute('cx', '16');
  circle.setAttribute('cy', '16');
  circle.setAttribute('r', '16');
  circle.setAttribute('fill', 'url(#bluePurpleGradient)');
  svg.appendChild(circle);

  const img = document.createElementNS(xmlns, 'image');
  img.setAttribute('href', 'https://quiq.vercel.app/favicon.png');
  img.setAttribute('x', '8');
  img.setAttribute('y', '8');
  img.setAttribute('width', '16');
  img.setAttribute('height', '16');
  img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.appendChild(img);

  const p = document.createElement('p');
  p.textContent = 'Quiq - Site quiq.vercel.app';

  link.appendChild(svg);
  link.appendChild(p);

  document.body.appendChild(link);
})();
