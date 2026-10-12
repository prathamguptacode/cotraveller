import { useAuth } from "@/hooks/useAuth"
import { useSocket } from "@/hooks/useSocket"
import { useEffect, useState } from "react"
import type { Message } from "./types"
import { useQueryClient, useSuspenseInfiniteQuery, type InfiniteData } from "@tanstack/react-query"
import type { ApiSuccess } from "@/types/api.types"
import { messagesInfiniteQueryOptions } from "./queries"

import styles from './chat.module.css'
import clsx from "clsx"




const ChatPage = ({ roomId }: { roomId: string }) => {
    const socket = useSocket()
    const { user } = useAuth()
    const queryClient = useQueryClient()
    if (!user) throw new Error("User not found")

    const [text, setText] = useState('')


    const { data: { messages }, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(messagesInfiniteQueryOptions(roomId))


    // Join and Leave Room
    useEffect(() => {
        socket.emit('room:join', { roomId })

        return () => {
            socket.emit('room:leave', { roomId })
        }
    }, [socket, roomId])


    // Create and send Message
    const createMessage = () => {
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




    return (
        <div>
            <div> Room ID:{roomId} </div>
            <input value={text} onChange={(e) => setText(e.target.value)} type="text" />
            <button onClick={createMessage}>SEND</button>


            <div className={styles.messages}>
                <div aria-hidden></div>
                {messages.map((message) => {
                    const isMyMessage = message.author._id == user?._id

                    return (
                        <div key={message._id} className={clsx(styles.message, isMyMessage && styles.myMessage)}>
                            {message.text}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ChatPage
