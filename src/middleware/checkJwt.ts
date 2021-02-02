import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export default (req: Request, res: Response, next: NextFunction) => {
    //const authHeader = parseCookies(req)
    if(!req.cookies.token) return res.status(401).send({error:'No token provided!'})

    const cookie =req.cookies.token
    const parts = cookie.split(' ')
    const [scheme, token] = parts
    const secret = <string>process.env.SECRET_JWT

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Malformatted Token! ' })

    let jwtPayload;

    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, secret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send({error:'Invalid token!'});
        return;
    }
    
    req.id = jwtPayload.id
    //Call the next middleware or controller
    return next();

}