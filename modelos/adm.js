import db from "../configs/db.js"

export const getUsuarios = async (req, res) => {
    const select = "SELECT nome_usuario, email FROM `usuario`;"

    db.query(select, (erro, resultado) => {
            if (erro)
                return res.status(400).json({msg: "Erro ao listar usuários."})
            else
                return res.status(201).json({resultado})
        },
    )
}
