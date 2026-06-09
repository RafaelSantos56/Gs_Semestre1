// Chatbot DisasterAlert
(function () {

  const RESPOSTAS = [
    {
      keys: ['enchente', 'inundacao', 'inundação', 'rio', 'alagamento'],
      resp: 'Sensores SAR detectam variação do nível dos rios com precisão de metros, mesmo através de nuvens e à noite. O alerta é emitido com até 6h de antecedência.'
    },
    {
      keys: ['queimada', 'fogo', 'incendio', 'incêndio', 'foco'],
      resp: 'Análise espectral infravermelho identifica focos ativos e calcula a direção de propagação em tempo real. Dados são atualizados a cada passagem do satélite.'
    },
    {
      keys: ['deslizamento', 'encosta', 'morro', 'erosao', 'erosão'],
      resp: 'Modelos digitais de elevação combinados com dados de chuva calculam o risco geológico por encosta. Áreas com declividade crítica são monitoradas continuamente.'
    },
    {
      keys: ['tempestade', 'chuva', 'vento', 'clima', 'meteorolog'],
      resp: 'Dados meteorológicos orbitais fornecem previsão de até 6 horas de antecedência, permitindo evacuação preventiva antes da chegada da tempestade.'
    },
    {
      keys: ['satelite', 'satélite', 'espaco', 'espaço', 'orbital', 'sar'],
      resp: 'Usamos imagens de satélites SAR e ópticos para monitorar o território brasileiro 24/7, independentemente de cobertura de nuvens ou horário.'
    },
    {
      keys: ['ods', 'onu', 'sustentavel', 'sustentável', 'objetivo'],
      resp: 'O DisasterAlert contribui para os ODS 9 (Inovação), ODS 11 (Cidades Sustentáveis) e ODS 13 (Ação Climática) da ONU.'
    },
    {
      keys: ['funciona', 'como', 'sistema', 'pipeline', 'processo'],
      resp: 'O fluxo é: Satélite → Análise IA → Alerta → Defesa Civil → Evacuação. Desde a captura da imagem até a notificação levamos menos de 10 minutos.'
    },
    {
      keys: ['equipe', 'time', 'quem', 'integrante', 'igor', 'diego', 'miguel', 'rafael', 'fiap'],
      resp: 'O projeto foi desenvolvido por Igor, Diego, Miguel e Rafael — estudantes da turma 1TDSPG da FIAP, Global Solution 2026.'
    },
    {
      keys: ['alerta', 'notificacao', 'notificação', 'aviso'],
      resp: 'Os alertas são classificados em três níveis: Atenção (amarelo), Alerta (laranja) e Emergência (vermelho). Cada nível aciona protocolos diferentes na Defesa Civil.'
    },
    {
      keys: ['emergencia', 'emergência', 'socorro', 'ajuda', 'perigo'],
      resp: 'Em caso de emergência: acesse o painel de Alertas, siga as instruções da Defesa Civil e ligue 199 (Defesa Civil) ou 193 (Bombeiros).'
    },
    {
      keys: ['tchau', 'adeus', 'ate logo', 'até logo', 'obrigado', 'obrigada', 'valeu', 'falou', 'flw'],
      resp: 'Até logo! Se precisar de mais informações sobre o DisasterAlert, estarei aqui. Fique seguro! 🛰️'
    },
  ];

  const FALLBACK = [
    'Posso te ajudar com informações sobre enchentes, queimadas, deslizamentos, tempestades, satélites, ODS e a equipe do projeto.',
    'Tente perguntar sobre como o sistema funciona, os tipos de desastre monitorados ou os objetivos do projeto.',
    'Não entendi muito bem. Você pode reformular? Falo sobre desastres naturais, tecnologia espacial e o DisasterAlert.',
  ];
  let fallbackIdx = 0;

  function getReply(text) {
    const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const item of RESPOSTAS) {
      if (item.keys.some(k => lower.includes(k))) return item.resp;
    }
    return FALLBACK[fallbackIdx++ % FALLBACK.length];
  }

  let messagesEl, suggestionsEl, inputEl, sendBtn, typingEl;

  function init() {
    messagesEl    = document.getElementById('chat-messages');
    suggestionsEl = document.getElementById('chat-suggestions');
    inputEl       = document.getElementById('chat-input');
    sendBtn       = document.getElementById('chat-send');

    if (!messagesEl) return;

    typingEl = buildTypingEl();

    sendBtn.addEventListener('click', handleSend);
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });

    document.querySelectorAll('.chat-suggestion').forEach((btn) => {
      btn.addEventListener('click', () => {
        inputEl.value = btn.textContent.trim();
        handleSend();
      });
    });

    const avatar = document.querySelector('.floating-avatar');
    if (avatar) {
      avatar.addEventListener('click', () => {
        avatar.classList.add('decolando');
        setTimeout(() => {
          window.abrirModal('modal-chat');
          avatar.classList.remove('decolando');
          setTimeout(() => inputEl.focus(), 350);
        }, 1200);
      });
      avatar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); avatar.click(); }
      });
    }
  }

  function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    hideSuggestions();
    appendMessage('user', text);
    showTyping();
    setTimeout(() => {
      hideTyping();
      appendMessage('bot', getReply(text));
    }, 600 + Math.random() * 400);
  }

  function appendMessage(role, text) {
    const isBot = role === 'bot';
    const wrap  = document.createElement('div');
    wrap.className = 'chat-msg chat-msg--' + (isBot ? 'bot' : 'user');
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (isBot) {
      wrap.innerHTML =
        '<div class="chat-msg__avatar"><img src="../assets/img/avatar_fundo.png" alt="Bot"></div>' +
        '<div><div class="chat-msg__bubble">' + escapeHtml(text) + '</div>' +
        '<div class="chat-msg__time">' + hora + '</div></div>';
    } else {
      wrap.innerHTML =
        '<div><div class="chat-msg__bubble">' + escapeHtml(text) + '</div>' +
        '<div class="chat-msg__time chat-msg__time--user">' + hora + '</div></div>';
    }
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function buildTypingEl() {
    const el = document.createElement('div');
    el.className = 'chat-typing';
    el.innerHTML =
      '<div class="chat-msg__avatar"><img src="../assets/img/avatar_fundo.png" alt="Bot"></div>' +
      '<div class="chat-typing__bubble">' +
      '<span class="chat-typing__dot"></span>' +
      '<span class="chat-typing__dot"></span>' +
      '<span class="chat-typing__dot"></span>' +
      '</div>';
    return el;
  }

  function showTyping()      { messagesEl.appendChild(typingEl); messagesEl.scrollTop = messagesEl.scrollHeight; }
  function hideTyping()      { if (typingEl.parentNode) typingEl.parentNode.removeChild(typingEl); }
  function hideSuggestions() { if (suggestionsEl) suggestionsEl.classList.add('hidden'); }

  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/\n/g,'<br>');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  function resetChat() {
    if (!messagesEl) return;
    messagesEl.innerHTML = '';
    fallbackIdx = 0;
    if (suggestionsEl) suggestionsEl.classList.remove('hidden');
    appendMessage('bot', 'Olá! Sou o assistente do DisasterAlert 🛰️\nComo posso te ajudar hoje?');
  }

  window.resetChat = resetChat;

})();