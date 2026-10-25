import { useEffect, type ReactNode } from 'react'
import { SocketContext, type ClientToServerEvents, type ServerToClientEvents } from '@/hooks/useSocket'
import { io, Socket } from "socket.io-client"
import { useState } from 'react'
import { getToken } from '@/utils/getToken'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/axios'
import type { AuthContextUser } from '@/types/auth.types'




const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(() => {
        return io(import.meta.env.VITE_API_BASE_URL, {
            auth: {
                token: getToken().accessToken
            }
        })
    })

    const { user, updateAccessToken, updateUser } = useAuth()


    useEffect(() => {
        if (!user) return

        const socketConnection = io(import.meta.env.VITE_API_BASE_URL, {
            auth: {
                token: getToken().accessToken
            }
        })
        setSocket(socketConnection)

        // Request a new accessToken and reconnect/update Socket
        const refreshSocketSessionInterval = setInterval(() => {
            let newSocketConnection: Socket<ServerToClientEvents, ClientToServerEvents> | null = null
            api.post<{ accessToken: string, user: Exclude<AuthContextUser, null> }>('/auth/refresh', {}, {
                headers: {
                    'X-Requested-With': true
                }
            }).then((response) => {
                const { accessToken, user } = response.data
                updateAccessToken(accessToken)
                updateUser(user)
                newSocketConnection = io(import.meta.env.VITE_API_BASE_URL, {
                    auth: {
                        token: getToken().accessToken
                    },
                    autoConnect: false
                })

            }).catch(() => {
                updateAccessToken('')
                updateUser(null)


            }).finally(() => {
                // Disconnect old socket
                socket?.disconnect()

                // connect new socket 
                newSocketConnection?.connect()

                // Assign new socket
                setSocket(newSocketConnection)
            })


        }, 12 * 60 * 1000);


        return () => {
            clearInterval(refreshSocketSessionInterval)
            socket?.disconnect()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        if (!user || !socket) return

        socket.emit('room:join', { roomId: `user-${user._id}` })

        return () => {
            socket.emit('room:leave', { roomId: `user-${user._id}` })
        }
    }, [socket, user])



    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
