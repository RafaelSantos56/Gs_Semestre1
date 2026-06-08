const cenarios = [
  {
    titulo:  'ENCHENTE SEVERA — SAO PAULO, SP',
    desc:    'Satelite CBERS-4A detectou elevacao critica do Rio Tiete. Precipitacao de 180mm nas ultimas 6 horas.',
    dados:   { pop: '42.000', tempo: '6h', chuva: '180mm' },
    labels:  ['PESSOAS EM RISCO', 'ATE O IMPACTO', 'CHUVA/6H'],
    cores:   ['var(--color-red)', 'var(--color-orange)', 'var(--color-cyan)'],
    pergunta:'O que voce decide fazer?',
    opcoes: [
      { txt: 'Emitir alerta imediato e evacuar as 3 zonas de risco identificadas pelo satelite', certa: true  },
      { txt: 'Aguardar mais 2 horas por dados adicionais do satelite antes de agir',             certa: false },
      { txt: 'Acionar Defesa Civil apenas para as areas de risco mais elevado',                  certa: false },
    ],
    feedback: {
      certo:  { titulo: 'DECISAO EXCELENTE!',  vidas: '37.800 vidas salvas', msg: 'Evacuacao imediata com base nos dados do CBERS-4A foi determinante. Resposta rapida salva vidas.' },
      errado: ['DECISAO ARRISCADA — A espera de 2 horas custou tempo critico. 12.400 vidas em risco adicional.',
               'RESPOSTA PARCIAL — Acao incompleta. 28.600 salvas, mas zonas 2 e 3 ficaram desprotegidas.'],
    },
  },
  {
    titulo:  'QUEIMADA CRITICA — MATO GROSSO',
    desc:    'AQUA/MODIS detectou 847 focos ativos. Vento de 60km/h favorece propagacao em direcao a comunidades.',
    dados:   { pop: '12.000', tempo: '3h', vento: '60km/h' },
    labels:  ['PESSOAS EM RISCO', 'PROPAGACAO', 'VENTO'],
    cores:   ['var(--color-red)', 'var(--color-orange)', 'var(--color-yellow)'],
    pergunta:'Como voce responde?',
    opcoes: [
      { txt: 'Coordenar aeronaves de combate ao fogo e evacuar comunidades no vetor do vento',  certa: true  },
      { txt: 'Apenas monitorar e aguardar equipes terrestres no dia seguinte',                  certa: false },
      { txt: 'Enviar apenas equipes terrestres sem evacuacao preventiva',                       certa: false },
    ],
    feedback: {
      certo:  { titulo: 'RESPOSTA PERFEITA!',  vidas: '11.600 vidas salvas', msg: 'Combinacao de combate aereo e evacuacao preventiva e a resposta correta para queimadas com vento forte.' },
      errado: ['CRITICO — Aguardar ate o dia seguinte com vento a 60km/h e catastrofico.',
               'INSUFICIENTE — Equipes terrestres sozinhas nao sao suficientes para queimada com vento forte.'],
    },
  },
  {
    titulo:  'DESLIZAMENTO — PETROPOLIS, RJ',
    desc:    'GOES-16 detectou saturacao critica do solo apos 220mm de chuva. Risco em 4 encostas.',
    dados:   { pop: '8.500', tempo: '1h', chuva: '220mm' },
    labels:  ['PESSOAS EM RISCO', 'MARGEM DE ACAO', 'CHUVA ACUMULADA'],
    cores:   ['var(--color-red)', 'var(--color-red)', 'var(--color-orange)'],
    pergunta:'O que voce prioriza?',
    opcoes: [
      { txt: 'Evacuacao imediata das 4 encostas e bloqueio de acessos com Defesa Civil',  certa: true  },
      { txt: 'Monitorar mais 30 minutos para confirmar o risco antes de agir',            certa: false },
      { txt: 'Evacuar apenas a encosta com maior risco indicado pelo satelite',           certa: false },
    ],
    feedback: {
      certo:  { titulo: 'ACAO EXEMPLAR!',    vidas: '8.200 vidas salvas', msg: 'Com 1 hora de margem e saturacao critica, evacuar todas as encostas e a unica acao segura.' },
      errado: ['FATAL — 30 minutos de espera com solo saturado pode ser a diferenca entre vida e morte.',
               'PARCIAL — As 3 outras encostas tambem estavam em risco critico.'],
    },
  },
];

let cenarioAtual = 0, timerInterval = null, timerSeg = 25;

function carregarCenario(idx) {
  const c = cenarios[idx];
  if (!c) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('sim-titulo',   c.titulo);
  set('sim-desc',     c.desc);
  set('sim-pergunta', c.pergunta);

  const vals = Object.values(c.dados);
  for (let i = 0; i < 3; i++) {
    set(`sim-stat-num-${i}`,   vals[i]);
    set(`sim-stat-label-${i}`, c.labels[i]);
const el = document.getElementById(`sim-stat-num-${i}`);

if (el) {
  el.classList.remove(
    'stat-red',
    'stat-orange',
    'stat-cyan',
    'stat-yellow'
  );

  const mapaCores = {
    'var(--color-red)': 'stat-red',
    'var(--color-orange)': 'stat-orange',
    'var(--color-cyan)': 'stat-cyan',
    'var(--color-yellow)': 'stat-yellow'
  };

  el.classList.add(mapaCores[c.cores[i]]);
}
  }

  const elOps = document.getElementById('sim-opcoes');
  if (elOps) {
    elOps.innerHTML = '';

    // 1. Criamos um novo array mapeando o objeto original E guardando seu índice real
    const opcoesEmbaralhadas = c.opcoes.map((op, i) => ({ ...op, indiceOriginal: i }));

    // 2. Algoritmo Fisher-Yates para embaralhar as opções de forma aleatória
    for (let i = opcoesEmbaralhadas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opcoesEmbaralhadas[i], opcoesEmbaralhadas[j]] = [opcoesEmbaralhadas[j], opcoesEmbaralhadas[i]];
    }

    // 3. Renderizamos as opções embaralhadas na tela
    opcoesEmbaralhadas.forEach((op, i) => {
      const btn = document.createElement('button');
      btn.className = 'sim-option';
      
      // Mantém a letra correta (A, B, C) baseada na posição visual atual
      btn.innerHTML = `<span class="sim-option__letra">${String.fromCharCode(65 + i)}</span>${op.txt}`;
      
      // Passamos o 'indiceOriginal' para a função escolherOpcao saber o feedback correto
      btn.addEventListener('click', () => escolherOpcao(op.indiceOriginal, btn));
      
      elOps.appendChild(btn);
    });
  }

  const elRes  = document.getElementById('sim-resultado');
  const elJogo = document.getElementById('sim-jogo');
  if (elRes)  elRes.classList.add('hidden');
if (elJogo) elJogo.classList.remove('hidden');
  iniciarTimer();
}

function iniciarTimer() {
  timerSeg = 25;
  clearInterval(timerInterval);
  atualizarTimer();
  timerInterval = setInterval(() => {
    timerSeg--;
    atualizarTimer();
    if (timerSeg <= 0) { clearInterval(timerInterval); escolherOpcao(-1); }
  }, 1000);
}

function atualizarTimer() {
  const fill = document.getElementById('sim-timer-fill');
  const val  = document.getElementById('sim-timer-val');
  if (fill) {
  fill.style.setProperty(
    '--timer-width',
    (timerSeg / 25 * 100) + '%'
  );
}
  if (val)  val.textContent  = timerSeg + 's';
}

function escolherOpcao(idx, botaoClicado = null) {
  clearInterval(timerInterval);
  const c    = cenarios[cenarioAtual];
  const opts = document.querySelectorAll('.sim-option');

  // Desabilita todos os botões após a escolha
  opts.forEach((o) => { o.disabled = true; });

  if (idx !== -1) {
    const acertouClique = c.opcoes[idx]?.certa;
    if (acertouClique && botaoClicado) {
      botaoClicado.classList.add('selected-correct');
    } else if (!acertouClique && botaoClicado) {
      botaoClicado.classList.add('selected-wrong');
      
      // Destaca a alternativa que era a correta
      opts.forEach((o) => {
        if (o.textContent.includes(c.opcoes.find(op => op.certa).txt)) {
          o.classList.add('selected-correct');
        }
      });
    }
  }

  const acertou = idx >= 0 && c.opcoes[idx]?.certa;
  
  // --- CORREÇÃO DO ÍNDICE DO FEEDBACK DO ERRO ---
  // Como o array 'errado' tem 2 itens (índices 0 e 1), se o idx original for 2, 
  // nós pegamos o segundo feedback (índice 1) para não quebrar.
  let textoErro = '';
  if (idx !== -1 && !acertou) {
    // Se o índice original for maior que 0, tenta mapear para as opções de erro disponíveis
    const erroIdx = idx === 2 ? 1 : 0; 
    textoErro = c.feedback.errado[erroIdx] || c.feedback.errado[0];
  }

  const fb = acertou
    ? c.feedback.certo
    : { titulo: idx === -1 ? 'TEMPO ESGOTADO!' : 'DECISAO INCORRETA',
        vidas:  idx === -1 ? '0 vidas salvas'  : '—',
        msg:    idx === -1 ? 'A inacao tambem e uma decisao em situacoes reais.' : textoErro };

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('res-titulo', fb.titulo);
  set('res-vidas',  fb.vidas);
  set('res-msg',    fb.msg);

  const elTit = document.getElementById('res-titulo');
  if (elTit) {
  elTit.classList.remove(
    'resultado-certo',
    'resultado-errado'
  );

  elTit.classList.add(
    acertou
      ? 'resultado-certo'
      : 'resultado-errado'
  );
}

  // --- GARANTE O AVANÇO DO CENÁRIO ---
  const btnProx = document.getElementById('sim-btn-prox');
  if (btnProx) {
    const ultimoCenario = cenarioAtual >= cenarios.length - 1;
    
    // Força o comportamento de avançar independentemente do tipo de erro
    btnProx.textContent    = ultimoCenario ? 'REINICIAR SIMULACAO' : 'PROXIMO CENARIO →';
    btnProx.dataset.action = ultimoCenario ? 'reiniciar' : 'proximo';
  }

  const elRes  = document.getElementById('sim-resultado');
  const elJogo = document.getElementById('sim-jogo');
  if (elRes)  elRes.classList.remove('hidden');
  if (elJogo) elJogo.classList.add('hidden');
}

const btnProx = document.getElementById('sim-btn-prox');
if (btnProx) {
  btnProx.addEventListener('click', () => {
    cenarioAtual = btnProx.dataset.action === 'reiniciar' ? 0 : Math.min(cenarioAtual + 1, cenarios.length - 1);
    carregarCenario(cenarioAtual);
  });
}

document.addEventListener('DOMContentLoaded', () => carregarCenario(0));