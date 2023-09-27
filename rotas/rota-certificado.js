import express from "express"
import verificaToken from "../configs/verifica-token.js"
import upload from '../configs/cfgMulter.mjs';

import {
    addCertificado
} from "../modelos/certificado.js"

const routesCert = express.Router()

routesCert.post("/cadastro_cert", upload.single('imagem'), addCertificado)


export default routesCert
