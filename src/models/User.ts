import { Model } from 'objection'
import Address from './Address'

export default class User extends Model {
  id!: number
  name!: string
  birthday!: Date
  email!: string
  created_at!: Date
  updated_at!: Date
  password!: string
  addresses?: Address[]

  static tableName = 'user'


  static jsonSchema = {
    type: 'object',
    required: ['email', 'name', 'birthday', 'password'],
    properties: {
      id: { type: 'integer' },
      email: { type: 'string' },
      password: { type: 'string' },
      name: { type: 'string' },
      birthday: { type: 'date' },
      created_at:{type:'date'},
      updated_at:{type:'date'}
    }

  }

  static relationMappings = () => ({
    address: {
      relation: Model.HasManyRelation,
      modelClass: Address,
      join: {
        from: 'user.id',
        to: 'address.userId'
      }
    },
  })
}
