import express from "express"
import env from "./config/env"
import http from 'http'
import cors from "cors"
import cookieParser from "cookie-parser"

import connectToMongoDB from "./config/mongoDB"
import errorHandler from "./middlewares/errorHandler"
import responseHandler from "./middlewares/responseHandler"

import helloRoutes from '@/routes/helloRoutes'
import authRoutes from '@/routes/authRoutes'
import chatRoutes from '@/routes/chatRoutes'
import userRoutes from '@/routes/userRoutes'
import devRoutes from '@/routes/devRoutes'

import initializeWebSocket from "./socket"

await connectToMongoDB()

const app = express()
const server = http.createServer(app)


// Initialize Web-Socket connection
initializeWebSocket(server)


app.use(express.json())
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}))
app.use(cookieParser())
app.use(responseHandler)



app.use('/api', helloRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/users', userRoutes)
if (env.NODE_ENV === 'development') app.use('/api/dev', devRoutes)



app.use(errorHandler)


server.listen(env.PORT, () => {
  console.log(`just cotraveller server listening on port ${env.PORT}`);
});
