import db from "../configs/db.js"
import path from "path"
import imgur from "imgur"
import fs from "fs"
import "dotenv/config"

export const addCertificado = async (req, res) => {
  const { nome_certificado, emissor, descricao } = req.body;

  if (!nome_certificado || !emissor || !descricao || !req.file) {
    return res.status(400).json({ msg: "Todos os campos são obrigatórios, incluindo a imagem." });
  }

  const imagem = req.file.filename
  let uploadPath = process.cwd() + "./uploads" + imagem

  console.log(req.body, req.file)
  // try {
  //   imgur.uploadFile(uploadPath).then((urlObject) => {
	// 		fs.unlinkSync(uploadPath)
	// 		res.render('uploaded.ejs', { link: urlObject.link })
	// 	})

  //   const imageUrl = imgurResponse.data.data.link;
    
  //   return res.status(400).json({ nome_certificado, emissor, imageUrl, descricao});

  //   const insert = "INSERT INTO certificado (nome_certificado, emissor, imagem, descricao) VALUES (?,?,?,?)";

  //   db.query(insert, [nome_certificado, emissor, imageUrl, descricao], (erro, resultado) => {
  //       if (erro) {
  //           return res.status(400).json({ msg: "Erro ao cadastrar certificado.", erro });
  //       } else {
  //           return res.status(201).json({ msg: "Certificado cadastrado com sucesso." });
  //       }
  //   });
  // } catch (error) {
  //   return res.status(500).json({ msg: "Erro ao realizar o upload da imagem.", erro: error.message });
  // }
}