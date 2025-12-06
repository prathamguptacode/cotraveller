import express from 'express'
import http from 'http'
import cors from 'cors'
import responseHandler from './utils/responseHandler.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import env from './config/env.js'
import hello from './routes/hello.js'
import groupRoutes from './routes/groupRoutes.js'
import authRoutes from './routes/authRoutes.js'
import oauthRoutes from './routes/oauthRoutes.js'
import fieldValidationRoutes from './routes/fieldValidationRoutes.js'
import userRoutes from './routes/userRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import commentRoute from './routes/commentRoute.js'

const app = express()
const server = http.createServer(app)
app.use(cookieParser())
app.use(express.json())
app.use(responseHandler)
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
}))

//Routes
app.use('/api', hello)
app.use('/api/group', groupRoutes)
app.use('/api/comments',commentRoute)

app.use('/api/auth', authRoutes)
app.use('/api/oauth', oauthRoutes)
app.use('/api/validateField', fieldValidationRoutes)
app.use('/api/user', userRoutes)
app.use('/api/message',messageRoutes)



connectDB()

app.use(errorMiddleware)

server.listen(env.PORT || 3000, "0.0.0.0", () => {
    console.log("Listening on port", env.PORT || 3000)
})


