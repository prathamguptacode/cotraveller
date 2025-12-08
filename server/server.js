import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
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
import Message from './models/Message.js'
import Group from './models/groupSchema.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        credentials: true,
        origin: env.CLIENT_URL
    }
})

io.on('connection', (socket) => {
    console.log(`Connected to socket: ${socket.id}, total clients = ${io.engine.clientsCount}`)

    socket.on('JOIN_ROOM', (data, cb) => {
        socket.join(data.roomId)
        console.log(`User ${data.userId}, has connected to room ${data.roomId} on socket ${socket.id}`)
        cb({ success: true, message: data.roomId, id: socket.id })
    })

    socket.on('SEND_MESSAGE_TO_SERVER', async (data, cb) => {
        const { roomId, text, userId } = data

        try {
            const baseMessage = await Message.create({ author: userId, text, roomId })
            const message = await baseMessage.populate({ path: 'author', select: 'fullName _id' })
            await Group.updateOne({ _id: roomId }, { $push: { messages: baseMessage._id } })

            cb({ success: true, message })
            socket.to(roomId).emit('RECEIVE_MESSAGE_ON_CLIENT', { message })
        } catch (error) {
            console.error(error)
            cb({ success: false, code: "DB_ERROR", message: 'Something went wrong' })
        }


    })

    socket.on('disconnect', () => {
        console.log(`Disconnected socket: ${socket.id}, total clients = ${io.engine.clientsCount}`)
    })
})



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
app.use('/api/comments', commentRoute)

app.use('/api/auth', authRoutes)
app.use('/api/oauth', oauthRoutes)
app.use('/api/validateField', fieldValidationRoutes)
app.use('/api/user', userRoutes)
app.use('/api/message', messageRoutes)



connectDB()

app.use(errorMiddleware)

server.listen(env.PORT || 8080, "0.0.0.0", () => {
    console.log("Listening on port", env.PORT || 8080)
})


