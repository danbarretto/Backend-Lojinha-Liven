import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
interface TokenData {
    token: string,
    expiresIn: number
}

interface DataStoredInToken {
    _id: number
}


export default (req: Request, res: Response, next: NextFunction) => {
    //const authHeader = parseCookies(req)
    if(!req.headers.authorization || !req.cookies.token) return res.status(401).send({error:'No token provided!'})

    const header = <string>req.headers.authorization;
    const parts = header.split(' ')
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

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, secret, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    //Call the next middleware or controller
    next();

}