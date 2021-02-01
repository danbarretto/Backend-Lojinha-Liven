import express, {Request, Response} from 'express'

const app = express()

app.get('/', (req: Request, res:Response)=>{
    res.send('Hello lojinha!')
})


app.listen(3001, ()=>{
    console.log('Server stated!')
})