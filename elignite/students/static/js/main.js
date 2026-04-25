document.querySelectorAll('.btn').forEach((button) => {
  button.addEventListener('mouseenter', () => button.style.opacity = '0.92');
  button.addEventListener('mouseleave', () => button.style.opacity = '1');
});
