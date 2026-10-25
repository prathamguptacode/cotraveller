import { Server } from "socket.io"
import http from 'http'
import env from "@/config/env"
import ChatMessage from "./models/ChatMessage"
import ConversationRecord from "./models/ConversationRecord"
import ChatRoom from "./models/ChatRoom"
import { jwtVerify } from "jose"
import { AuthTokenPayload } from "./types/types"
import { generateUint8Array } from "./utils/generateJWTs"
import TripMember from "./models/TripMember"


type ChatMessageEvent = {
    roomId: string,
    text: string
}

type ChatStatusEvent = {
    roomId: string
}


type ClientToServerEvents = {
    'room:join': ({ roomId }: { roomId: string }) => void,
    'room:leave': ({ roomId }: { roomId: string }) => void,


    'chat:message-create': (args: ChatMessageEvent, cb: any) => void,

    'chat:last-read-at-update': (args: ChatStatusEvent) => void,

    // 'chat:typing-start': () => void,
    // 'chat:typing-end': () => void
}

type ServerToClientEvents = {
    // 'room:user-joined': ({ roomId, userId }: { roomId: string, userId: string }) => void,
    // 'room:user-left': ({ roomId, userId }: { roomId: string, userId: string }) => void,


    'chat:message-created': (args: any) => void,

    'chat:last-read-at-updated': (args: any) => void,

    'trips-list:update': () => void,

    'dms-list:update': () => void,

    // 'chat:typing-started': () => void,
    // 'chat:typing-ended': () => void
}


const initializeWebSocket = (server: http.Server) => {
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
        cors: {
            origin: env.CLIENT_URL,
            credentials: true
        }
    })


    io.use(async (socket, next) => {
        const accessToken = socket.handshake.auth.token as unknown
        if (!accessToken || typeof accessToken !== 'string') return next(new Error("Access token was missing"))


        try {
            const { payload: { userId, exp } } = await jwtVerify<AuthTokenPayload>(accessToken, generateUint8Array(env.ACCESS_TOKEN_SECRET))
            if (!exp) return next(new Error("Invalid / expired access token"))
            socket.session = { userId, expiry: exp * 1000 }
            next()

        } catch (error) {
            return next(new Error("Invalid / expired access token"))
        }

    })


    io.on('connection', (socket) => {
        console.log(`New socket connection, ${socket.id} total clients = ${io.engine.clientsCount}`)

        socket.use(([], next) => {
            if (new Date().getTime() >= socket.session.expiry) return next(new Error("Session Expired"))
            next()
        })


        // Chat logic

        // Join Room
        socket.on('room:join', async ({ roomId }) => {
            if (roomId.startsWith('user')) return socket.join(`user-${socket.session.userId}`)


            try {
                if (!await ConversationRecord.exists({ room: roomId, member: socket.session.userId })) return
                socket.join(roomId)
                console.log(socket.id, 'has joined,', roomId)
            } catch (error) {
                console.error(error)
            }

        })

        // Leave Room
        socket.on('room:leave', ({ roomId }) => {
            socket.leave(roomId)
            console.log(socket.id, 'has left,', roomId)
        })


        // Create Message
        socket.on('chat:message-create', async ({ roomId, text }, cb) => {
            const trimmedText = text.replace(/^\s+|\s+$/g, '')
            const { userId } = socket.session
            try {
                const baseChatMessage = await ChatMessage.create({ room: roomId, text: trimmedText, author: userId })

                const conversationRecordPromise = ConversationRecord.updateOne(
                    { member: userId, room: roomId },
                    { $set: { lastReadAt: new Date() } }
                )
                const chatMessagePromise = baseChatMessage.populate('author')
                const chatRoomPromise = ChatRoom.findOneAndUpdate(
                    { _id: roomId },
                    { $set: { lastMessage: baseChatMessage._id } },
                    { returnDocument: 'after' }
                )

                const [conversationRecord, chatMessage, chatRoom] = await Promise.all([
                    conversationRecordPromise,
                    chatMessagePromise,
                    chatRoomPromise
                ])

                // Send the new message to all room members
                socket.to(roomId).emit('chat:message-created', { conversationRecord, chatMessage })
                cb({ success: true, chatMessage })

                // Handles List updation
                if (!chatRoom) return
                if (chatRoom.type === 'TRIP') {
                    const members = await TripMember.find().select('_id')
                    members.forEach(member => {
                        io.to(`user-${member._id}`).emit('trips-list:update')
                    })
                    return
                }
                chatRoom.dm?.participants.forEach(participant => {
                    io.to(`user-${participant._id}`).emit('dms-list:update')
                })
            } catch (error) {
                console.error("Error creating message", error)
            }
        })

        // Mark message as read
        socket.on('chat:last-read-at-update', async ({ roomId }) => {
            const { userId } = socket.session
            try {
                const conversationRecord = await ConversationRecord.findOneAndUpdate({ room: roomId, member: userId },
                    { $set: { lastReadAt: new Date() } },
                    { returnDocument: 'after' }
                )
                // Send the updated status to all room members
                socket.to(roomId).emit('chat:last-read-at-updated', { conversationRecord })
            } catch (error) {
                console.error("Error updating last read at status", error)
            }
        })





        // Extras
        socket.on('disconnect', () => {
            console.log(`Disconnected socket with socketId: ${socket.id}`)
            console.log(`Total remaining connections = ${io.engine.clientsCount}`)
        })
    })
}

export default initializeWebSocket