document.addEventListener('DOMContentLoaded', () => {
  const link = document.querySelector('a');

  if (link) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'index.html';
    });
  }
});
