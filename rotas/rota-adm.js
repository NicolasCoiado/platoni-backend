import express from "express"
import verificaAdm from "../configs/verifica-adm.js"

import {
    getUsuarios
} from "../modelos/adm.js"

const routesAdm = express.Router()

routesAdm.get("/get_usuarios", verificaAdm, getUsuarios)

export default routesAdm
