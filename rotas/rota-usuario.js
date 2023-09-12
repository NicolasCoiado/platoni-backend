import express from "express"
import verificaToken from "../configs/verifica-token.js"

import {
    addUsuario,
    login,
    recuperacao,
    resetSenha,
    editUsuario,
    codigo_email,
    editEmail
} from "../modelos/usuario.js"

const routes = express.Router()

routes.post("/cadastro", addUsuario)
routes.post("/", login)
routes.put("/recuperacao", recuperacao)
routes.put("/reset_senha", resetSenha)
routes.put("/edit_usuario", verificaToken, editUsuario)
routes.put("/codigo_email", verificaToken, codigo_email)
routes.put("/edit_email", verificaToken, editEmail)


export default routes
