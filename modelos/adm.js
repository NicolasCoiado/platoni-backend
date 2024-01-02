import db from "../configs/db.js"

export const getUsuarios = async (req, res) => {
    const select = "SELECT id_usuario, nome_usuario, email FROM `usuarios`;"

    db.query(select, (erro, resultado) => {
            if (erro)
                return res.status(400).json({msg: "Erro ao listar usuários.", erro})
            else
                return res.status(201).json({resultado})
        },
    )
}

export const banir = async (req, res) => {
    const {id_usuario}  = req.body

    const deletCert = "DELETE FROM certificados WHERE id_usuario=?;"
    const deletUsuario = "DELETE FROM usuarios WHERE id_usuario=?;"

    
}