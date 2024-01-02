import express from "express"
import verificaAdm from "../configs/verifica-adm.js"

import {
    getUsuarios,
    banir
} from "../modelos/adm.js"

const routesAdm = express.Router()

routesAdm.get("/get_usuarios", verificaAdm, getUsuarios)
routesAdm.delete("/banir", verificaAdm, banir)

export default routesAdm
