import express, {Request, Response} from 'express'
import Knex from 'knex'
import {Model} from 'objection'
import bodyParser from 'body-parser'
import config from '../knexfile'
import routes from './routes'

import 'dotenv/config'

console.log(process.env.user)
const knex = Knex(config.development)
const app = express()
app.use(bodyParser.json())
app.use(routes)

app.get('/', (req: Request, res:Response)=>{
    res.send('Hello lojinha!')
})


app.listen(3001, ()=>{
    console.log('Server stated!')
})