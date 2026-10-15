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
        if (!user) return

        socket.emit('room:join', { roomId, userId: user?._id })
        return () => {
            socket.emit('room:leave', { roomId })
        }
    }, [socket, roomId, user])


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


    // Receive Message and update read status if window is focused
    useEffect(() => {
        if (!user) return

        const receiveMessage = (data: { chatMessage: Message }) => {
            queryClient.setQueryData<InfiniteData<ApiSuccess<{ messages: Message[] }>>>(['chats', roomId], (prev) => {
                if (!prev) return prev
                const messages = [...prev.pages[0].data.messages]
                messages.push(data.chatMessage)
                return { ...prev, pages: [{ ...prev.pages[0], data: { ...prev.pages[0].data, messages } }, ...prev.pages.slice(1)] }
            })
            if (!document.hasFocus()) return

            // If focused, then request read status update
            socket.emit('chat:last-read-at-update', { roomId, userId: user._id })
        }



        const updateReadStatus = () => {
            queryClient.invalidateQueries({ queryKey: ['chats', 'conversation-records', roomId], exact: true })
        }

        socket.on('chat:message-created', receiveMessage as (args: unknown) => void)
        socket.on('chat:last-read-at-updated', updateReadStatus as (args: unknown) => void)

        return () => {
            socket.off('chat:message-created', receiveMessage as (args: unknown) => void)
            socket.off('chat:last-read-at-updated', updateReadStatus as (args: unknown) => void)
        }
    }, [socket, roomId, queryClient, user])


    // On Focus in/out, update read status
    useEffect(() => {
        if (!user) return

        const handler = () => {
            socket.emit('chat:last-read-at-update', { roomId, userId: user?._id })
        }

        window.addEventListener('focus', handler)
        window.addEventListener('focusout', handler)

        return () => {
            window.removeEventListener('focus', handler)
            window.removeEventListener('focusout', handler)
        }
    }, [roomId, socket, user])



    return { composeMessage, text, setText }
}