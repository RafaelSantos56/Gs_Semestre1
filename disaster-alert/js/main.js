// Carregado em TODAS as paginas

// === MENU HAMBURGUER ===
const hamburger      = document.getElementById('hamburger');
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function abrirSidebar() {
  sidebar.classList.add('open');
  hamburger.classList.add('active');
  sidebarOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function fecharSidebar() {
  sidebar.classList.remove('open');
  hamburger.classList.remove('active');
  sidebarOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    sidebar.classList.contains('open') ? fecharSidebar() : abrirSidebar();
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', fecharSidebar);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharSidebar();
});

// === ITEM ATIVO NO MENU ===
(function marcarAtivo() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.includes(page) || (page === 'index.html' && href.endsWith('index.html'))) {
      link.classList.add('active');
    }
  });
})();

// === CONTADORES ANIMADOS ===
function animateCounter(el, target, duration = 1400) {
  const startTs = performance.now();
  const suffix = el.dataset.suffix || ''; 

  function step(now) {
    const progress = Math.min((now - startTs) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    
    el.textContent = Math.floor(eased * target) + suffix; 
    
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.count);
      if (!isNaN(target)) animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// === SIRENE WEB AUDIO API ===
let sirenCtx      = null;
let sirenePlaying = false;
let sirenTimeout  = null;

let audioSirene = null;

function iniciarSirene() {
  const emPages = window.location.pathname.includes('/pages/');
  
  const caminhoAudio = `./assets/audio/audio_alert.mpeg`; 

  try {
    if (!audioSirene) {
      audioSirene = new Audio(caminhoAudio);
      audioSirene.loop = true; 
      audioSirene.volume = 1; 
    }

    audioSirene.play().catch(e => console.warn("Erro ao reproduzir áudio:", e));
  } catch (e) {
    console.warn('Erro ao inicializar o áudio da sirene:', e);
  }
}

function pararSirene() {
  if (audioSirene) {
    audioSirene.pause();      
    audioSirene.currentTime = 0; 
  }
}

function tocarCiclo() {
  if (!sirenePlaying || !sirenCtx) return;
  const osc  = sirenCtx.createOscillator();
  const gain = sirenCtx.createGain();
  osc.connect(gain);
  gain.connect(sirenCtx.destination);
  osc.type = 'sawtooth';
  gain.gain.setValueAtTime(0.22, sirenCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, sirenCtx.currentTime + 1.0);
  osc.frequency.setValueAtTime(480, sirenCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(920, sirenCtx.currentTime + 0.5);
  osc.frequency.linearRampToValueAtTime(480, sirenCtx.currentTime + 1.0);
  osc.start(sirenCtx.currentTime);
  osc.stop(sirenCtx.currentTime + 1.0);
  sirenTimeout = setTimeout(tocarCiclo, 1100);
}

function pararSirene() {
  sirenePlaying = false;
  clearTimeout(sirenTimeout);
  if (sirenCtx) { sirenCtx.close(); sirenCtx = null; }
}

window.iniciarSirene = iniciarSirene;
window.pararSirene   = pararSirene;

// === MODO CAOS ===
const btnCaos = document.getElementById('btnCaos');
const btnConfirmarCaos = document.getElementById('btn-confirmar-caos'); 
const btnCancelarCaos = document.getElementById('btn-cancelar-caos');
let caosAtivo = false;

const alertasUrgentes = [
  { tipo: 'ENCHENTE CRITICA', local: 'Sao Paulo, SP',  sev: 'critico' },
  { tipo: 'DESLIZAMENTO',     local: 'Petropolis, RJ', sev: 'critico' },
  { tipo: 'QUEIMADA SEVERA',  local: 'Mato Grosso',    sev: 'critico' },
  { tipo: 'TEMPESTADE',       local: 'Fortaleza, CE',  sev: 'critico' },
];

function ativarCaos() {
  caosAtivo = true;
  document.body.classList.add('modo-caos');
  if (btnCaos) {
    btnCaos.disabled = true;
    btnCaos.textContent = 'SISTEMA EM ALERTA...';
  }
  iniciarSirene();
  alertasUrgentes.forEach((a, i) => {
    setTimeout(() => adicionarAlertaNoFeed(a), i * 600);
  });
  const modalCaosOriginal = document.getElementById('modal-caos');
  if (modalCaosOriginal) {
    modalCaosOriginal.style.display = 'none'; 
  }
  const modalLoading = document.getElementById('modal-loading-simulacao');
  if (modalLoading) {
    modalLoading.classList.add('is-visible');
  }
  setTimeout(() => {
    pararSirene();

    const emPages = window.location.pathname.includes('/pages/');
    if (emPages) {
      window.location.href = 'simulacao.html';
    } else {
      window.location.href = 'pages/simulacao.html';
    }
  }, 8000);
}

function desativarCaos() {
  caosAtivo = false;
  document.body.classList.remove('modo-caos');
  if (btnCaos) btnCaos.textContent = 'SIMULAR DESASTRE';
  pararSirene();
}

if (btnCaos) {
  btnCaos.addEventListener('click', () => {
    if (!caosAtivo) {
      if (window.abrirModal) abrirModal('modal-caos');
      else ativarCaos();
    } else {
      desativarCaos();
    }
  });
}

if (btnConfirmarCaos) {
  btnConfirmarCaos.addEventListener('click', ativarCaos);
}

if (btnCancelarCaos) {
  btnCancelarCaos.addEventListener('click', () => {
    const modalCaosOriginal = document.getElementById('modal-caos');
    if (window.fecharModal) {
      fecharModal('modal-caos');
    } else if (modalCaosOriginal) {
      modalCaosOriginal.style.display = 'none';
    }
  });
}

const alertasPool = [
  { tipo: 'ENCHENTE',     local: 'Sao Paulo, SP',    sev: 'critico' },
  { tipo: 'QUEIMADA',     local: 'Mato Grosso',      sev: 'aviso'   },
  { tipo: 'DESLIZAMENTO', local: 'Petropolis, RJ',   sev: 'critico' },
  { tipo: 'TEMPESTADE',   local: 'Fortaleza, CE',    sev: 'aviso'   },
  { tipo: 'SECA',         local: 'Nordeste',         sev: 'aviso'   },
  { tipo: 'MONITORANDO',  local: 'Belem, PA',        sev: 'normal'  },
  { tipo: 'ENCHENTE',     local: 'Porto Alegre, RS', sev: 'critico' },
  { tipo: 'QUEIMADA',     local: 'Para',             sev: 'aviso'   },
];

function adicionarAlertaNoFeed(alerta) {
  const feed = document.getElementById('alertFeed');
  if (!feed) return;
  const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const el = document.createElement('div');
  el.className = `alert-item alert-item--${alerta.sev} fade-in`;
  el.innerHTML = `
    <span class="alert-item__tipo">${alerta.tipo}</span>
    <span class="alert-item__tempo">${hora}</span>
    <span class="alert-item__local">${alerta.local}</span>
  `;
  feed.prepend(el);
  while (feed.children.length > 8) feed.lastElementChild.remove();
}

function alertaAleatorio() {
  adicionarAlertaNoFeed(alertasPool[Math.floor(Math.random() * alertasPool.length)]);
}

window.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < 3; i++) setTimeout(alertaAleatorio, i * 300);
  setInterval(alertaAleatorio, 5000);
});


// === Introdução video ===
window.addEventListener('DOMContentLoaded', () => {
  const introOverlay = document.getElementById('intro-overlay');
  const introVideo = document.getElementById('intro-video');
  if (localStorage.getItem('introJaVista') === 'true') {
    if (introOverlay) introOverlay.remove();
    return;
  }
  if (introOverlay && introVideo) {
    introVideo.muted = true;
    introVideo.autoplay = true;
    introVideo.play().catch(e => console.log("Autoplay aguardando interação"));

    const finalizar = () => {
      localStorage.setItem('introJaVista', 'true');
      introOverlay.classList.add('fade-out');
      setTimeout(() => introOverlay.remove(), 1500);
      document.removeEventListener('keydown', finalizar);
    };

    introVideo.addEventListener('click', (e) => {
      introVideo.muted = false;
      e.stopPropagation(); 
    });

    introOverlay.addEventListener('click', (e) => {
      if (e.target === introOverlay) {
        finalizar();
      }
    });

    document.addEventListener('keydown', finalizar);
    introVideo.onended = finalizar;
  }
});
