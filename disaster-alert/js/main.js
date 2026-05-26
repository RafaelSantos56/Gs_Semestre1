// DisasterAlert — js/main.js
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
  function step(now) {
    const progress = Math.min((now - startTs) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
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

function iniciarSirene() {
  try {
    sirenCtx      = new (window.AudioContext || window.webkitAudioContext)();
    sirenePlaying = true;
    tocarCiclo();
  } catch (e) { console.warn('Web Audio API nao suportada:', e); }
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
  if (btnCaos) btnCaos.textContent = 'DESATIVAR MODO CAOS';
  iniciarSirene();
  alertasUrgentes.forEach((a, i) => {
    setTimeout(() => adicionarAlertaNoFeed(a), i * 600);
  });
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

window.ativarCaos    = ativarCaos;
window.desativarCaos = desativarCaos;

// === FEED DE ALERTAS ===
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