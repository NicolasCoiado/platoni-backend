import express from "express";
import verificaToken from "../services/verifica-token.js";

import {
  addUsuario,
  login,
  recuperacao,
  resetSenha,
  editUsuario,
  codigo_email,
  editEmail,
  getId,
  getInfos,
  codigoExclusao,
  exclusaoUsuario,
} from "../controllers/usuario.js";

const routesUser = express.Router();

routesUser.post("/cadastro", addUsuario);
routesUser.post("/", login);
routesUser.put("/recuperacao", recuperacao);
routesUser.put("/reset_senha", resetSenha);
routesUser.put("/edit_usuario", verificaToken, editUsuario);
routesUser.put("/codigo_email", verificaToken, codigo_email);
routesUser.put("/edit_email", verificaToken, editEmail);
routesUser.get("/get_id", verificaToken, getId);
routesUser.post("/get_infos", verificaToken, getInfos); //Substitui GET por POST, por conta de limitações do Axios.
routesUser.put("/codigo_exclusao", verificaToken, codigoExclusao);
routesUser.put("/exclusao_usuario", verificaToken, exclusaoUsuario); //Substitui DELETE por PUT, por conta de limitações do Axios.

export default routesUser;
