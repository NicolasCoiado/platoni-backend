import db from "../config/db.js";
import bcrypt from "bcryptjs";

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

export const addUsuario = (req, res) => {
  const sql =
    "INSERT INTO usuario (nome_usuario, email, senha, telefone) VALUES (?)";

  const valores = [
    req.body.nome_usuario,
    req.body.email,
    bcrypt.hashSync(req.body.senha),
    req.body.telefone,
  ];

  db.query(sql, [valores], (error, results) => {
    if (error) {
      return res.status(404).json(error);
    } else {
      return res.status(200).json("Usuário criado com sucesso.");
    }
  });
};
