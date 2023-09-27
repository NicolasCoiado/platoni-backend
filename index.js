import express from "express"
import routesUser from "./rotas/rota-usuario.js"
import routesAdm from "./rotas/rota-adm.js"
import routesCert from "./rotas/rota-certificado.js"

import "dotenv/config"

const app = express()
const PORT = process.env.PORT

app.use(express.json())

app.use(routesUser)
app.use(routesAdm)
app.use(routesCert)

app.listen(PORT, function () {
    console.log("Servidor ativo em: " + PORT)
})
