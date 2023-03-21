
import express from 'express'
import path from 'path'
import cors from 'cors'
import { urlencoded, json } from 'body-parser'

// By default authMiddleware
import auth, { signIn } from './graphql/resolvers/auth.resolver'

export const app = express()

// Middlewares
app.use(cors())
app.use('/static', express.static(path.join(__dirname, '../public')))
app.use(urlencoded({ extended: false }))
app.use(auth)

// Auth Routes
app.post('/api/signIn', json(), signIn)

export default app;