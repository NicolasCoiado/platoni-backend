import express from "express";
import verificaToken from "../services/verifica-token.js";
import upload from "../services/cfgMulter.mjs";

import {
  addCertificado,
  editCertificado,
  listarCertificados,
  getInfoCert,
  excluirCertificado,
} from "../controllers/certificado.js";

const routesCert = express.Router();

routesCert.post(
  "/cadastro_cert",
  upload.single("imagem"),
  verificaToken,
  addCertificado
);
routesCert.put(
  "/edit_cert",
  upload.single("imagem"),
  verificaToken,
  editCertificado
);
routesCert.post("/listar_cert", verificaToken, listarCertificados); //Substitui GET por POST, por conta de limitações do Axios.
routesCert.put("/infos_cert", getInfoCert); //Substitui GET por PUT, por conta de limitações do Axios.
routesCert.put("/delete_cert", verificaToken, excluirCertificado); //Substitui DELETE por PUT, por conta de limitações do Axios.

export default routesCert;
