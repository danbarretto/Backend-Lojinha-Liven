import { QueryBuilder } from 'knex'
import { Model } from 'objection'
import User from './User'

export default class Address extends Model {
    id!: number
    userId!: number
    cep!: string
    city!:string
    state!:string
    addressName!: string
    addressNumber!: number
    complement!: string

    static tableName = 'address'

    static jsonSchema = {
        type: 'object',
        required: ['userId', 'cep', 'addressName', 'addressNumber','city','state'],
        properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            cep: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            addressName: { type: 'string' },
            addressNumber: { type: 'integer' },
            complement: { type: 'string' }
        }
    }

    static relationMappings = () => ({
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'address.userId',
                to: 'user.id'
            }
        }
    })
}
