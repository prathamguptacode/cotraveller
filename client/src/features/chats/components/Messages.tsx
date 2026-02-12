import styles from '../chats.module.css'
import clsx from 'clsx'
import { getFormattedTime } from '@/utils/getFormattedTime'
import type { Message } from '../types'
import { useEffect, type RefObject } from 'react'
import { CheckCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type MessagesProps = {
    messages: Message[],
    lastMessageRef: RefObject<HTMLDivElement | null>,
}

const Messages = ({ messages, lastMessageRef }: MessagesProps) => {
    const { user } = useAuth()

    useEffect(() => {
        const div = lastMessageRef.current
        if (div) div.scrollIntoView({ behavior: 'instant' })
    }, [])


    return (
        <div className={styles.messages}>
            {messages.map((message, i, arr) => {
                const isMyMessage = message.author._id == user?._id
                const timeDiff = i > 0 ? new Date(arr[i - 1].createdAt).getTime() - new Date(message.createdAt).getTime() : 0
                const shouldHideName = i > 0 ? (arr[i - 1].author._id == message.author._id && Math.abs(timeDiff) < 60 * 1000) : false
                return (
                    <div ref={i === arr.length - 1 ? lastMessageRef : null} key={message._id} className={clsx(styles.message, isMyMessage && styles.myMessage)}>
                        {(!isMyMessage && !shouldHideName) && <div className={styles.messageAuthor}>
                            {message.author.fullName}
                        </div>}
                        <div className={styles.messageDetails}>
                            <div className={styles.messageText}>
                                {message.text}
                            </div>
                            <div className={styles.messageTime}>
                                {getFormattedTime(message.createdAt)}
                            </div>
                            <div className={styles.messageSeenState}>
                                <CheckCheck size={16} className={clsx(styles.seen)} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Messages
