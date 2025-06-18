document.addEventListener("DOMContentLoaded", () => {
  // Create container
  const container = document.createElement("div");
  container.style = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: #1e1e1e;
    color: white;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    font-family: monospace;
  `;

  // Create textarea for HTML input
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Enter HTML here...";
  textarea.style = `
    flex: 1;
    background: #111;
    color: #0f0;
    border: none;
    padding: 10px;
    font-size: 14px;
    resize: none;
  `;

  // Create iframe for live preview
  const preview = document.createElement("iframe");
  preview.style = `
    flex: 1;
    border: none;
    background: white;
  `;

  // Handle live update
  textarea.addEventListener("input", () => {
    preview.srcdoc = textarea.value;
  });

  // Assemble editor
  container.appendChild(textarea);
  container.appendChild(preview);
  document.body.appendChild(container);
});
