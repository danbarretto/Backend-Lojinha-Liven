import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import User from "../models/User";
import jwt from 'jsonwebtoken'
import Joi from "joi";

function generateToken(params: {}) {
    const token = jwt.sign(params, <string>process.env.SECRET_JWT, {
        expiresIn: 86400,
    })
    return token
}

export default {
    async createAccount(req: Request, res: Response) {
        const { email, password, name, birthday }:
            { email: string, password: string, name: string, birthday: string } = req.body

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            name: Joi.string().required(),
            birthday: Joi.date()
        })
        const validation = schema.validate({ email, password, name, birthday })
        if (validation.error) {
            validation.error._original.password = null
            return res.status(400).send({ error: 'Data is not valid!', errors: validation.error })
        }


        const saltRounds = <string>process.env.HASH_SALT_ROUNDS
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
        const schema = Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().required()
        })
        const validation = schema.validate({ email, password })
        if (validation.error) {
            validation.error._original.password = null
            return res.status(400).send({ error: 'Data is not valid!', errors: validation.error })
        }
        
        let user: User
        try {
            user = await User.query().findOne({ email })
            if (!user) return res.status(404).send({ error: 'User not registered!' })

            if (!(await bcrypt.compare(password, user.password))) {
                return res.status(400).send({ error: 'Invalid password!' })
            }
            user.password = ''
            const token = generateToken({ id: user.id, email: user.email })
            res.cookie('token', `Bearer ${token}`, { httpOnly: true, sameSite: true })
            return res.send({ id: user.id, name: user.name, birthday: user.birthday, email: user.email })
        } catch (err) {
            return res.status(400).send({ error: 'Error while trying to login', errorCode: err })
        }

    },
}