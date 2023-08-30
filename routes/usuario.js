import express from "express";
import { addUsuario, login, recuperacao, resetsenha } from "../controllers/usuario.js";

const routes = express.Router();

routes.post("/cadastro", addUsuario);
routes.post("/", login);
routes.post("/recuperacao", recuperacao);
routes.post("/resetsenha", resetsenha);
export default routes;
