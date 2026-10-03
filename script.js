document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('reset-btn');

  if (button) {
    button.addEventListener('click', () => {
      window.location.reload();
    });
  }
});
