import { Server } from "socket.io"
import http from 'http'
import env from "@/config/env"
import ChatMessage from "./models/ChatMessage"
import ConversationRecord from "./models/ConversationRecord"


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
        console.log(`New joining, total clients = ${io.engine.clientsCount}`)


        // Chat logic


        // Join Room
        socket.on('room:join', ({ roomId }) => {
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
            try {
                const baseChatMessage = await ChatMessage.create({ roomId, text, author: userId })
                const conversationRecord = await ConversationRecord.findOneAndUpdate({ member: userId, roomId },
                    { $set: { lastReadAt: new Date() } },
                    { upsert: true, setDefaultsOnInsert: true }
                )

                const chatMessage = await baseChatMessage.populate('author')

                // Send the new message to all room members
                socket.to(roomId).emit('chat:message-created', { chatMessage, conversationRecord })
                cb({ success: true, chatMessage })
            } catch (error) {
                console.error("Error creating message", error)
            }
        })

        // Mark message as read
        socket.on('chat:last-read-at-update', async ({ roomId, userId }) => {
            try {
                const conversationRecord = await ConversationRecord.findOneAndUpdate({ roomId, member: userId },
                    { $set: { lastReadAt: new Date() } },
                    { upsert: true, setDefaultsOnInsert: true, returnDocument: 'after' })

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