// Disable keyboard scrolling
window.addEventListener('keydown', function(e) {
  // List of key codes that cause scrolling
  const scrollKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown', 'Home', 'End'];

  if (scrollKeys.includes(e.code) || scrollKeys.includes(e.key)) {
    e.preventDefault();
  }
}, { passive: false }); // passive must be false to allow preventDefault()
