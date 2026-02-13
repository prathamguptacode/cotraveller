import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import responseHandler from './middlewares/responseHandler'
import errorMiddleware from './middlewares/errorHandler'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb'
import env from './config/env'
import hello from './routes/hello'
import groupRoutes from './routes/groupRoutes'
import authRoutes from './routes/authRoutes'
import oauthRoutes from './routes/oauthRoutes'
import fieldValidationRoutes from './routes/fieldValidationRoutes'
import userRoutes from './routes/userRoutes'
import messageRoutes from './routes/messageRoutes'
import Message from './models/Message'
import Group from './models/groupSchema'
import feedabck from './routes/feedbackRoute'

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
            const group = await Group.findOneAndUpdate({ _id: roomId }, { $push: { messages: baseMessage._id } }, { returnDocument: 'after' })
            if (!group) return


            cb({ success: true, message })
            socket.to(roomId).emit('RECEIVE_MESSAGE_ON_CLIENT', { message })
            // group.member.forEach(member => {
            //     socket.to(`user_room_${member._id}`).emit('RECEIVE_MESSAGE_ON_CLIENT', { message })
            // })


        } catch (error) {
            console.error(error)
            cb({ success: false, code: "DB_ERROR", message: 'Something went wrong' })
        }


    })

    socket.on('MESSAGE_READ_TO_SERVER', async (data: { roomId: string, userId: string, readAt: number }) => {
        const { roomId, userId, readAt } = data
        socket.to(roomId).emit('MESSAGE_READ_TO_CLIENT', { lastReadAt: readAt, userId, roomId })
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
app.use('/api/groups', groupRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/oauth', oauthRoutes)
app.use('/api/validateField', fieldValidationRoutes)
app.use('/api/user', userRoutes)
app.use('/api/message', messageRoutes)

app.use('/api/feedback', feedabck)



connectDB()

app.use(errorMiddleware)

server.listen(env.PORT || 8080, "0.0.0.0", () => {
    console.log("Listening on port", env.PORT || 8080)
})


