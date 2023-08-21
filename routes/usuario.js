import express from "express";
import { getUsuarios } from "../controllers/usuario.js";

const routes = express.Router();

routes.get("/", getUsuarios);

export default routes;
