import db from "../services/db.js"

export const getUsuarios = async (req, res) => {
    const select = "SELECT id_usuario, nome_usuario, email FROM `usuarios`;"

    db.query(select, (erro, resultado) => {
            if (erro)
                return res.status(400).json({msg: "Erro ao listar usuários."})
            else
                return res.status(201).json({resultado})
        },
    )
}

export const banir = async (req, res) => {
    const {id_usuario}  = req.body

    const deletCert = "DELETE FROM certificados WHERE id_usuario=?;"
    const banirUsuario = "UPDATE usuarios SET banimento=1 WHERE id_usuario=?;"

    db.query(deletCert, id_usuario, async (erro, resultado) => {
        if(erro){
            return res.status(500).json({msg: "Erro ao excluir certificados do usuário."})
        }else{
            db.query(banirUsuario, id_usuario, async (err, resultad) => {
                if(erro){
                    return res.status(500).json({msg: "Erro ao banir usuário."})
                }else{
                    return res.status(200).json({msg: "Usuário banido."})
                }
            })
        }
    })

}