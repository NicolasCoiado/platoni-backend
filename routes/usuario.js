import express from "express";
import { getUsuarios, addUsuario, login } from "../controllers/usuario.js";

const routes = express.Router();

routes.get("/user", getUsuarios);
routes.post("/cadastro", addUsuario);
routes.post("/", login);
export default routes;
