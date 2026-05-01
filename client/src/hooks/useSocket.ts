import { useContext } from "react"
import { createContext } from "react"
import type { Socket } from "socket.io-client"


export const SocketContext = createContext<Socket | null>(null)

export const useSocket = () => {
    const ctx = useContext(SocketContext)
    if (!ctx) throw new Error("Tried to access context outside Provider")
    return ctx
}

