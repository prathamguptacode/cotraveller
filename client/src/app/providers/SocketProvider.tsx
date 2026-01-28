import { useEffect, type ReactNode } from 'react'
import { SocketContext } from '@/hooks/useSocket'
import { io } from "socket.io-client"
import { useState } from 'react'

const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState(io())

    useEffect(() => {
        return () => {
            socket.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
