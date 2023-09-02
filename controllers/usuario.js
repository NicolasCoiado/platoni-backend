import db from "../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import mailer from "../models/mailer.js";
import "dotenv/config";

export const addUsuario = async (req, res) => {
  const insert =
    "INSERT INTO usuario (nome_usuario, email, senha, telefone) VALUES (?,?,?,?)";

  const salt = await bcrypt.genSalt(12);
  const { nome_usuario, email, telefone } = req.body;
  const senha = bcrypt.hashSync(req.body.senha, salt);

  db.query(insert, [nome_usuario, email, senha, telefone], (error, results) => {
    if (error) {
      return res.status(402).json(error);
    } else {
      return res.status(201).json("Usuário criado com sucesso.");
    }
  });
};

export const login = async (req, res) => {
  const { email, senha } = req.body;
  const select = "SELECT * FROM usuario WHERE usuario.email=?";
  db.query(select, [email], async (erro, usuario) => {
    if (!usuario[0]) {
      return res.status(422).json({ msg: "Usuário não encontrado!" });
    } else {
      const checkSenha = bcrypt.compareSync(senha, usuario[0].senha);
      if (!checkSenha) {
        return res.status(422).json({ msg: "Senha incorreta!" });
      } else {
        try {
          const secret = process.env.SECRET;
          const token = jwt.sign(
            {
              id: usuario[0].id,
            },
            secret
          );
          res
            .status(200)
            .json({ msg: "Autenticação realizada com sucesso", token });
        } catch (erro) {
          console.log(erro);
        }
      }
    }
  });
};

export const recuperacao = async (req, res) => {
  const {email} = req.body;
  const token = crypto.randomBytes(5).toString("hex");
  const expiracao = new Date();
  expiracao.setHours(expiracao.getHours() + 1);

  const consulta = "SELECT * FROM usuario WHERE usuario.email=?";
  const atualizacao = "UPDATE usuario SET token=?, expiracao_token=? WHERE email=?";

  db.query(consulta, [email], async (erro, usuario) => {
    try {
      if (!usuario[0]) {
        return res.status(422).json({ msg: "Usuário não encontrado!", email});
      } else {
        mailer.sendMail(
          {
            to: email,
            from: "seucert@gmail.com",
            subject: "Recuperação de senha: SeuCERT!",
            html: "<h1>Esqueceu sua senha?</h1><p>Aparentemente você deseja trocar sua senha no SeuCERT.</p> <p>Caso você de fato queira redefinir sua senha, utilize o token:</p> <h2>"+token+"</h2>",
          },
          (err) => {
            if (err)
              return res.status(500).send({erro: "Não é possível enviar e-mail com senha esquecida!"});
          }
        );
      }
    } catch (err) {
      res.status(500).json({ erro: "Houve um erro na recuperação de senha!" });
    }
  }),
  db.query(atualizacao, [token, expiracao, email], async (erro, resultado)=>{
    return res.status(200).json({ msg: "Usuario atualizado"});
  });
};

export const resetsenha = async (req, res) => {
  const {email, token} = req.body;
  const consulta = "SELECT * FROM usuario WHERE usuario.email=?";
  const atualizacao ="UPDATE usuario SET `senha` = ? WHERE usuario.email=?"
  const agora = new Date();
  const salt = await bcrypt.genSalt(12);
  const senha = bcrypt.hashSync(req.body.senha, salt)

  db.query(consulta, [email, token, senha], async (erro, usuario) => {
    try{
      if (!usuario[0]) {
        return res.status(422).json({ erro: "Usuário não encontrado!"});
      } else {
         if(token != usuario[0].token){
          res.status(500).send({erro: "Código de verificação incorreto!"})
        }else{
          if(usuario[0].expiracao_token>agora){
            db.query(atualizacao, [senha, email], async (erro, resultado)=>{
              if(erro)
                // return res.status(422).json({ erro: "Erro"});
                console.log("Erro")
              else
                // return res.status(200).json({ erro: "Usuário atualizado!"});
                console.log("Foi")
              });
          }else{
            res.status(422).send({erro: "Código expirado!"})
          }
        }
      }
    }catch(erro){
      res.status(500).send("Deu ruim no começo")
    }
  });
};