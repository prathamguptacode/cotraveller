import { useInfinitePagination } from "@/features/chat/hooks/useInfinitePagination"
import { useScrollAnchor } from "@/features/chat/hooks/useScrollAnchor"
import { useAuth } from "@/hooks/useAuth"

import styles from './styles.module.css'
import clsx from "clsx"
import { ChecksIcon } from "@phosphor-icons/react"


type ChatMessagesProps = {
    roomId: string
}

const ChatMessages = ({ roomId }: ChatMessagesProps) => {
    const { user } = useAuth()

    // Non-damped infinite reverse scrolling and pagination
    const { messages, containerRef, lastReadByEveryoneAt } = useInfinitePagination(roomId)

    // Scroll Anchor
    const { anchorRef } = useScrollAnchor(messages[messages.length - 1])




    return (
        <div ref={containerRef} className={styles.messages}>
            {messages.map((message, i) => {
                const nextMessage = messages[i + 1]
                const isSpecialChatBubble = !nextMessage || nextMessage.author._id !== message.author._id
                const isMyMessage = message.author._id == user?._id
                const shouldHideName = true
                return (
                    <div data-special-bubble={isSpecialChatBubble} key={message._id} className={clsx(styles.message, isMyMessage && styles.myMessage)}>
                        {(!isMyMessage && !shouldHideName) && <div className={styles.messageAuthor}>
                            {message.author.email}
                        </div>}
                        <div className={styles.messageDetails}>
                            <div className={styles.messageText}>
                                {message.text}
                            </div>
                            <div className={styles.messageTime}>
                                {new Date(message.createdAt).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </div>
                            <div className={styles.messageSeenState}>
                                <ChecksIcon size={16} className={clsx(lastReadByEveryoneAt >= new Date(message.createdAt).getTime() && styles.seen)} />
                            </div>
                        </div>
                    </div>
                )
            })}
            <div ref={anchorRef} aria-hidden></div>
        </div>
    )
}

export default ChatMessages
