// modal.js

// ==========================================
// VARIÁVEIS GLOBAIS DE CONTROLE
// ==========================================
let linhaAlertaAtiva = null;

// ==========================================
// SISTEMA BASE DE MODAIS
// ==========================================
function abrirModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('is-open');
  document.body.classList.add('modal-open');
  
  const modal = overlay.querySelector('.modal');
  if (modal) { 
    modal.setAttribute('tabindex', '-1'); 
    modal.focus(); 
  }
}

function fecharModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('is-open');
  
  if (id === 'modal-chat') resetChat();
  
  if (!document.querySelector('.modal-overlay.is-open')) {
    document.body.classList.remove('modal-open');
  }
}

// ==========================================
// EVENT LISTENERS (GERAIS DO SISTEMA)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

  // Ligar os botões que têm a classe X automáticos (.modal__close)
  document.querySelectorAll('.modal__close').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.modal-overlay');
      if (overlay) fecharModal(overlay.id);
    });
  });

  // Configura os cliques nos avatars dos integrantes de forma limpa
  document.querySelectorAll('.team-card__avatar[data-foto]').forEach(el => {
    el.addEventListener('click', () => {
      document.getElementById('foto-img').src = el.dataset.foto;
      document.getElementById('foto-nome').textContent = el.dataset.nome;
      document.getElementById('foto-rm').textContent = el.dataset.rm;
      abrirModal('modal-foto');
    });
  });
});

// Fechar ao clicar fora do modal (no overlay de fundo)
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    fecharModal(e.target.id);
  }
});

// Fechar modais ao pressionar a tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal-overlay.is-open').forEach(o => {
    fecharModal(o.id);
  });
});

// ==========================================
// SEÇÃO INTEGRANTES
// ==========================================
function verFoto(src, nome, rm) {
  document.getElementById('foto-img').src   = src;
  document.getElementById('foto-nome').textContent = nome;
  document.getElementById('foto-rm').textContent   = rm;
  abrirModal('modal-foto');
}

// ==========================================
// TORNANDO AS FUNÇÕES VITAIS GLOBAIS
// ==========================================
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.verFoto = verFoto;