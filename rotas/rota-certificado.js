import express from "express"
import verificaToken from "../configs/verifica-token.js"

import {
    addCertificado
} from "../modelos/certificado.js"

const routesCert = express.Router()

routesCert.post("/cadastro_cert", verificaToken, addCertificado)

export default routesCert
