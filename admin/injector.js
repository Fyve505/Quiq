window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "UPDATE_HTML") {
    document.body.innerHTML = event.data.html;
  }
});
