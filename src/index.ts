import express, {Express, Request, Response} from 'express'
import { config } from 'dotenv'
import { createAccount } from './controllers/userController'
import { router } from './routes/api'

config()

const app : Express = express()

const PORT: any = process.env.PORT || 3000

app.use(express.json())

app.use('', router)
/* app.get('/', (req, res)=>{
    db.select().from('users')
    .then((rows:any) => {
        res.send(rows)
    })
}) */

app.listen(PORT, ()=>{
    console.log(`Server listening on ${PORT} and running on http://localhost:${PORT}`)
})