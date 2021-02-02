import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import User from "../models/User";
import jwt from 'jsonwebtoken'
import { ValidationError } from "objection";
import 'dotenv/config'

function generateToken(params: {}) {
    const token = jwt.sign(params, <string>process.env.SECRET_JWT, {
        expiresIn: 86400,
    })
    return token
}

export default {
    async createAccount(req: Request, res: Response) {
        const { email, password, name, birthday } = req.body
        if (!(email && password && name && birthday)) return res.status(400).send({ error: 'Please, fill all missing camps!' })

        const regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!regexEmail.test(email)) return res.status(400).send({ error: 'Invalid email!' })

        const saltRounds = 15
        let hashedPass: string
        try {
            hashedPass = await bcrypt.hash(password, saltRounds)
        } catch (err) {
            return res.status(400).send({ error: 'Invalid password' })
        }
        let user = await User.query().findOne({email})
        if(user) return res.status(400).send({error:'Email already registered'})
        
        try {
            user = await User.query().insertAndFetch({
                name,
                email,
                password: hashedPass,
                birthday: new Date(birthday),
            })
        } catch (err) {
            return res.send(400).send({ error: 'Error upon inserting data!' })
        }
        user.password = ''
        const token = generateToken({id:user.id})
        res.cookie('Authorization', `Bearer ${token}`, { httpOnly: true, sameSite: true })
        return res.send({user})

    },
    async login() {

    },
}