import express from "express";
import rotas from "./routes/usuario.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(rotas);

app.listen(PORT, function () {
  console.log("Servidor ativo em: " + PORT);
});
