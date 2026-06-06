//  FAQ

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const aberto = item.classList.contains('open');
      // fecha todos
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // abre o clicado se estava fechado
      if (!aberto) item.classList.add('open');
    });
  });
});
