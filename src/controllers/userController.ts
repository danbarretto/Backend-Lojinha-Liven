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
            User.query().findById(idNumber).select('user.name','user.email','user.id','user.birthday'),
            Address.query()
                .select('address.id', 'address.cep', 'address.addressName', 'address.addressNumber', 'address.complement')
                .where('userId', '=', idNumber)
        ]

        
        const results = await Promise.all(promises)
        
        const [user, address] = results
        
        return res.send({user, address})

    },
    async updateInfo(req: Request, res: Response) {

    },
    async deleteAccount(req: Request, res: Response) {

    }

}