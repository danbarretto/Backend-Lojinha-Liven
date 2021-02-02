import { Request, Response } from "express";
import { QueryBuilder } from "knex";
import { type } from "os";
import { stringify } from "querystring";
import Address from "../models/Address";
import User from "../models/User";



export default {
    async getUserInfo(req: Request, res: Response) {
        const { id } = req.params
        const idNumber = Number(id)
        if (isNaN(idNumber) || !req.id || req.id !== idNumber) return res.status(401).send({ error: 'Unauthorized!' })

        const promises: [Promise<User>, Promise<any>] = [
            User.query().findById(idNumber).select('user.name', 'user.email', 'user.id', 'user.birthday'),
            Address.query()
                .select('address.id', 'address.cep', 'address.addressName', 'address.addressNumber', 'address.complement')
                .where('userId', '=', idNumber)
        ]

        const results = await Promise.all(promises)

        const [user, address] = results

        return res.send({ user, address })

    },
    async searchUserInfo(req: Request, res: Response) {
        const fields: string[] = []
        const values: string[] = []
        const userIds: string[] = []
        let searchById = false
        Object.keys(req.query).forEach(key => {
            if (key in User.jsonSchema.properties) {
                fields.push(key)
                values.push(<string>req.query[key])

                if (key === 'id') {
                    userIds.push(<string>req.query.id)
                    searchById = true
                }
            }
        })
        try {
            //Search by Id is separated to optmize search in database
            if (searchById) {
                let promises: [Promise<User[]>, Promise<Address[]>] = [
                    User.query()
                        .select('name', 'email', 'birthday')
                        .whereComposite(fields, '=', values),
                    Address.query()
                        .select('addressName', 'addressNumber', 'complement', 'cep', 'userId')
                        .where('userId', '=', userIds)
                ]
                const [users, address] = await Promise.all(promises)
                return res.send({ users, address })
            } else {
                const users = await User.query()
                    .select('id', 'name', 'email', 'birthday')
                    .whereComposite(fields, '=', values)

                const promises: Promise<Address[]>[] = users.map(user => Address.query()
                    .select('addressName', 'addressNumber', 'complement', 'cep', 'userId')
                    .where('userId', '=', user.id))
                    
                const address = await Promise.all(promises)
                return res.send({ users, address })
            }
        } catch (err) {
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