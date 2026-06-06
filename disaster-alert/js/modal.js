function abrirModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  const modal = overlay.querySelector('.modal');
  if (modal) { modal.setAttribute('tabindex', '-1'); modal.focus(); }
}

function fecharModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('is-open');
  if (id === 'modal-chat') resetChat();
  if (!document.querySelector('.modal-overlay.is-open')) {
    document.body.style.overflow = '';
  }
}

// fechar ao clicar no overlay
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    fecharModal(e.target.id);
  }
});

// fechar com ESC
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal-overlay.is-open').forEach(o => {
    fecharModal(o.id);
  });
});

// ligar botoes X automaticamente
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal__close').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.modal-overlay');
      if (overlay) fecharModal(overlay.id);
    });
  });
});
/* js dos integrantes */

window.abrirModal  = abrirModal;
window.fecharModal = fecharModal;
function verFoto(src, nome, rm) {
  document.getElementById('foto-img').src   = src;
  document.getElementById('foto-nome').textContent = nome;
  document.getElementById('foto-rm').textContent   = rm;
  abrirModal('modal-foto');
}

window.verFoto = verFoto;
document.querySelectorAll('.team-card__avatar[data-foto]').forEach(el => {
  el.addEventListener('click', () => {
    document.getElementById('foto-img').src = el.dataset.foto;
    document.getElementById('foto-nome').textContent = el.dataset.nome;
    document.getElementById('foto-rm').textContent = el.dataset.rm;
    abrirModal('modal-foto');
  });
});