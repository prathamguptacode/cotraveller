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
import tripRoutes from "@/routes/tripRoutes"
import oauthRoutes from '@/routes/oauthRoutes'

import initializeWebSocket from "./socket"
import { checkMulterUploadPath } from "./middlewares/multerUpload"

await connectToMongoDB()
await checkMulterUploadPath()

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
app.use('/api/trips', tripRoutes)
app.use('/api/oauth', oauthRoutes)



app.use(errorHandler)


server.listen(env.PORT, () => {
  console.log(`just cotraveller server listening on port ${env.PORT}`);
});
