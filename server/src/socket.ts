import { Server } from "socket.io"
import http from 'http'
import env from "@/config/env"
import ChatMessage from "./models/ChatMessage"
import ConversationRecord from "./models/ConversationRecord"
import ChatRoom from "./models/ChatRoom"


type ChatMessageEvent = {
    roomId: string,
    userId: string,
    text: string
}

type ChatStatusEvent = {
    roomId: string,
    userId: string
}


type ClientToServerEvents = {
    'room:join': ({ roomId, userId }: { roomId: string, userId: string }) => void,
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


    io.on('connection', (socket) => {
        console.log(`New socket connection, ${socket.id} total clients = ${io.engine.clientsCount}`)


        // Chat logic


        // Join Room
        socket.on('room:join', async ({ roomId, userId }) => {
            if (!await ConversationRecord.exists({ room: roomId, member: userId })) return
            socket.join(roomId)
            console.log(socket.id, 'has joined,', roomId)
        })

        // Leave Room
        socket.on('room:leave', ({ roomId }) => {
            socket.leave(roomId)
            console.log(socket.id, 'has left,', roomId)
        })


        // Create Message
        socket.on('chat:message-create', async ({ roomId, userId, text }, cb) => {
            const trimmedText = text.replace(/^\s+|\s+$/g, '')
            try {
                const baseChatMessage = await ChatMessage.create({ room: roomId, text: trimmedText, author: userId })

                const conversationRecordPromise = ConversationRecord.updateOne(
                    { member: userId, room: roomId },
                    { $set: { lastReadAt: new Date() } }
                )
                const chatMessagePromise = baseChatMessage.populate('author')
                const chatRoomPromise = ChatRoom.updateOne({ _id: roomId }, { $set: { lastMessage: baseChatMessage._id } })

                const [conversationRecord, chatMessage] = await Promise.all([
                    conversationRecordPromise,
                    chatMessagePromise,
                    chatRoomPromise
                ])

                // Send the new message to all room members
                socket.to(roomId).emit('chat:message-created', { conversationRecord, chatMessage })
                cb({ success: true, chatMessage })
            } catch (error) {
                console.error("Error creating message", error)
            }
        })

        // Mark message as read
        socket.on('chat:last-read-at-update', async ({ roomId, userId }) => {
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