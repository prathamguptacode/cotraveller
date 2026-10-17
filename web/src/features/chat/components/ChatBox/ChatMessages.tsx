import { useInfinitePagination } from "@/features/chat/hooks/useInfinitePagination"
import { useScrollAnchor } from "@/features/chat/hooks/useScrollAnchor"
import { useAuth } from "@/hooks/useAuth"

import styles from './styles.module.css'
import clsx from "clsx"


type ChatMessagesProps = {
    roomId: string
}

const ChatMessages = ({ roomId }: ChatMessagesProps) => {
    const { user } = useAuth()

    // Non-damped infinite reverse scrolling and pagination
    const { messages, containerRef, conversationRecords } = useInfinitePagination(roomId)

    // Scroll Anchor
    const { anchorRef } = useScrollAnchor(messages[messages.length - 1])


    return (
        <div ref={containerRef} className={styles.messages}>
            {messages.map((message) => {
                const isMyMessage = message.author._id == user?._id
                return (
                    <div key={message._id} className={clsx(styles.message, isMyMessage && styles.myMessage)}>
                        {message.text}
                        {message.author._id === user?._id && <div>Read: {conversationRecords.map(record => {
                            if (record.member === user?._id) return
                            return (
                                <div>
                                    <div>Member: {record.member}</div>
                                    <div>Seen? : {new Date(record.lastReadAt).getTime() >= new Date(message.createdAt).getTime() ? 'Yes' : 'No'}</div>
                                </div>
                            )
                        })}</div>}
                    </div>
                )
            })}
            <div ref={anchorRef} aria-hidden></div>
        </div>
    )
}

export default ChatMessages
