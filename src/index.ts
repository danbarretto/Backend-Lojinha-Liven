import express, {Request, Response} from 'express'
import Knex from 'knex'
import {Model} from 'objection'
import bodyParser from 'body-parser'
import config from '../knexfile'
import routes from './routes'
import cookieParser from 'cookie-parser'

import 'dotenv/config'

const app = express()

const knex = Knex(config.development)
Model.knex(knex)
app.use(bodyParser.json())
app.use(cookieParser())
app.use(routes)



app.get('/', (req: Request, res:Response)=>{
    res.send('Hello lojinha!')
})


app.listen(3001, ()=>{
    console.log('Server stated!')
})