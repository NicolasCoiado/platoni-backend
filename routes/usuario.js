import express from "express"
import {
    addUsuario,
    login,
    recuperacao,
    resetsenha,
} from "../controllers/usuario.js"

const routes = express.Router()

routes.post("/cadastro", addUsuario)
routes.post("/", login)
routes.put("/recuperacao", recuperacao)
routes.put("/reset_senha", resetsenha)
export default routes
