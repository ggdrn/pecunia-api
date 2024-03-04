
// Chave secreta para assinar e verificar tokens JWT
const db = require("../models");
const Op = db.Sequelize.Op;
const AuthToken = db.sequelize.models.auth_token;
const Usuario = db.usuario;

function usuarioTipoPessoaAutenticacao(usuario, originalUrl) {
    // Listas de um de usuário que pode acessar rota específicas
    const dicionarioRotas = [
        'logout',
        'perfil',
        'usuario/criar',
        'registro_ocorrencia/criar',
        'registro_ocorrencia/detalhes',
        'categoria_ocorrencia',
        'item_subtraido',
        'natureza_ocorrencia',
        'pessoa/criar',
        'tipo_vinculo',
        'vinculo_universidade',
    ]
    // Se o usuário for do tipo administrador, ele pode acessar todas as rotas
    if (usuario.tipo === 1) {
        return true
    } else if (usuario.tipo === 2) {
        // Se o usuário for do tipo pessoa, ele pode acessar apenas algumas rotas
        return !!dicionarioRotas.includes(originalUrl);
    } else {
        // excessão da regra, o usuário não tem autorização de nada
        return false;
    }
}

// Middleware de autenticação
function autenticacaoMiddleware(req, res, next) {
    // Para Acessar a rota usuário, qualquer um consegue requisitar sem token
    const { originalUrl } = req;
    if (originalUrl.includes('login') || originalUrl.includes('usuario/criar')) {
        return next();
    }
    // Vamos verificar o token na requisição
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ mensagem: 'Token de autenticação não fornecido.' });
    } else {
        let condition = { token: { [Op.eq]: token } };
        AuthToken.findOne({ where: condition })
            .then(async data => {
                if (data) {
                    const tokenAutenticated = data.token;
                    try {
                        // Verifique e decodifique o token JWT usando a chave secreta correta
                        if (token === tokenAutenticated) {
                            condition = { uid: { [Op.eq]: data.usuarioUid } };
                            const usuario = await Usuario.findOne({ where: condition })
                            // Verificamos o perfil do usuario e seu acesso;
                            const validacaoUsuario = usuarioTipoPessoaAutenticacao(usuario);
                            // Se o token é válido, passe para a próxima rota
                            if (validacaoUsuario) {
                                return next();
                            }
                            else {
                                return res.status(401).json({ mensagem: 'Acesso negado' });
                            }
                        } else {
                            return res.status(401).json({ mensagem: 'Token de autenticação inválido.' });
                        }

                    } catch (erro) {
                        return res.status(401).json({ mensagem: 'Token de autenticação inválido.' });
                    }
                } else {
                    return res.status(401).json({ mensagem: 'Token de autenticação não encontrado.' });
                }
            })
            .catch(err => {
                res.status(401).send({
                    message: "Erro ao buscar o token de autenticação",
                    error: err
                });
            });
    }
}
module.exports = autenticacaoMiddleware; 