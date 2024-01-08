import express from "express"
import swaggerUi from "swagger-ui-express"
import routesUser from "./api/routes/rota-usuario.js"
import routesAdm from "./api/routes/rota-adm.js"
import routesCert from "./api/routes/rota-certificado.js"
import fs from 'fs';
import "dotenv/config"

const rawdata = fs.readFileSync('./docs/swagger.json');
const swaggerDocument = JSON.parse(rawdata);

const app = express()
const PORT = process.env.PORT

app.use(express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(routesUser)
app.use(routesAdm)
app.use(routesCert)

app.listen(PORT, function () {
    console.log("Servidor ativo em: " + PORT)
})
