import { Request, Response } from "express";
import Address from "../models/Address";
import User from "../models/User";

interface UserAddresses {
    user: User,
    addresses: Address[]
}

export default {
    async getUserInfo(req: Request, res: Response) {
        const { id } = req.params
        const idNumber = Number(id)
        if (isNaN(idNumber) || !req.id || req.id !== idNumber) return res.status(401).send({ error: 'Unauthorized!' })

        const user = await User.query()
            .where('id', '=', idNumber).
            withGraphFetched('address')
            .select('user.id', 'user.name', 'user.email', 'user.birthday')

        return res.send({ user })

    },
    async searchUserInfo(req: Request, res: Response) {
        const fields: string[] = []
        const values: string[] = []
        Object.keys(req.query).forEach(key => {
            if (key in User.jsonSchema.properties) {
                fields.push('user.' + key)
                values.push(<string>req.query[key])

            }
        })
        try {
            const users = await User.query()
                .whereComposite(fields, '=', values).
                withGraphFetched('address')
                .select('user.id', 'user.name', 'user.email', 'user.birthday')
            return res.send({ users })

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Error while getting data' })
        }
    },

    async updateInfo(req: Request, res: Response) {
        const { id, email, name, birthday }: { id: number, email: string, name: string, birthday: Date } = req.body
        if (req.id !== id) return res.status(401).send({ error: 'Unauthorized' })
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
            return res.status(400).send({ error: 'Error while updating user!' })
        }
    },
    async deleteAccount(req: Request, res: Response) {
        const { id }: { id: number } = req.body
        if (req.id !== id) return res.status(401).send({ error: 'Unauthorized' })
        try {
            const deletedAccount = await User.query().deleteById(id)
            if (deletedAccount === 0) return res.status(400).send({ error: 'No account found' })

            return res.send()
        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Error while updating user!' })
        }
    }

}