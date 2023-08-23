import db from "../config/db.js";
import bcrypt from "bcrypt";

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
      return res.status(400).json(error);
    } else {
      return res.status(201).json("Usuário criado com sucesso.");
    }
  });
};
