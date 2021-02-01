import express, {Request, Response} from 'express'
import Knex from 'knex'
import {Model} from 'objection'
import bodyParser from 'body-parser'
const config = require('./knexfile.js') 
import 'dotenv/config'


const knex = Knex(config.development)
const app = express()

app.use(bodyParser.json())

app.get('/', (req: Request, res:Response)=>{
    res.send('Hello lojinha!')
})


app.listen(3001, ()=>{
    console.log('Server stated!')
})