import express from "express";
import { getUsuarios, addUsuario } from "../controllers/usuario.js";

const routes = express.Router();

routes.get("/user", getUsuarios);
routes.post("/cadastro", addUsuario);

export default routes;
