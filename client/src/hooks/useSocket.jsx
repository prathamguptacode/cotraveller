import { useContext } from "react"
import { createContext } from "react"

export const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

