import { useContext } from "react"
import { createContext } from "react"
import type { Socket } from "socket.io-client"


type ChatMessageEvent = {
    roomId: string,
    text: string
}

type ChatStatusEvent = {
    roomId: string
}


export type ClientToServerEvents = {
    'room:join': ({ roomId }: { roomId: string }) => void,
    'room:leave': ({ roomId }: { roomId: string }) => void,


    'chat:message-create': (args: ChatMessageEvent, cb: unknown) => void,

    'chat:last-read-at-update': (args: ChatStatusEvent) => void,

    // 'chat:typing-start': () => void,
    // 'chat:typing-end': () => void
}

export type ServerToClientEvents = {
    // 'room:user-joined': ({ roomId, userId }: { roomId: string, userId: string }) => void,
    // 'room:user-left': ({ roomId, userId }: { roomId: string, userId: string }) => void,


    'chat:message-created': (args: unknown) => void,

    'chat:last-read-at-updated': (args: unknown) => void,

    // 'chat:typing-started': () => void,
    // 'chat:typing-ended': () => void
}


export const SocketContext = createContext<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)

export const useSocket = () => {
    const ctx = useContext(SocketContext)
    if (!ctx) throw new Error("Tried to access context outside Provider")
    return ctx
}

