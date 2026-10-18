import { useEffect, type ReactNode } from 'react'
import { SocketContext, type ClientToServerEvents, type ServerToClientEvents } from '@/hooks/useSocket'
import { io, Socket } from "socket.io-client"
import { useState } from 'react'
import { getToken } from '@/utils/getToken'




const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(() => {
        return io(import.meta.env.VITE_API_BASE_URL, {
            auth: {
                token: getToken().accessToken
            }
        })
    })

    useEffect(() => {
        socket.on('connect_error', (error) => {
            console.error(error)
        })
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
