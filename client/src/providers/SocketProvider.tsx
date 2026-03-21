import { useEffect, type ReactNode } from 'react'
import { SocketContext } from '@/hooks/useSocket'
import { io } from "socket.io-client"
import { useState } from 'react'

const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket] = useState(io())

    useEffect(() => {
        return () => {
            socket.disconnect()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
