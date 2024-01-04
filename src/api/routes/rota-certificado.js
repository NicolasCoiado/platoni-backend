import express from "express"
import verificaToken from "../services/verifica-token.js"
import upload from '../services/cfgMulter.mjs';

import {
    addCertificado,
    editCertificado,
    listarCertificados,
    getInfoCert,
    excluirCertificado
} from "../controllers/certificado.js"

const routesCert = express.Router()

routesCert.post("/cadastro_cert", upload.single('imagem'), verificaToken, addCertificado)
routesCert.put("/edit_cert", upload.single('imagem'), verificaToken, editCertificado)
routesCert.get("/listar_cert", verificaToken, listarCertificados)
routesCert.get("/infos_cert", verificaToken, getInfoCert)
routesCert.delete("/delete_cert", verificaToken, excluirCertificado)

export default routesCert
