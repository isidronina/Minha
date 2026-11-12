// Este arquivo cuida do cadastro, do login e da sessão dos usuários.
// Os dados ficam no localStorage do navegador (não em um servidor).
const CHAVE_USUARIOS = 'cadastro_usuarios_banco';
const CHAVE_SESSAO = 'usuario_sessao';
const CHAVE_RASCUNHO_CADASTRO = 'cadastro_sessao_atual';

// Usuários de exemplo usados quando ainda não existe uma lista salva.
const usuariosIniciais = [
    { nome: 'Maria Souza', email: 'maria@empresa.com', senha: 'senha123' },
    { nome: 'João Pereira', email: 'joao@empresa.com', senha: 'senha456' }
];

// Lê a lista de usuários do navegador ou cria a lista de exemplo.
function obterUsuarios() {
    const dados = localStorage.getItem(CHAVE_USUARIOS);
    if (dados === null) {
        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuariosIniciais));
        return JSON.parse(JSON.stringify(usuariosIniciais));
    }

    try {
        return JSON.parse(dados);
    } catch (erro) {
        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuariosIniciais));
        return JSON.parse(JSON.stringify(usuariosIniciais));
    }
}

// Salva a lista de usuários no navegador.
function salvarUsuarios(usuarios) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

// Verifica se o e-mail já está cadastrado e depois salva o novo usuário.
function cadastrarUsuario(usuario) {
    const usuarios = obterUsuarios();
    const email = usuario.email.trim().toLowerCase();

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email.trim().toLowerCase() === email) {
            throw new Error('Já existe um usuário cadastrado com este e-mail.');
        }
    }

    const novoUsuario = {
        nome: usuario.nome.trim(),
        email: usuario.email.trim(),
        senha: usuario.senha
    };
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    return novoUsuario;
}

// Compara os dados informados com os usuários cadastrados.
function autenticar(email, senha) {
    const usuarios = obterUsuarios();
    const emailInformado = email.trim().toLowerCase();

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email.trim().toLowerCase() === emailInformado && usuarios[i].senha === senha) {
            return { nome: usuarios[i].nome, email: usuarios[i].email };
        }
    }

    return null;
}

// Salva os dados básicos do usuário que entrou no sistema.
function salvarSessao(usuario) {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify({
        nome: usuario.nome,
        email: usuario.email
    }));
}

// Retorna os dados da sessão atual, se houver uma.
function obterSessao() {
    const dados = localStorage.getItem(CHAVE_SESSAO);
    if (dados === null) {
        return null;
    }

    return JSON.parse(dados);
}

// Encerra a sessão removendo o usuário conectado.
function encerrarSessao() {
    localStorage.removeItem(CHAVE_SESSAO);
}

// Lê o rascunho do formulário de cadastro.
function obterRascunhoCadastro() {
    const dados = localStorage.getItem(CHAVE_RASCUNHO_CADASTRO);
    if (dados === null) {
        return {};
    }

    return JSON.parse(dados);
}

// Guarda temporariamente os dados do formulário de cadastro.
function salvarRascunhoCadastro(dados) {
    localStorage.setItem(CHAVE_RASCUNHO_CADASTRO, JSON.stringify(dados));
}

// Apaga o rascunho do formulário depois de concluir o cadastro.
function limparRascunhoCadastro() {
    localStorage.removeItem(CHAVE_RASCUNHO_CADASTRO);
}

// Disponibiliza as funções de autenticação para as outras páginas.
window.Autenticacao = {
    obterUsuarios: obterUsuarios,
    cadastrarUsuario: cadastrarUsuario,
    autenticar: autenticar,
    salvarSessao: salvarSessao,
    obterSessao: obterSessao,
    encerrarSessao: encerrarSessao,
    obterRascunhoCadastro: obterRascunhoCadastro,
    salvarRascunhoCadastro: salvarRascunhoCadastro,
    limparRascunhoCadastro: limparRascunhoCadastro
};
