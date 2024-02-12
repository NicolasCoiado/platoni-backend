import db from "../services/db.js";
import cloudinary from "../services/cloudinary.js";
import fs from "fs";

export const addCertificado = async (req, res) => {
  const { nome_certificado, emissor, descricao, id_usuario } = req.body;
  const insert =
    "INSERT INTO certificados (nome_certificado, emissor, descricao, url, id_usuario, id_url) VALUES (?,?,?,?,?,?)";
  if (!req.file || !id_usuario) {
    return res.status(422).json({ msg: "O campo de imagem é obrigatório." });
  }
  try {
    let urlImg;
    let id_url;
    cloudinary.uploader.upload(req.file.path, function (erra, result) {
      if (erra) {
        console.log(erra);
        return res.status(500).json({ msg: "Erro ao cadastrar certificado." });
      } else {
        urlImg = result.secure_url;
        id_url = result.public_id;
        db.query(
          insert,
          [nome_certificado, emissor, descricao, urlImg, id_usuario, id_url],
          (errou) => {
            if (errou) {
              console.log(errou);
              fs.unlink(req.file.path, function (erro) {
                console.log(erro);
                return res
                  .status(400)
                  .json({ msg: "Erro ao cadastrar certificado." });
              });
            } else {
              fs.unlink(req.file.path, function (err) {
                console.log(err);
                return res
                  .status(201)
                  .json({ msg: "Certificado cadastrado com sucesso." });
              });
            }
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Erro ao cadastrar certificado." });
  }
};

export const listarCertificados = async (req, res) => {
  const select =
    "SELECT id_certificado, nome_certificado, url FROM certificados WHERE id_usuario = ?";
  const { id_usuario } = req.body;

  db.query(select, [id_usuario], (erro, certificados) => {
    if (erro)
      return res.status(500).json({ msg: "Erro ao consultar certificados." });
    else
      return res
        .status(200)
        .json({ msg: "Certificados consultados com sucesso.", certificados });
  });
};

export const getInfoCert = async (req, res) => {
  const select = "SELECT * FROM certificados WHERE id_certificado = ?";
  const { id_certificado } = req.body;

  db.query(select, [id_certificado], (erro, informacoes) => {
    if (erro)
      return res.status(500).json({ msg: "Erro ao consultar certificado." });
    else
      return res
        .status(200)
        .json({ msg: "Certificados consultados com sucesso.", informacoes });
  });
};

export const editCertificado = async (req, res) => {
  const { nome_certificado, emissor, descricao, id_certificado } = req.body;
  const select = "SELECT id_url FROM certificados WHERE id_certificado = ?";
  const update =
    "UPDATE certificados SET nome_certificado = ?, emissor = ?, descricao = ?, url = ?, id_url = ? WHERE id_certificado = ?";
  const update2 =
    "UPDATE certificados SET nome_certificado = ?, emissor = ?, descricao = ? WHERE id_certificado = ?";

  let id_url;
  let urlImg;

  try {
    if (req.file) {
      db.query(select, [id_certificado], (erro, resultado) => {
        if (erro) {
          return res
            .status(400)
            .json({ msg: "Erro ao consultar certificado.", erro });
        } else {
          id_url = resultado[0].id_url;
          cloudinary.uploader.destroy(id_url, function (err) {
            if (err) {
              return res
                .status(500)
                .json({ msg: "Erro ao editar imagem do certificado.", err });
            } else {
              cloudinary.uploader.upload(req.file.path, function (err, result) {
                if (err) {
                  return res
                    .status(500)
                    .json({ msg: "Erro ao atualizar certificado.", err });
                } else {
                  urlImg = result.secure_url;
                  id_url = result.public_id;
                  db.query(
                    update,
                    [
                      nome_certificado,
                      emissor,
                      descricao,
                      urlImg,
                      id_url,
                      id_certificado,
                    ],
                    (erro) => {
                      if (erro) {
                        fs.unlink(req.file.path, function (err) {
                          return res.status(400).json({
                            msg: "Erro ao atualizar certificado.",
                            erro,
                          });
                        });
                      } else {
                        fs.unlink(req.file.path, function (err) {
                          return res.status(200).json({
                            msg: "Certificado atualizado com sucesso.",
                          });
                        });
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
    } else {
      db.query(
        update2,
        [nome_certificado, emissor, descricao, id_certificado],
        (erro) => {
          if (erro)
            return res
              .status(400)
              .json({ msg: "Erro ao atualizar certificado.", erro });
          else
            return res
              .status(200)
              .json({ msg: "Certificado atualizado com sucesso." });
        }
      );
    }
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Erro ao atualizar certificado.", erro });
  }
};

export const excluirCertificado = async (req, res) => {
  const { id_certificado } = req.body;
  const select = "SELECT id_url FROM certificados WHERE id_certificado = ?";
  const exclusao = "DELETE FROM certificados WHERE id_certificado = ?";
  let id_url;

  try {
    db.query(select, [id_certificado], (erro, resultado) => {
      if (erro) {
        return res
          .status(400)
          .json({ msg: "Erro ao excluir certificado.", erro });
      } else {
        id_url = resultado[0].id_url;
        cloudinary.uploader.destroy(id_url, function (err) {
          if (err) {
            return res
              .status(500)
              .json({ msg: "Erro ao excluir imagem do certificado.", err });
          } else {
            db.query(exclusao, [id_certificado], (erro) => {
              if (erro)
                return res
                  .status(400)
                  .json({ msg: "Erro ao excluir certificado.", erro });
              else
                return res
                  .status(200)
                  .json({ msg: "Certificado excluído com sucesso." });
            });
          }
        });
      }
    });
  } catch (error) {
    return res.status(400).json({ msg: "Erro ao excluir certificado.", erro });
  }
};
