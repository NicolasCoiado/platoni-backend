import express from "express"
import verificaToken from "../configs/verifica-token.js"

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
    exclusaoUsuario
} from "../modelos/usuario.js"

const routesUser = express.Router()

routesUser.post("/cadastro", addUsuario)
routesUser.post("/", login)
routesUser.put("/recuperacao", recuperacao)
routesUser.put("/reset_senha", resetSenha)
routesUser.put("/edit_usuario", verificaToken, editUsuario)
routesUser.put("/codigo_email", verificaToken, codigo_email)
routesUser.put("/edit_email", verificaToken, editEmail)
routesUser.get("/get_id", verificaToken, getId)
routesUser.get("/get_infos", verificaToken, getInfos)
routesUser.delete("/codigo_exclusao", verificaToken, codigoExclusao)
routesUser.delete("/exclusao_usuario", verificaToken, exclusaoUsuario)

export default routesUser
