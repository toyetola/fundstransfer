import express, {Express, Request, Response} from 'express'
import { config } from 'dotenv'
import { router } from './src/routes/api'

config()

const app : Express = express()

// Middlewares...
// Routes...
process.env.MODE = "test"
app.use(express.json())
app.use('/', router);

// module.exports = app

export { app }
