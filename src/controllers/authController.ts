import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import User from "../models/User";
import jwt from 'jsonwebtoken'

function generateToken(params: {}) {
    const token = jwt.sign(params, <string>process.env.SECRET_JWT, {
        expiresIn: 86400,
    })
    return token
}

export default {
    async createAccount(req: Request, res: Response) {
        const { email, password, name, birthday }: { email: string, password: string, name: string, birthday: string } = req.body
        if (!(email && password && name && birthday)) return res.status(400).send({ error: 'Please, fill all missing camps!' })

        if (password.length < 8) return res.status(400).send({ error: 'Password must be at least 8 characters long!' })

        const regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!regexEmail.test(email)) return res.status(400).send({ error: 'Invalid email!' })

        const saltRounds = 15
        let hashedPass: string
        try {
            hashedPass = await bcrypt.hash(password, saltRounds)
        } catch (err) {
            return res.status(400).send({ error: 'Invalid password' })
        }
        let user: User
        try {
            user = await User.query().findOne({ email })
            if (user) return res.status(400).send({ error: 'Email already registered' })
            const parsedBirthday = new Date(birthday)
            user = await User.query().insertAndFetch({
                name,
                email,
                password: hashedPass,
                birthday: parsedBirthday,
            })
        } catch (err) {
            return res.status(400).send({ error: 'Error upon inserting data!', errorCode: err })
        }
        user.password = ''
        const token = generateToken({ id: user.id, email: user.email })
        res.cookie('token', `Bearer ${token}`, { httpOnly: true, sameSite: true })
        return res.send({ user })

    },
    async login(req: Request, res: Response) {
        const { email, password } = req.body
        if (!(email && password)) return res.status(400).send({ error: 'Please, fill all the missing camps!' })

        let user:User
        try{
            user = await User.query().findOne({ email })
            if (!user) return res.status(404).send({ error: 'User not registered!' })
            
            if (!(await bcrypt.compare(password, user.password))) {
                return res.status(400).send({ error: 'Invalid password!' })
            }
            user.password = ''
            const token = generateToken({ id: user.id, email: user.email })
            res.cookie('token', `Bearer ${token}`, { httpOnly: true, sameSite: true })
            return res.send({ id: user.id, name: user.name, birthday: user.birthday, email: user.email })
        }catch(err){
            return res.status(400).send({error:'Error while trying to login', errorCode:err})
        }

    },
}