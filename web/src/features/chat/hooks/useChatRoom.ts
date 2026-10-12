import { useSocket } from "@/hooks/useSocket"
import { useEffect, useState } from "react"
import type { Message } from "../types"
import { useQueryClient, type InfiniteData } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"
import type { ApiSuccess } from "@/types/api.types"

export const useChatRoom = (roomId: string) => {

    const socket = useSocket()
    const queryClient = useQueryClient()
    const { user } = useAuth()

    const [text, setText] = useState('')


    // Join and Leave Room
    useEffect(() => {
        socket.emit('room:join', { roomId })
        return () => {
            socket.emit('room:leave', { roomId })
        }
    }, [socket, roomId])


    // Create and send Message
    const composeMessage = () => {
        if (!user) return

        socket.emit('chat:message-create', { roomId, text, userId: user._id }, (res: { success: boolean, chatMessage: Message }) => {
            if (!res.success) return console.error("something went wrong!")

            queryClient.setQueryData<InfiniteData<ApiSuccess<{ messages: Message[] }>>>(['chats', roomId], (prev) => {
                if (!prev) return prev
                const messages = [...prev.pages[0].data.messages]
                messages.push(res.chatMessage)
                return { ...prev, pages: [{ ...prev.pages[0], data: { ...prev.pages[0].data, messages } }, ...prev.pages.slice(1)] }
            })
        })
        setText('')
    }


    // Receive Message
    useEffect(() => {
        const receiveMessage = (data: { chatMessage: Message }) => {
            queryClient.setQueryData<InfiniteData<ApiSuccess<{ messages: Message[] }>>>(['chats', roomId], (prev) => {
                if (!prev) return prev
                const messages = [...prev.pages[0].data.messages]
                messages.push(data.chatMessage)
                return { ...prev, pages: [{ ...prev.pages[0], data: { ...prev.pages[0].data, messages } }, ...prev.pages.slice(1)] }
            })
            if (!document.hasFocus()) return
        }

        socket.on('chat:message-created', receiveMessage as (args: unknown) => void)

        return () => {
            socket.off('chat:message-created', receiveMessage as (args: unknown) => void)
        }
    }, [socket, roomId, queryClient])


    return { composeMessage, text, setText }
}