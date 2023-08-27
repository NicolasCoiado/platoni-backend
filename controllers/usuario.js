import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const getUsuarios = (_, res) => {
  const sql = "SELECT * FROM usuario";
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(404).json(error);
    } else {
      return res.status(200).json(results);
    }
  });
};

export const addUsuario = async (req, res) => {
  const sql =
    "INSERT INTO usuario (nome_usuario, email, senha, telefone) VALUES (?,?,?,?)";

  const salt = await bcrypt.genSalt(12);
  const { nome_usuario, email, telefone } = req.body;
  const senha = bcrypt.hashSync(req.body.senha, salt);

  db.query(sql, [nome_usuario, email, senha, telefone], (error, results) => {
    if (error) {
      return res.status(402).json(error);
    } else {
      return res.status(201).json("Usuário criado com sucesso.");
    }
  });
};

export const login = async (req, res) => {
  const { email, senha } = req.body;
  const sql = "SELECT * FROM usuario WHERE usuario.email=?";
  db.query(sql, [email], async (erro, usuario) => {
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
