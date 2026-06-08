//formulario.js//

const form = document.getElementById('formContato');

const validators = {
  nome:     { validate: v => v.trim().length >= 3,                        msg: 'Nome deve ter pelo menos 3 caracteres' },
  email:    { validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),       msg: 'Digite um e-mail valido (ex: voce@email.com)' },
  tipo:     { validate: v => v !== '' && v !== 'selecione',               msg: 'Selecione o tipo de ocorrencia' },
  mensagem: { validate: v => v.trim().length >= 20,                       msg: 'Mensagem muito curta — minimo 20 caracteres' },
};

function mostrarErro(campo, msg) {
  campo.classList.add('error');
  campo.classList.remove('success');
  let err = campo.parentElement.querySelector('.field-error');
  if (!err) { err = document.createElement('span'); err.className = 'field-error'; campo.after(err); }
  err.textContent = msg;
}

function limparErro(campo) {
  campo.classList.remove('error');
  campo.classList.add('success');
  const err = campo.parentElement.querySelector('.field-error');
  if (err) err.remove();
}

function validarCampo(campo) {
  const def = validators[campo.id];
  if (!def) return true;
  if (def.validate(campo.value)) { limparErro(campo); return true; }
  mostrarErro(campo, def.msg);
  return false;
}

function validarForm() {
  let valido = true;
  Object.keys(validators).forEach(id => {
    const campo = document.getElementById(id);
    if (campo && !validarCampo(campo)) valido = false;
  });
  return valido;
}

// validacao em tempo real
Object.keys(validators).forEach(id => {
  const campo = document.getElementById(id);
  if (!campo) return;
  campo.addEventListener('blur',  () => validarCampo(campo));
  campo.addEventListener('input', () => { if (campo.classList.contains('error')) validarCampo(campo); });
});

// contador de caracteres
const elMsg   = document.getElementById('mensagem');
const elCount = document.getElementById('msg-count');
if (elMsg && elCount) {
  elMsg.addEventListener('input', () => {
    const len = elMsg.value.length;
    elCount.textContent = len;
    elCount.classList.toggle('count-error', len < 20);
    elCount.classList.toggle('count-success', len >= 20);
  });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validarForm()) mostrarSucesso();
  });
}

function mostrarSucesso() {
  const nome = document.getElementById('nome')?.value || 'usuario';
  form.innerHTML = `
  <div class="form-success">
    <div class="form-success__icon">✅</div>

    <h3>Relato enviado com sucesso!</h3>

    <p>
      Obrigado, <strong>${nome}</strong>!
      Nossa equipe recebeu seu relato.
    </p>

    <p class="form-success__info">
      Em emergencias reais, contate a Defesa Civil:
      <strong>199</strong>
    </p>

    <button
      onclick="location.reload()"
      class="btn btn--primary form-success__button">
      Enviar novo relato
    </button>
  </div>
`;
}