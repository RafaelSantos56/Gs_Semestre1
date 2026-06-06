// dashboard

const alertasData = [
  { id:1,  tipo:'ENCHENTE',     local:'Sao Paulo, SP',    sev:'critico', sat:'CBERS-4A',   hora:'14:32', pop:'42.000',  risco:88, status:'ATIVO'     },
  { id:2,  tipo:'DESLIZAMENTO', local:'Petropolis, RJ',   sev:'critico', sat:'GOES-16',    hora:'14:27', pop:'8.500',   risco:91, status:'ATIVO'     },
  { id:3,  tipo:'QUEIMADA',     local:'Mato Grosso',      sev:'aviso',   sat:'AQUA/MODIS', hora:'14:15', pop:'—',       risco:65, status:'MONIT.'    },
  { id:4,  tipo:'TEMPESTADE',   local:'Fortaleza, CE',    sev:'aviso',   sat:'GOES-16',    hora:'13:57', pop:'120.000', risco:54, status:'MONIT.'    },
  { id:5,  tipo:'SECA',         local:'Nordeste',         sev:'aviso',   sat:'CBERS-4A',   hora:'13:40', pop:'—',       risco:48, status:'MONIT.'    },
  { id:6,  tipo:'QUEIMADA',     local:'Para',             sev:'normal',  sat:'AQUA/MODIS', hora:'13:10', pop:'—',       risco:30, status:'MONIT.'    },
  { id:7,  tipo:'ENCHENTE',     local:'Porto Alegre, RS', sev:'critico', sat:'GOES-16',    hora:'12:55', pop:'15.000',  risco:79, status:'ATIVO'     },
  { id:8,  tipo:'DESLIZAMENTO', local:'Blumenau, SC',     sev:'aviso',   sat:'CBERS-4A',   hora:'12:30', pop:'3.200',   risco:60, status:'MONIT.'    },
  { id:9,  tipo:'TEMPESTADE',   local:'Belem, PA',        sev:'normal',  sat:'GOES-16',    hora:'11:45', pop:'—',       risco:22, status:'RESOLVIDO' },
  { id:10, tipo:'QUEIMADA',     local:'Minas Gerais',     sev:'normal',  sat:'AQUA/MODIS', hora:'11:20', pop:'—',       risco:18, status:'RESOLVIDO' },
];

function renderTabela(filtro = 'todos') {
  const tbody = document.getElementById('alertsTableBody');
  if (!tbody) return;

  const lista = filtro === 'todos'
    ? alertasData
    : alertasData.filter(a => a.sev === filtro || a.status.toLowerCase() === filtro);

  tbody.innerHTML = lista.map(a => `
    <tr class="alert-row" data-id="${a.id}" title="Clique para ver detalhes">
      <td style="color:var(--text-muted);font-family:var(--font-mono);font-size:12px">#${String(a.id).padStart(3,'0')}</td>
      <td style="font-weight:600">${a.tipo}</td>
      <td>${a.local}</td>
      <td><span class="badge badge--${a.sev}">${a.sev.toUpperCase()}</span></td>
      <td style="color:var(--text-secondary)">${a.sat}</td>
      <td style="color:var(--text-secondary)">${a.hora}</td>
      <td style="color:${a.status==='ATIVO'?'var(--color-red)':a.status==='RESOLVIDO'?'var(--color-green)':'var(--color-orange)'}">${a.status}</td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.alert-row').forEach(row => {
    row.addEventListener('click', () => verAlerta(parseInt(row.dataset.id)));
  });
}

function verAlerta(id) {
  const a = alertasData.find(x => x.id === id);
  if (!a) return;

  const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.textContent = val; };
  set('modal-alerta-titulo', `${a.tipo} — ${a.local}`);
  set('modal-alerta-sat',    a.sat);
  set('modal-alerta-hora',   a.hora);
  set('modal-alerta-pop',    a.pop === '—' ? 'Nao habitado' : a.pop + ' pessoas em risco');
  set('modal-alerta-status', a.status);

  const barra = document.getElementById('modal-alerta-risco');
  if (barra) {
    barra.style.width = '0%';
    setTimeout(() => { barra.style.width = a.risco + '%'; }, 100);
    barra.style.background = a.risco >= 75 ? 'var(--color-red)' : a.risco >= 50 ? 'var(--color-orange)' : 'var(--color-green)';
  }

  const badge = document.getElementById('modal-alerta-badge');
  if (badge) { badge.textContent = a.sev.toUpperCase(); badge.className = `badge badge--${a.sev}`; }

  const modal = document.querySelector('#modal-alerta .modal');
  if (modal) modal.className = `modal modal--${a.sev}`;

  abrirModal('modal-alerta');
}

window.verAlerta = verAlerta;

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTabela(btn.dataset.filter);
  });
});

const mapaPontos = [
  { top:'69%', left:'58%', sev:'critico', label:'Sao Paulo'    },
  { top:'67%', left:'64%', sev:'critico', label:'Petropolis'   },
  { top:'52%', left:'41%', sev:'aviso',   label:'Mato Grosso'  },
  { top:'24%', left:'69%', sev:'aviso',   label:'Fortaleza'    },
  { top:'34%', left:'65%', sev:'aviso',   label:'Nordeste'     },
  { top:'22%', left:'50%', sev:'normal',  label:'Para'         },
  { top:'85%', left:'56%', sev:'critico', label:'Porto Alegre' },
  { top:'77%', left:'59%', sev:'aviso',   label:'Blumenau'     },
];

function renderMapa() {
  const mapa = document.getElementById('mapContainer');
  if (!mapa) return;
  mapaPontos.forEach((p, i) => {
    const dot = document.createElement('div');
    dot.className = `map-dot map-dot--${p.sev}`;
    dot.style.top  = p.top;
    dot.style.left = p.left;
    dot.title = p.label;
    dot.style.animationDelay = (i * 0.3) + 's';
    dot.addEventListener('click', () => {
      const a = alertasData.find(x => x.local.startsWith(p.label.split(' ')[0]));
      if (a) verAlerta(a.id);
    });
    mapa.appendChild(dot);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTabela();
  renderMapa();

  document.getElementById('btnCaos')?.addEventListener('click', () => abrirModal('modal-caos'));
  document.getElementById('btn-cancelar-caos')?.addEventListener('click', () => fecharModal('modal-caos'));
  document.getElementById('btn-confirmar-caos')?.addEventListener('click', () => {
    fecharModal('modal-caos');
    if (typeof ativarCaos === 'function') ativarCaos();
  });
});