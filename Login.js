// Mostra ou esconde uma mensagem de erro em um campo.
function exibirErro(elemento, mensagem = '') {
  elemento.textContent = mensagem;
  elemento.hidden = !mensagem;
}

// Controla o botão que mostra ou esconde a senha.
document.addEventListener('click', function (evento) {
  const botao = evento.target.closest('[data-action="toggle-login-password"]');
  if (!botao) {
    return;
  }

  const campoSenha = document.getElementById('senha');
  const mostrarSenha = campoSenha.type === 'password';

  campoSenha.type = mostrarSenha ? 'text' : 'password';
  botao.textContent = mostrarSenha ? 'Ocultar' : 'Mostrar';
});

// Encontra o formulário de login nesta página.
const formularioLogin = document.getElementById('login-form');

// Prepara o envio do formulário, se ele estiver presente na página.
if (formularioLogin) {
  formularioLogin.addEventListener('submit', function (evento) {
    evento.preventDefault();

    // Guarda os campos que mostram as mensagens de erro.
    const erros = {
      email: formularioLogin.querySelector('[data-error="email"]'),
      senha: formularioLogin.querySelector('[data-error="senha"]'),
      formulario: formularioLogin.querySelector('[data-error="form"]')
    };
    const email = formularioLogin.email.value.trim();
    const senha = formularioLogin.senha.value;

    // Apaga erros antigos antes de tentar entrar novamente.
    exibirErro(erros.email);
    exibirErro(erros.senha);
    exibirErro(erros.formulario);

    // Confere o e-mail e a senha e inicia a sessão do usuário.
    try {
      const usuario = window.Autenticacao.autenticar(email, senha);

      if (!usuario) {
        exibirErro(erros.formulario, 'E-mail ou senha inválidos.');
        return;
      }

      window.Autenticacao.salvarSessao(usuario);
      window.location.href = '../Dashboard/Dashboard.html';
    } catch (erro) {
      exibirErro(erros.formulario, 'Não foi possível acessar os dados salvos no navegador.');
      console.error(erro);
    }
  });
}
