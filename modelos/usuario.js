import db from "../configs/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import mailer from "../configs/mailer.js"

export const addUsuario = async (req, res) => {
    const insert = "INSERT INTO usuario (nome_usuario, email, senha, telefone) VALUES (?,?,?,?)"
    const salt = await bcrypt.genSalt(12)
    const { nome_usuario, email, telefone } = req.body
    const senha = bcrypt.hashSync(req.body.senha, salt)

    db.query(insert, [nome_usuario, email, senha, telefone],(erro, resultado) => {
            if (erro)
                return res.status(400).json({msg: "Erro ao cadastrar usuário."})
            else
                return res.status(201).json({msg: "Usuário cadastrado com sucesso."})
        },
    )
}

export const login = async (req, res) => {
    const { email, senha } = req.body
    const select = "SELECT * FROM usuario WHERE `email`=?"
    db.query(select, [email], async (erro, usuario) => {
        if (!usuario[0]) {
            return res.status(400).json({ msg: "Senha incorreta ou email não cadastrado." })
        } else {
            const checkSenha = bcrypt.compareSync(senha, usuario[0].senha)
            if (!checkSenha) {
                return res.status(400).json({ msg: "Senha incorreta ou email não cadastrado." })
            } else {
                try {
                    const secret = process.env.SECRET
                    const token = jwt.sign({id: usuario[0].id,},secret)
                    res.status(200).json({msg: "Autenticação realizada com sucesso", token: token})
                } catch (erro) {
                    console.log(erro)
                }
            }
        }
    })
}

export const recuperacao = async (req, res) => {
    const { email } = req.body
    const token = crypto.randomBytes(5).toString("hex")
    const expiracao = new Date()
    expiracao.setHours(expiracao.getHours() + 1)

    const consulta = "SELECT * FROM usuario WHERE `email`=?"
    const atualizacao = "UPDATE usuario SET `token`=?, `expiracao_token`=? WHERE `email`=?"

    db.query(consulta, [email], async (erro, usuario) => {
        try {
            if (!usuario[0]) {
                return res.status(400).json({ msg: "Usuário não encontrado!"})
            } else {
                mailer.sendMail(
                    {
                        to: email,
                        from: "seucert@gmail.com",
                        subject: "Recuperação de senha: SeuCERT!",
                        html:
                            "<h1>Esqueceu sua senha?</h1><p>Aparentemente você deseja trocar sua senha no SeuCERT.</p> <p>Caso você de fato queira redefinir sua senha, utilize o seguinte código:</p> <h2>" +
                            token +
                            "</h2>",
                    }
                ),
                db.query(atualizacao, [token, expiracao, email], async () => {
                    return res.status(200).json({ msg: "Email de recuperação enviado." })
                })
            }
        } catch (err) {
            res.status(500).json({msg: "Houve um erro na recuperação de senha."})
        }
    })
}

export const resetSenha = async (req, res) => {
    const { email, token } = req.body
    const agora = new Date()
    const salt = await bcrypt.genSalt(12)
    const senha = bcrypt.hashSync(req.body.senha, salt)
    /* CORRIGIR ERRO*/
    db.query("SELECT * FROM usuario WHERE `email`=?", [email, token], async (erro, resultado) => {
   
            const usuario = resultado[0]
            if (!usuario) {
                res.status(422).json({msg: "Houve um erro ao redefinir a senha."})
            } else {
                if (token != usuario.token) {
                    res.status(422).send({msg: "Código de verificação incorreto!"})
                } else {
                    if (usuario.expiracao_token > agora) {
                        db.query("UPDATE usuario SET `senha` = ?, `token` = NULL, `expiracao_token` = NULL WHERE `email`=?", [senha, email], async (erro) => {
                                if (erro)
                                    return res.status(500).json({msg: "Erro ao atualizar usuário."})
                                else
                                    return res.status(200).json({msg: "Usuário atualizado."})
                            },
                        )
                    } else {
                        res.status(422).json({msg: "Código de redefinição expirado."})
                    }
                }
            }
      
    })
}

export const editUsuario = async (req, res) => {
    const update ="UPDATE usuario SET `nome_usuario` = ?, `telefone` = ? WHERE `email` = ?";

    const { nome_usuario,  telefone, email } = req.body


    db.query(
    update, [nome_usuario,  telefone, email], (erro) => {
        if (erro)
            return res.json({msg: "Erro ao atualizar usuário"});
        else
            return res.status(200).json({msg: "Usuário atualizado com sucesso."});
    });
}

export const codigo_email = async (req, res) => {
    const { email, novoEmail } = req.body
    const token = crypto.randomBytes(5).toString("hex")
    const expiracao = new Date()
    expiracao.setHours(expiracao.getHours() + 1)

    const consulta = "SELECT * FROM usuario WHERE `email`=?"
    const atualizacao = "UPDATE usuario SET `token`=?, `expiracao_token`=? WHERE `email`=?"

    db.query(consulta, [email], async (erro, usuario) => {
        try {
            if (!usuario[0]) {
                return res.status(422).json({ msg: "Usuário não encontrado!"})
            } else {
                mailer.sendMail(
                    {
                        to: novoEmail,
                        from: "seucert@gmail.com",
                        subject: "Recuperação de senha: SeuCERT!",
                        html:
                            "<h1>Deseja alterar seu e-mail?</h1><p>Aparentemente você deseja trocar seu e-mail no SeuCERT.</p> <p>Caso você de fato queira fazer isso, utilize o seguinte código:</p> <h2>" +
                            token +
                            "</h2>",
                    }
                )
            }
        } catch (erro) {
            res.status(500).json({msg: "Houve um erro na edição do usuário."})
        }
    }),
    db.query(atualizacao, [token, expiracao, email], async () => {
        return res.status(200).json({ msg: "Email de edição enviado." })
    })
}

export const editEmail = async (req, res) => {
    const { novoEmail, email, token } = req.body
    const agora = new Date()
    /* CORRIGIR ERRO*/
    db.query("SELECT * FROM usuario WHERE `email`=?", [email, token], async (erro, resultado) => {
        try {
            const usuario = resultado[0]
            if (!usuario) {
                res.status(422).json({msg: "Usuário não encontrado."})
            } else {
                if (token != usuario.token) {
                    res.status(422).send({msg: "Código de verificação incorreto!"})
                } else {
                    if (usuario.expiracao_token > agora) {
                        db.query("UPDATE usuario SET `email` = ?, `token` = NULL, `expiracao_token` = NULL WHERE `email` = ?", [novoEmail, email], async (erro) => {
                            if (erro)
                                    return res.status(500).json(erro)
                                else
                                    return res.status(200).json({msg: "Email atualizado."})
                            },
                        )
                    } else {
                        res.status(422).json({msg: "Código de redefinição expirado."})
                    }
                }
            }
        } catch (erro) {
            res.status(500).json({
                msg: "Houve um erro ao redefinir a senha.",
            })
        }
    })
}
