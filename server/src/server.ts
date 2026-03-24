import eventListeners from '@/events/eventHandlers'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import responseHandler from './middlewares/responseHandler'
import errorMiddleware from './middlewares/errorHandler'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb'
import env from './config/env'
import hello from './routes/helloRoutes'
import groupRoutes from './routes/groupRoutes'
import authRoutes from './routes/authRoutes'
import oauthRoutes from './routes/oauthRoutes'
import userRoutes from './routes/userRoutes'
import messageRoutes from './routes/messageRoutes'
import Message from './models/Message'
import Group from './models/Group'
import feedabckRoutes from './routes/feedbackRoutes'
import eventRoutes from './routes/eventRoutes'
import ConversationRecord from './models/ConversationRecord'

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
        // console.log(`User ${data.userId}, has connected to room ${data.roomId} on socket ${socket.id}`)
        cb({ success: true, message: data.roomId, id: socket.id })
    })

    socket.on('SEND_MESSAGE_TO_SERVER', async (data, cb) => {
        const { roomId, text, userId } = data

        try {
            const baseMessage = await Message.create({ author: userId, text, roomId })
            const message = await baseMessage.populate({ path: 'author', select: 'fullName _id' })
            const group = await Group.findOneAndUpdate({ _id: roomId }, { $push: { messages: baseMessage._id } }, { returnDocument: 'after' })
            if (!group) return

            const conversationRecord = await ConversationRecord.findOneAndUpdate({ roomId: group._id, memberId: userId }, { $set: { lastReadAt: new Date(Date.now()) } }, { returnDocument: 'after' })
            if (!conversationRecord) return

            cb({ success: true, message })
            socket.to(roomId).emit('RECEIVE_MESSAGE_ON_CLIENT', { message, conversationRecord })
            group.member.forEach(member => {
                socket.to(`user_room_${member._id}`).emit('UPDATE_MESSAGE_ON_CLIENT', { message })
            })


        } catch (error) {
            console.error(error)
            cb({ success: false, code: "DB_ERROR", message: 'Something went wrong' })
        }


    })

    socket.on('MESSAGE_READ_TO_SERVER', async (data: { roomId: string, userId: string, readAt: number }) => {
        const { roomId, userId, readAt } = data
        const conversationRecord = await ConversationRecord.findOneAndUpdate({ roomId, memberId: userId }, { $set: { lastReadAt: new Date(readAt) } }, { returnDocument: 'after' })
        socket.to(roomId).emit('MESSAGE_READ_TO_CLIENT', { conversationRecord })
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
app.use(eventListeners)

//Routes
app.use('/api', hello)
app.use('/api/groups', groupRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/oauth', oauthRoutes)
app.use('/api/user', userRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/feedback', feedabckRoutes)
app.use('/api/events', eventRoutes)


connectDB()

app.use(errorMiddleware)

server.listen(env.PORT || 8080, "0.0.0.0", () => {
    console.log("Listening on port", env.PORT || 8080)
});
