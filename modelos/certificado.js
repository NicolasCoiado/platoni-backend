import db from "../configs/db.js";
import multer from "multer";
import path from "path";
import axios from "axios";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage });

export const addCertificado = async (req, res) => {
    const client_imgur = process.env.CLIENT_IMGUR

    const { nome_certificado, emissor, descricao } = req.body;

    if (!nome_certificado || !emissor || !descricao || !req.file) {
        return res.status(400).json({ msg: "Todos os campos são obrigatórios, incluindo a imagem." });
    }

    const imagem = req.file.filename;

    try {
        const imgurResponse = await axios.post('https://api.imgur.com/3/upload', {
            image: path.join(__dirname, '../uploads', imagem),
            type: 'file'
        }, {
            headers: {
                Authorization: client_imgur, 
            }
        });

        const imageUrl = imgurResponse.data.data.link;

        const insert = "INSERT INTO certificados (nome_certificado, emissor, imagem, descricao) VALUES (?,?,?,?)";

        db.query(insert, [nome_certificado, emissor, imageUrl, descricao], (erro, resultado) => {
            if (erro) {
                return res.status(400).json({ msg: "Erro ao cadastrar certificado.", erro });
            } else {
                return res.status(201).json({ msg: "Certificado cadastrado com sucesso." });
            }
        });
    } catch (error) {
        return res.status(500).json({ msg: "Erro ao realizar o upload da imagem.", erro: error.message });
    }
};

export default upload.single('imagem');
