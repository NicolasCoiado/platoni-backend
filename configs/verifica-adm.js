import jwt from "jsonwebtoken"
import db from "../configs/db.js"
import "dotenv/config"

const verificaAdm = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]

    if (!token){
        return res.status(401).json({msg: "Acesso negado."})
    }

    const secret = process.env.SECRET
    
    try {
        const decoded = jwt.verify(token, secret)
        const id = decoded.id

        const select = "SELECT `tipo_usuario` FROM usuario WHERE `id_usuario`=?"
        
        db.query(select, id, async (erro, resultado) => {
            const tipoUsuario = resultado[0].tipo_usuario;
            if(erro){
                res.status(500).json({msg: "Erro ao realizar a autenticação."})
            } else {
                if (!resultado[0]) {
                    return res.status(400).json({ msg: "Senha incorreta ou e-mail não cadastrado." })
                } else {
                    if(tipoUsuario==0){
                        return res.status(400).json({ msg: "O usuário não é um administrador." })
                    } else if(tipoUsuario==1){
                        next()
                    } else {
                        return res.status(400).json({ msg: "Erro ao realizar a autenticação." })
                    }
                }
            }
        })
    } catch (error) {
        if (error) {
            return res.status(401).json({msg: "Token inválido."})
        } else {
            return res.status(500).json({msg: "Erro ao realizar a autenticação."})
        }
    }
}

export default verificaAdm
