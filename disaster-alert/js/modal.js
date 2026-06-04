// DisasterAlert — js/modal.js
// Carregar ANTES de todos os outros scripts

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

window.abrirModal  = abrirModal;
window.fecharModal = fecharModal;

document.addEventListener("DOMContentLoaded", () => {
  
  const btnFecharAlerta = document.getElementById("btn-fechar-alerta");
  const btnCancelarCaos = document.getElementById("btn-cancelar-caos");
  const btnConfirmarCaos = document.getElementById("btn-confirmar-caos");

  // Evento para fechar o Modal de Alerta
  if (btnFecharAlerta) {
    btnFecharAlerta.addEventListener("click", () => {
      fecharModal("modal-alerta");
    });
  }

  // Evento para cancelar o Modo Caos
  if (btnCancelarCaos) {
    btnCancelarCaos.addEventListener("click", () => {
      fecharModal("modal-caos");
    });
  }

  // Evento para confirmar e ativar o Modo Caos
  if (btnConfirmarCaos) {
    btnConfirmarCaos.addEventListener("click", () => {
      fecharModal("modal-caos");
      
      // Verifica se a função ativarCaos existe globalmente no sistema antes de chamar
      if (window.ativarCaos) {
        window.ativarCaos();
      }
    });
  }
});