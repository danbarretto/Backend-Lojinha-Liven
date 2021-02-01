import { Model } from 'objection'
import Address from './Address'

export default class User extends Model {
  id!: number
  name!: string
  birthday!: Date
  email!: string
  created_at!: Date
  updated_at!: Date

  addresses?:Address[]

  static tableName = 'user'

  static relationMappings = () => ({
    addresses: {
      relation: Model.HasManyRelation,
      modelClass: Address,
      join: {
        from: 'user.id',
        to: 'address.userId'
      }
    },
  })
}
