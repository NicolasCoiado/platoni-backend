import jwt from "jsonwebtoken"
import "dotenv/config"

const verificaToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]

    if (!token){
        return res.status(401).json({msg: "Acesso negado."})
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    }catch(erro){
        res.status(400).json({msg: "Token inválido."})
    }
}

export default verificaToken
