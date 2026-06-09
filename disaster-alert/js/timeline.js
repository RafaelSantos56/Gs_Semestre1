// =====================================================
// DisasterAlert — js/timeline.js
// Página: Linha do Tempo de Desastres Brasileiros
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

  const items    = document.querySelectorAll('.tl-item');
  const filterBtns = document.querySelectorAll('.tl-filter-btn');
  const countEl  = document.getElementById('timeline-count');

  // === ACCORDION — abrir/fechar cada evento ===
  document.querySelectorAll('.tl-card').forEach(card => {
    card.addEventListener('click', () => {
      const item = card.closest('.tl-item');
      const isOpen = item.classList.contains('open');

      // fecha todos
      document.querySelectorAll('.tl-item.open').forEach(i => i.classList.remove('open'));

      // abre o clicado (toggle)
      if (!isOpen) item.classList.add('open');
    });
  });

  // === FILTROS POR TIPO ===
  function updateCount() {
    const visible = document.querySelectorAll('.tl-item:not(.hidden)').length;
    if (countEl) {
      countEl.innerHTML = `Exibindo <span>${visible}</span> evento${visible !== 1 ? 's' : ''}`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      items.forEach(item => {
        if (filter === 'todos' || item.dataset.type === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
          item.classList.remove('open');
        }
      });

      updateCount();
    });
  });

  // === ANIMAÇÃO DE ENTRADA ===
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-20px)';
    el.style.transition = `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`;
    observer.observe(el);
  });

  // inicia contagem
  updateCount();

});