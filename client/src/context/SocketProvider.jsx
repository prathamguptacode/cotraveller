import { useEffect } from 'react'
import { SocketContext } from '../hooks/useSocket'
import { io } from "socket.io-client"
import { useState } from 'react'

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(io.connect())

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
