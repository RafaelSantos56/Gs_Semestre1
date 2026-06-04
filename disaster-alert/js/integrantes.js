// DisasterAlert — js/integrantes.js
// Renderiza os cards e abre o modal de foto

const integrantes = [
  {
    nome:     'Diego Gomes Gonçalves de Lima',
    rm:       'RM: 570335 | 1TDSPG',
    iniciais: 'DG',
    foto:     '../assets/img/diego.jpg',
    github:   'https://github.com/dgxls',
    linkedin: 'https://linkedin.com/in/diego-gomes-65339b408',
  },
  {
    nome:     'Igor Rodrigues de Santana',
    rm:       'RM: 570651 | 1TDSPG',
    iniciais: 'IR',
    foto:     '../assets/img/igor.jpg',
    github:   'https://github.com/igorodriguesd',
    linkedin: 'https://linkedin.com/in/igor-rodrigues-135aa72b2'
  },
  {
    nome:     'Miguel Silva',
    rm:       'RM: 570219 | 1TDSPG',
    iniciais: 'MS',
    foto:     '../assets/img/miguel.jpg',
    github:   'https://github.com/miguelsilva71',
    linkedin: 'https://linkedin.com/in/miguel-silva-0a20073a9',
  },
  {
    nome:     'Rafael Santos Mendonça Costa',
    rm:       'RM: 572368 | 1TDSPG',
    iniciais: 'RC',
    foto:     '../assets/img/rafael.jpg',
    github:   'https://github.com/RafaelSantos56',
    linkedin: 'https://linkedin.com/in/rafael-santos-b09bba237',
  },
];

function renderEquipe() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;

  // Removido o onclick="verFoto(${i})" da string HTML abaixo
  grid.innerHTML = integrantes.map((p, i) => `
    <article class="team-card">
      <div class="team-card__avatar" data-index="${i}" title="Ver foto ampliada" style="cursor: pointer;">
        ${p.foto ? `<img src="${p.foto}" alt="${p.nome}">` : p.iniciais}
      </div>
      <h3 class="team-card__name">${p.name || p.nome}</h3>
      <p class="team-card__rm">${p.rm}</p>
      <span class="badge badge--info">TRIPULANTE</span>
      <div class="team-card__links">
        <a href="${p.github}"   target="_blank" rel="noopener" class="team-card__link">&#128279; GitHub</a>
        <a href="${p.linkedin}" target="_blank" rel="noopener" class="team-card__link team-card__link--li">in LinkedIn</a>
      </div>
    </article>
  `).join('');

  // Adiciona o ouvinte de clique isolado em cada avatar renderizado
  const avatares = grid.querySelectorAll('.team-card__avatar');
  avatares.forEach(avatar => {
    avatar.addEventListener('click', () => {
      const idx = avatar.getAttribute('data-index');
      verFoto(idx);
    });
  });
}

function verFoto(idx) {
  const p       = integrantes[idx];
  const avatar  = document.getElementById('foto-avatar');
  const nome    = document.getElementById('foto-nome');
  const rm      = document.getElementById('foto-rm');

  if (!avatar || !nome || !rm) return;

  nome.textContent = p.nome;
  rm.textContent   = p.rm;

  if (p.foto) {
    avatar.innerHTML = `<img src="${p.foto}" alt="${p.nome}" class="foto-avatar__img">`;
  } else {
    avatar.textContent = p.iniciais;
  }

  // Chama a função global do arquivo js/modal.js
  if (window.abrirModal) {
    window.abrirModal('modal-foto');
  }
}

window.verFoto = verFoto;

document.addEventListener('DOMContentLoaded', renderEquipe);