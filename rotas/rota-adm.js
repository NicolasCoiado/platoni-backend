import express from "express"
import verificaAdm from "../configs/verifica-adm.js"

// import {
    
// } from "../modelos/adm"

const routesAdm = express.Router()

routesAdm.get("/get_usuarios", verificaAdm)

export default routesAdm
