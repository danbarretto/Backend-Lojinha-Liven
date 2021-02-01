import {Model} from 'objection'
import User from './User'

export default class Address extends Model{
    id!:number
    userId!:number
    cep!:string
    addressName!:string
    addressNumber!:number
    complement!:string

    static tableName = 'address'

    static relationMappings = ()=>({
        userOwner:{
            relation:Model.BelongsToOneRelation,
            modelClass:User,
            join:{
                from:'address.userId',
                to:'user.id'
            }
        }
    })
}
