import { Request, Response } from "express";
import Address from "../models/Address";
import Joi from 'joi'

export default {
    async createAddress(req: Request, res: Response) {
        const { userId, cep, city, state, addressName, addressNumber, complement }:
            {
                userId: number, cep: string, city: string, state: string,
                addressName: string, addressNumber: number, complement: string
            } = req.body

        const schema = Joi.object({
            userId: Joi.number().integer().required(),
            cep: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            addressName: Joi.string().required(),
            addressNumber: Joi.number().integer().required(),
            complement: Joi.string()
        })

        const validation = schema.validate({ userId, cep, city, state, addressName, addressNumber, complement })
        if (validation.error) return res.status(400).send({ error: 'Data is not valid!', errors: validation.error })

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
            {
                id: number, userId: number, cep: string, city: string, state: string,
                addressName: string, addressNumber: number, complement: string
            } = req.body

        const schema = Joi.object({
            id: Joi.number().integer().required(),
            userId: Joi.number().integer().required(),
            cep: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            addressName: Joi.string(),
            addressNumber: Joi.number().integer(),
            complement: Joi.string()
        })

        const validation = schema.validate({ id, userId, cep, city, state, addressName, addressNumber, complement })
        if (validation.error) return res.status(400).send({ error: 'Data is not valid!', errors: validation.error })

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
        const schema = Joi.object({
            id: Joi.number().integer().required(),
            userId: Joi.number().integer().required()
        })

        const validation = schema.validate({ id, userId })
        if (validation.error) return res.status(400).send({ error: 'Data is not valid!', errors: validation.error })

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
        const errors: Error[] = []

        const schema = Joi.object({
            id: Joi.number().integer(),
            cep: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            addressName: Joi.string(),
            addressNumber: Joi.number().integer(),
            complement: Joi.string()
        })

        Object.keys(req.query).forEach(key => {
            if (key in Address.jsonSchema.properties) {
                const validation = schema.validate({ [key]: req.query[key] })
                if (validation.error) errors.push(validation.error)

                fields.push('address.' + key)
                values.push(<string>req.query[key])
            }
        })

        if (errors.length > 0) return res.status(400).send({ error: 'Data is not valid!', errors })

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