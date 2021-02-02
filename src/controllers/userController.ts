import { Request, Response } from "express";
import { QueryBuilder } from "objection";
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
        const queryParams = req.query
        Object.values(queryParams).map(console.log)
        return res.send()
    },

    async updateInfo(req: Request, res: Response) {
        const { id, email, name, birthday }: { id: number, email: string, name: string, birthday: Date } = req.body
        if(req.id !== id) return res.status(401).send({error:'Unauthorized'})
        try {
            const user = await User.query().findById(id)
            if(email !== user.email && (await User.query().findOne({email})) ){
                return res.status(400).send({error:'Email already registered'})
            }
            await user.$query().patch({
                name,
                email,
                birthday:new Date(birthday),
                updated_at: new Date()
            })
            return res.send({id, name: user.name, email: user.email, birthday: user.birthday })
        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Error while updating user!' })
        }
    },
    async deleteAccount(req: Request, res: Response) {
        
    }

}