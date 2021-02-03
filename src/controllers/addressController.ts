import { Request, Response } from "express";
import Address from "../models/Address";

export default {
    async createAddress(req: Request, res: Response) {
        const { userId, cep, city, state, addressName, addressNumber, complement }:
            {
                userId: number, cep: string, city: string, state: string,
                addressName: string, addressNumber: number, complement: string
            } = req.body

        if (!(userId && cep && addressName && addressName && addressNumber && city && state))
            return res.status(400).send({ error: 'Please fill all the missing camps!' })

        if (userId !== req.id) return res.status(403).send({ error: 'Unauthorized!' })

        let address: Address
        try {
            address = await Address.query().insertAndFetch({
                userId,
                cep,
                addressName,
                addressNumber,
                complement,
                city,
                state
            })
        } catch (err) {
            console.log(err)
            return res.status(500).send({ error: 'Error while inserting address!', errorCode: err })
        }
        return res.send({ user: address })

    },
    async updateAddress(req: Request, res: Response) {
        const { id, userId, cep, city, state, addressName, addressNumber, complement }:
            { id: number, userId: number, cep: string, city: string, state: string,
                 addressName: string, addressNumber: number, complement: string } = req.body

        if (!(userId && id)) return res.status(400).send({ error: 'Please, provide the address and user ids!!' })

        if (userId !== req.id) return res.status(403).send({ error: 'Unauthorized!' })

        Address.query().patchAndFetchById(id, {
            userId,
            cep,
            addressName,
            addressNumber,
            complement,
            city,
            state
        }).then(address => {
            return res.send({ address })
        }).catch(err => {
            return res.status(500).send({ error: 'Error while updating address!', errorCode: err })
        })

    },
    async deleteAddress(req: Request, res: Response) {
        const { id, userId }: { id: number, userId: number } = req.body
        if (!(userId && id)) return res.status(400).send({ error: 'Please, provide the address and user ids!!' })
        if (userId !== req.id) return res.status(403).send({ error: 'Unauthorized!' })

        try {

            const address = await Address.query().findById(id)
            if (address.userId === userId) {
                const rows = await Address.query().deleteById(id)
                if (rows > 0)
                    return res.send()
                return res.status(400).send({ error: 'No address found!' })
            } else return res.status(403).send({ error: 'Unauthorized!' })
        } catch (err) {
            return res.status(400).send({ error: 'Error while deleting address!', errorCode: err })
        }
    },
    async searchAddressInfo(req: Request, res: Response) {
        const fields: string[] = []
        const values: string[] = []
        Object.keys(req.query).forEach(key => {
            if (key in Address.jsonSchema.properties) {
                fields.push('address.' + key)
                values.push(<string>req.query[key])
            }
        })
        try {
            const addresses = await Address.query()
                .whereComposite(fields, '=', values)
                .withGraphFetched('user')
                .modifyGraph('user', user => user.select('id', 'name', 'email', 'birthday'))
                .select('address.*')
            return res.send({ addresses })

        } catch (err) {
            return res.status(400).send({ error: 'Error while getting data', errorCode: err })
        }
    },
    async getUserAddress(req: Request, res: Response) {
        const { id } = req.params
        const idNumber = Number(id)
        if (isNaN(idNumber)) return res.status(401).send({ error: 'Id is not a number!' })

        Address.query()
            .where('id', '=', idNumber).
            withGraphFetched('user')
            .modifyGraph('user', user => user.select('id', 'name', 'email', 'birthday'))
            .select('address.*').then(address => {
                return res.send({ address })
            }).catch(err => {
                return res.status(400).send({ error: 'Error while getting address', errorCode: err })
            })
    }
}