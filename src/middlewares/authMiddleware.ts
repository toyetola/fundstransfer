import  {Request, Response} from 'express'
import { verify } from "jsonwebtoken";

const verifyToken = async (req:any, res:Response, next:any) => {
    
    let authorization = req.headers['authorization']
    if (!authorization)
        return res.status(403).json({error: "An athorization header is required"})
    let token = await authorization.split(" ")[1]
    // return console.log(process.env.JWT_SECRET)
    if(!token)
        return res.status(403).json({error: "token required"})

    try {
        const checkToken = await verify(token, process.env.PUBLIC_KEY)
        req.user = checkToken.userId
        
    } catch (err:any) {
        return res.status(401).json({error:err.message})
    }
    return next()
}

export { verifyToken };