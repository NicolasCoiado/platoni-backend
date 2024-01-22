import db from "../services/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import mailer from "../services/mailer.js";

export const addUsuario = async (req, res) => {
  try {
    const insert =
      "INSERT INTO usuarios (nome_usuario, email, senha) VALUES (?,?,?);";
    const salt = await bcrypt.genSalt(12);
    const { nome_usuario, email } = req.body;
    const senha = bcrypt.hashSync(req.body.senha, salt);
    db.query(insert, [nome_usuario, email, senha], (erro, resultado) => {
      if (erro) {
        return res.status(400).json({ msg: "Erro ao cadastrar usuário." });
      } else
        return res.status(201).json({ msg: "Usuário cadastrado com sucesso." });
    });
  } catch (error) {
    return res.status(400).json({ msg: "Erro ao cadastrar usuário." });
  }
};

export const login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res
      .status(400)
      .json({ msg: "Todos os campos devem ser preenchidos." });
  } else {
    const select =
      "SELECT id_usuario, senha, banimento FROM usuarios WHERE email=?";
    db.query(select, [email], async (erro, resultado) => {
      if (erro) {
        res.status(500).json({ msg: "Erro ao realizar a autenticação." });
      } else {
        const usuario = resultado[0];
        if (usuario !== undefined) {
          const idBanco = usuario.id_usuario;
          const senhaBanco = usuario.senha;
          const banimentoBanco = usuario.banimento;
          if (banimentoBanco === 0) {
            const checkSenha = bcrypt.compareSync(senha, senhaBanco);
            if (!checkSenha) {
              return res
                .status(400)
                .json({ msg: "Senha incorreta ou e-mail não cadastrado." });
            } else {
              const secret = process.env.SECRET;
              const id_user = { id: idBanco };
              const token = jwt.sign(id_user, secret, {
                noTimestamp: true,
                expiresIn: 7000,
              });
              res.status(200).json({
                msg: "Autenticação realizada com sucesso",
                token: token,
              });
            }
          } else {
            return res.status(403).json({ msg: "Usuário banido." });
          }
        } else {
          return res
            .status(400)
            .json({ msg: "Senha incorreta ou e-mail não cadastrado." });
        }
      }
    });
  }
};

export const getId = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado." });
  }

  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    return res.status(200).json({ id: decoded.id });
  } catch (erro) {
    res.status(400).json({ msg: "O Token informado é inválido." });
  }
};

export const recuperacao = async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(5).toString("hex");
  const expiracao = new Date();
  expiracao.setHours(expiracao.getHours() + 1);
  const consulta = "SELECT * FROM usuarios WHERE email=?";
  const atualizacao =
    "UPDATE usuarios SET token=?, expiracao_token=? WHERE email=?";

  db.query(consulta, [email], async (erro, usuario) => {
    if (erro) {
      return res
        .status(500)
        .json({ msg: "Erro ao enviar e-mail de recuperação." });
    } else {
      if (!usuario[0]) {
        return res
          .status(400)
          .json({ msg: "Usuário não encontrado ou campo não preenchido." });
      } else {
        mailer.sendMail({
          to: email,
          from: "platoni.certificados@gmail.com",
          subject: "Recuperação de senha: Platoni!",
          html:
            "<h1>Esqueceu sua senha?</h1><p>Aparentemente você deseja trocar sua senha no Platoni.</p> <p>Caso você de fato queira redefinir sua senha, utilize o seguinte código:</p> <h2>" +
            token +
            "</h2>",
        }),
          db.query(atualizacao, [token, expiracao, email], async () => {
            return res
              .status(201)
              .json({ msg: "E-mail de recuperação enviado." });
          });
      }
    }
  });
};

export const resetSenha = async (req, res) => {
  try {
    const { email, token } = req.body;
    const agora = new Date();
    const salt = await bcrypt.genSalt(12);
    const senha = bcrypt.hashSync(req.body.senha, salt);

    const consulta = "SELECT * FROM usuarios WHERE email=?";
    const atualizacao =
      "UPDATE usuarios SET senha = ?, token = NULL, expiracao_token = NULL WHERE email=?";

    db.query(consulta, [email, token], async (erro, usuario) => {
      if (erro) {
        res.status(500).json({ msg: "Houve um erro ao redefinir senha." });
      } else {
        if (!usuario[0]) {
          res
            .status(400)
            .json({ msg: "Usuário não encontrado ou campo não preenchido." });
        } else {
          if (token != usuario[0].token) {
            res.status(422).send({ msg: "Código de verificação incorreto." });
          } else {
            if (usuario[0].expiracao_token > agora) {
              db.query(atualizacao, [senha, email], async (erro) => {
                if (erro)
                  return res
                    .status(500)
                    .json({ msg: "Erro ao atualizar senha." });
                else
                  return res.status(200).json({ msg: "Usuário atualizado." });
              });
            } else {
              res.status(400).json({ msg: "Código de redefinição expirado." });
            }
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Houve um erro ao redefinir senha." });
  }
};

export const editUsuario = async (req, res) => {
  const update = "UPDATE usuarios SET nome_usuario = ? WHERE email = ?";

  const { nome_usuario, email } = req.body;

  if (!nome_usuario || !email) {
    return res
      .status(400)
      .json({ msg: "Todos os campos devem ser preenchidos." });
  } else {
    db.query(update, [nome_usuario, email], (erro) => {
      if (erro)
        return res.status(500).json({ msg: "Erro ao atualizar usuário." });
      else
        return res.status(200).json({ msg: "Usuário atualizado com sucesso." });
    });
  }
};

export const codigo_email = async (req, res) => {
  const { email, novoEmail } = req.body;
  if (!email || !novoEmail) {
    return res.status(400).json({ msg: "Todos os campos são obrigatórios." });
  } else {
    const token = crypto.randomBytes(5).toString("hex");
    const expiracao = new Date();
    expiracao.setHours(expiracao.getHours() + 1);

    const consulta = "SELECT * FROM usuarios WHERE email=?";
    const atualizacao =
      "UPDATE usuarios SET token=?, expiracao_token=? WHERE email=?";

    db.query(consulta, [email], async (erro, usuario) => {
      if (erro) {
        return res
          .status(500)
          .json({ msg: "Erro ao enviar e-mail de edição." });
      } else {
        if (!usuario[0]) {
          return res.status(422).json({ msg: "Usuário não encontrado." });
        } else {
          mailer.sendMail({
            to: novoEmail,
            from: "platoni.certificados@gmail.com",
            subject: "Edição de email: Platoni!",
            html:
              "<h1>Deseja alterar seu e-mail?</h1><p>Aparentemente você deseja trocar seu e-mail no Platoni.</p> <p>Caso você de fato queira fazer isso, utilize o seguinte código:</p> <h2>" +
              token +
              "</h2>",
          }),
            db.query(atualizacao, [token, expiracao, email], async () => {
              return res.status(200).json({ msg: "Email de edição enviado." });
            });
        }
      }
    });
  }
};

export const editEmail = async (req, res) => {
  const { novoEmail, email, token } = req.body;

  if (!novoEmail || !email || !token) {
    return res.status(400).json({ msg: "Todos os campos são obrigatórios." });
  } else {
    const agora = new Date();
    db.query(
      "SELECT * FROM usuarios WHERE email=?",
      [email, token],
      async (erro, usuario) => {
        if (erro) {
          res.status(500).json({ msg: "Erro ao consultar usuário." });
        } else {
          if (!usuario[0]) {
            res.status(422).json({ msg: "Usuário não encontrado." });
          } else {
            if (token != usuario[0].token) {
              res.status(422).send({ msg: "Código de verificação incorreto." });
            } else {
              if (usuario[0].expiracao_token > agora) {
                db.query(
                  "UPDATE usuarios SET email = ?, token = NULL, expiracao_token = NULL WHERE email = ?",
                  [novoEmail, email],
                  async (erro) => {
                    if (erro)
                      return res.status(500).json("Erro ao atualizar email.");
                    else
                      return res.status(200).json({ msg: "Email atualizado." });
                  }
                );
              } else {
                res
                  .status(400)
                  .json({ msg: "Código de redefinição expirado." });
              }
            }
          }
        }
      }
    );
  }
};

export const getInfos = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json("O campo id é obrigatório.");
  } else {
    const consulta =
      "SELECT nome_usuario, email FROM usuarios WHERE id_usuario=?";

    db.query(consulta, [id], async (erro, resultado) => {
      if (erro)
        return res.status(500).json({ msg: "Erro ao consultar informações." });
      else return res.status(200).json(resultado[0]);
    });
  }
};

export const codigoExclusao = async (req, res) => {
  const { id, email } = req.body;
  if (!id || !email) {
    return res.status(400).json({ msg: "Todos os campos são obrigatórios." });
  } else {
    const token = crypto.randomBytes(5).toString("hex");
    const expiracao = new Date();
    expiracao.setHours(expiracao.getHours() + 1);

    const consulta = "SELECT email FROM usuarios WHERE id_usuario = ?;";
    const atualizacao =
      "UPDATE usuarios SET token=?, expiracao_token=? WHERE id_usuario=?";

    db.query(consulta, [id], async (erro, resposta) => {
      if (resposta[0] == undefined) {
        return res.status(422).json({ msg: "Usuário não cadastrado." });
      } else if (erro) {
        return res
          .status(500)
          .json({ msg: "Erro ao enviar email de confirmação." });
      } else {
        if (email == resposta[0].email) {
          mailer.sendMail({
            to: email,
            from: "platoni.certificados@gmail.com",
            subject: "Exclusão de conta: Platoni!",
            html:
              "<h1>Deseja excluir sua conta?</h1><p>Aparentemente você deseja excluir sua conta no Platoni.</p> <p>Caso você de fato queira fazer isso, utilize o seguinte código:</p> <h2>" +
              token +
              "</h2>",
          }),
            db.query(atualizacao, [token, expiracao, email], async () => {
              return res.status(200).json({ msg: "Email de edição enviado." });
            });
        } else {
          return res.status(422).json({ msg: "Email incorreto." });
        }
      }
    });
  }
};

export const exclusaoUsuario = async (req, res) => {
  const { id, token } = req.body;
  const consulta =
    "SELECT COUNT(*) AS qtdUsuarios FROM usuarios WHERE id_usuario = ?;";
  const exclusao = "DELETE FROM usuarios WHERE id_usuario=?;";

  if (!id || !token) {
    return res.status(422).json({ msg: "Todos os campos são obrigatórios." });
  } else {
    db.query(consulta, [id, token], async (erro, resultado) => {
      if (erro) {
        res.status(500).json({ msg: "Erro ao exluir conta." });
      } else {
        const qtdUsuarios = resultado[0].qtdUsuarios;
        if (qtdUsuarios == 0) {
          return res.status(422).json({ msg: "Erro ao consultar usuário." });
        } else if (qtdUsuarios == 1) {
          db.query(exclusao, [id], async (erro, resultado) => {
            if (erro) res.status(400).json({ msg: "Erro ao exluir conta." });
            else return res.status(200).json({ msg: "Usuário excluído." });
          });
        } else {
          return res.status(400).json({ msg: "Erro ao exluir conta." });
        }
      }
    });
  }
};
