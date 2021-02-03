import { Request, Response } from "express";
import Address from "../models/Address";

export default {
    async createAddress(req: Request, res: Response) {
        const { userId, cep, addressName, addressNumber, complement }:
            { userId: number, cep: string, addressName: string, addressNumber: number, complement: string } = req.body

        if (!(userId && cep && addressName && addressName && addressNumber))
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
            })
        } catch (err) {
            console.log(err)
            return res.status(500).send({ error: 'Error while inserting address!', errorCode: err })
        }
        return res.send({ user: address })

    },
    async updateAddress(req: Request, res: Response) {
        const { id, userId, cep, addressName, addressNumber, complement }:
            { id: number, userId: number, cep: string, addressName: string, addressNumber: number, complement: string } = req.body

        if (!(userId && id)) return res.status(400).send({ error: 'Please, provide the address and user ids!!' })

        if (userId !== req.id) return res.status(403).send({ error: 'Unauthorized!' })

        Address.query().patchAndFetchById(id, {
            userId,
            cep,
            addressName,
            addressNumber,
            complement
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
            }else return res.status(403).send({error:'Unauthorized!'})
        } catch (err) {
            return res.status(400).send({ error: 'Error while deleting address!', errorCode: err })
        }
    },
    async searchAddressInfo(req: Request, res: Response) {

    },
    async getUserAddress(req: Request, res: Response) {

    }
}