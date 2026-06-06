const perguntas = [
  {
    p: 'Qual satelite brasileiro e amplamente usado para monitoramento ambiental e deteccao de desastres?',
    ops: ['Hubble Space Telescope', 'CBERS-4A', 'GPS-III', 'Starlink'],
    certo: 1,
    fb: 'CORRETO! O CBERS-4A é fruto da parceria Brasil-China e possui sensores que detectam variações no solo, água e vegetacao em tempo real.'
  },
  {
    p: 'Qual o primeiro passo correto ao receber um alerta critico de enchente pelo DisasterAlert?',
    ops: ['Confirmar o alerta e acionar a Defesa Civil', 'Ignorar e aguardar confirmacao por TV', 'Postar nas redes sociais', 'Desligar o sistema'],
    certo: 0,
    fb: 'CORRETO! Confirmar rapidamente e acionar a Defesa Civil é essencial — cada minuto conta numa enchente severa.'
  },
  {
    p: 'Qual tecnologia de satelite consegue enxergar atraves de nuvens densas e funcionar 24h por dia?',
    ops: ['Camera RGB comum', 'Sistema GPS convencional', 'Camera infravermelho simples', 'Radar SAR (Synthetic Aperture Radar)'],
    certo: 3, 
    fb: 'CORRETO! O Radar SAR usa micro-ondas que atravessam nuvens e funcionam dia e noite — perfeito para enchentes em dias nublados.'
  },
  {
    p: 'O que significa o ODS 13, vinculado ao projeto DisasterAlert?',
    ops: ['Vida na agua', 'Saude e bem-estar', 'Acao contra a mudanca global do clima', 'Energia limpa e acessivel'],
    certo: 2, 
    fb: 'CORRETO! O ODS 13 trata de uma ação climática urgente. O DisasterAlert usa tecnologia espacial para mitigar impactos de desastres climáticos.'
  },
  {
    p: 'Em quanto tempo satelites modernos detectam e transmitem dados de um foco de queimada?',
    ops: ['72 horas apos o inicio', 'Apenas 1 atualizacao por dia', 'Menos de 15 minutos', 'Somente durante o dia, a cada 8 horas'],
    certo: 2,
    fb: 'CORRETO! Satélites como o GOES-16 atualizam imagens a cada 10-15 minutos, permitindo resposta quase em tempo real.'
  },
];

let atual = 0, certas = 0, erradas = 0;

function atualizarPlacar() {
  const pc = document.getElementById('quiz-certas');
  const pe = document.getElementById('quiz-erradas');
  const pq = document.getElementById('quiz-questao');
  if (pc) pc.textContent = certas;
  if (pe) pe.textContent = erradas;
  if (pq) pq.textContent = `${atual + 1}/${perguntas.length}`;
}

function atualizarProgress() {
  const fill = document.getElementById('quiz-progress-fill');
  if (fill) fill.style.width = ((atual + 1) / perguntas.length * 100) + '%';
}

function carregarQuestao() {
  const q = perguntas[atual];
  if (!q) return;

  const elNum = document.getElementById('quiz-qnum');
  const elP   = document.getElementById('quiz-pergunta');
  const elOps = document.getElementById('quiz-opcoes');
  const elFb  = document.getElementById('quiz-feedback');
  const elBtn = document.getElementById('quiz-btn-prox');

  if (elNum) elNum.textContent = `QUESTAO ${atual + 1} DE ${perguntas.length}`;
  if (elP)   elP.textContent   = q.p;
  if (elFb)  { elFb.className = 'quiz-feedback'; elFb.textContent = ''; }
  if (elBtn) elBtn.style.display = 'none';

  atualizarPlacar();
  atualizarProgress();

  if (!elOps) return;
  elOps.innerHTML = '';
  q.ops.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerHTML = `<span class="quiz-option__letra">${String.fromCharCode(65 + i)}</span>${op}`;
    btn.addEventListener('click', () => responder(i));
    elOps.appendChild(btn);
  });
}

function responder(escolha) {
  const q    = perguntas[atual];
  const opts = document.querySelectorAll('.quiz-option');
  const fb   = document.getElementById('quiz-feedback');
  const btn  = document.getElementById('quiz-btn-prox');

  opts.forEach((o, i) => {
    o.disabled = true;
    if (i === q.certo) o.classList.add('correto');
    else if (i === escolha && escolha !== q.certo) o.classList.add('errado');
  });

  const acertou = escolha === q.certo;
  if (acertou) certas++; else erradas++;
  atualizarPlacar();

  if (fb) {
    // Se o usuário errar, trocamos a palavra "CORRETO!" por "INCORRETO!" no início da frase
    let textoFeedback = q.fb;
    if (!acertou) {
      textoFeedback = textoFeedback.replace('CORRETO!', 'INCORRETO!');
    }
    
    fb.textContent = textoFeedback; 
    fb.className = `quiz-feedback show ${acertou ? 'correto' : 'errado'}`; 
  }
  
  if (btn) { 
    btn.style.display = 'block'; 
    btn.textContent = atual < perguntas.length - 1 ? 'PROXIMA QUESTAO →' : 'VER RESULTADO'; 
  }
}
function proxima() {
  atual++;
  if (atual >= perguntas.length) mostrarResultado();
  else carregarQuestao();
}

function mostrarResultado() {
  const pct  = Math.round(certas / perguntas.length * 100);
  const msgs = [
    [0,   '😟', 'Continue estudando sobre tecnologia espacial e gestao de desastres!'],
    [40,  '🙂', 'Bom inicio! Explore mais sobre satelites e resposta a desastres.'],
    [60,  '👍', 'Bom desempenho! Voce entende os fundamentos do monitoramento satelital.'],
    [80,  '🏆', 'Excelente! Voce tem solido conhecimento sobre tecnologia espacial.'],
    [100, '🚀', 'Perfeito! Voce domina completamente a tecnologia espacial aplicada a desastres!'],
  ];
  let m = msgs[0];
  msgs.forEach(x => { if (pct >= x[0]) m = x; });

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('res-emoji',  m[1]);
  set('res-pontos', `${certas} / ${perguntas.length}`);
  set('res-msg',    m[2]);
  set('res-tempo',  `${Math.round(performance.now() / 1000)}s`);

  if (window.abrirModal) abrirModal('modal-resultado');
}

function reiniciarQuiz() {
  atual = certas = erradas = 0;
  atualizarPlacar();
  atualizarProgress();
  carregarQuestao();
}

window.reiniciarQuiz = reiniciarQuiz;

// SIRENE
const btnSirene = document.getElementById('btnSirene');
let sireneAtiva = false;

if (btnSirene) {
  btnSirene.addEventListener('click', () => {
    sireneAtiva = !sireneAtiva;
    if (sireneAtiva) {
      window.iniciarSirene && window.iniciarSirene();
      btnSirene.classList.add('ativa');
      btnSirene.innerHTML = '🔇 DESATIVAR SIRENE DE ALERTA';
    } else {
      window.pararSirene && window.pararSirene();
      btnSirene.classList.remove('ativa');
      btnSirene.innerHTML = '🚨 ATIVAR SIRENE DE ALERTA';
    }
  });
}

const btnProx = document.getElementById('quiz-btn-prox');
if (btnProx) btnProx.addEventListener('click', proxima);

const btnNovamente = document.getElementById('btnJogarNovamente');
if (btnNovamente) {
  btnNovamente.addEventListener('click', () => {
    if (window.fecharModal) fecharModal('modal-resultado');
    if (sireneAtiva) {
      window.pararSirene && window.pararSirene();
      sireneAtiva = false;
      if (btnSirene) { btnSirene.classList.remove('ativa'); btnSirene.innerHTML = '🚨 ATIVAR SIRENE DE ALERTA'; }
    }
    reiniciarQuiz();
  });
}

document.addEventListener('DOMContentLoaded', carregarQuestao);