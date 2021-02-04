import { Request, Response } from "express";
import User from "../models/User";
import Joi from 'joi'


export default {
    async getUserInfo(req: Request, res: Response) {
        const { id } = req.params
        const idNumber = Number(id)

        if (isNaN(idNumber)) return res.status(400).send({ error: 'Id is not a number!' })

        if (!req.id || req.id !== idNumber) return res.status(401).send({ error: 'Unauthorized!' })

        User.query()
            .where('id', '=', idNumber).
            withGraphFetched('address')
            .select('user.id', 'user.name', 'user.email', 'user.birthday').then(user => {
                return res.send({ user })
            }).catch(err => {
                return res.status(400).send({ error: 'Error while getting data', errorCode: err })
            })

    },
    async searchUserInfo(req: Request, res: Response) {
        const fields: string[] = []
        const values: string[] = []
        const errors: Error[] = []

        const schema = Joi.object({
            id: Joi.number().integer(),
            name: Joi.string(),
            email: Joi.string().email(),
            birthday: Joi.date()
        })

        Object.keys(req.query).forEach(key => {
            if (key in User.jsonSchema.properties) {
                const validation = schema.validate({ [key]: req.query[key] })
                if (validation.error) errors.push(validation.error)

                fields.push('user.' + key)
                values.push(<string>req.query[key])
            }
        })
        if (errors.length > 0) return res.status(400).send({ error: 'Data is not valid!', errors })

        try {
            const users = await User.query()
                .whereComposite(fields, '=', values)
                .withGraphFetched('address')
                .select('user.id', 'user.name', 'user.email', 'user.birthday')
            return res.send({ users })

        } catch (err) {
            return res.status(400).send({ error: 'Error while getting data', errorCode: err })
        }
    },

    async updateInfo(req: Request, res: Response) {
        const { id, email, name, birthday }: { id: number, email: string, name: string, birthday: Date } = req.body
        if (req.id !== id) return res.status(401).send({ error: 'Unauthorized' })

        const schema = Joi.object({
            id: Joi.number().integer().required(),
            email: Joi.string().required(),
            name: Joi.string().required(),
            birthday: Joi.date().required()
        })
        const validation = schema.validate({ id, email, name, birthday })
        if (validation.error) return res.status(400).send({ error: 'Data is not valid!', errorCode: validation.error })

        try {
            const user = await User.query().findById(id)
            if (email !== user.email && (await User.query().findOne({ email }))) {
                return res.status(400).send({ error: 'Email already registered' })
            }
            await user.$query().patch({
                name,
                email,
                birthday: new Date(birthday),
                updated_at: new Date()
            })
            return res.send({ id, name: user.name, email: user.email, birthday: user.birthday })
        } catch (err) {
            return res.status(400).send({ error: 'Error while updating user!', errorCode: err })
        }
    },
    async deleteAccount(req: Request, res: Response) {
        const { id }: { id: number } = req.body
        const validation = Joi.number().validate(id)
        if (validation.error) return res.status(400).send({ error: 'Id is not a number!', errors: validation.error })

        if (req.id !== id) return res.status(401).send({ error: 'Unauthorized' })
        try {
            const deletedAccount = await User.query().deleteById(id)
            if (deletedAccount === 0) return res.status(400).send({ error: 'No account found' })

            return res.send()
        } catch (err) {
            return res.status(400).send({ error: 'Error while updating user!', errCode: err })
        }
    }

}