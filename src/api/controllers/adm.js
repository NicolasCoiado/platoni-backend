import db from "../services/db.js"

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

    db.query(deletCert, id_usuario, async (erro, resultado) => {
        if(erro){
            return res.status(400).json({msg: "Erro ao excluir certificados do usuário.", erro})
        }else{
            db.query(deletUsuario, id_usuario, async (err, resultad) => {
                if(erro){
                    return res.status(400).json({msg: "Erro ao excluir usuário.", err})
                }else{
                    return res.status(200).json({msg: "Usuário excluído."})
                }
            })
        }
    })

}