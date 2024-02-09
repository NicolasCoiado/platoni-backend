import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import routesUser from "./api/routes/rota-usuario.js";
import routesAdm from "./api/routes/rota-adm.js";
import routesCert from "./api/routes/rota-certificado.js";
import fs from "fs";
import "dotenv/config";

const rawdata = fs.readFileSync("./docs/swagger.json");
const swaggerDocument = JSON.parse(rawdata);

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routesUser);
app.use(routesAdm);
app.use(routesCert);

app.listen(PORT, function () {
  console.log("Servidor ativo em: " + PORT);
});
