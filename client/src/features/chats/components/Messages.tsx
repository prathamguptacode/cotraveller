import styles from '../chats.module.css'
import clsx from 'clsx'
import { getFormattedTime } from '@/utils/getFormattedTime'
import type { Message } from '../types'
import type { RefObject } from 'react'
import LoadingPage from '@/app/pages/Extras/LoadingPage'
import type { AuthContextUser } from '@/types/auth.types'

type MessagesProps = {
    ref: RefObject<HTMLDivElement | null>,
    loading: boolean,
    messages: Message[],
    lastMessageRef: RefObject<HTMLDivElement | null>,
    user: AuthContextUser | null

}

const Messages = ({ ref, loading, messages, lastMessageRef, user }: MessagesProps) => {
    return (
        <div ref={ref} className={styles.messages}>
            {loading ?
                <LoadingPage bgColor={'var(--secondary-bg-darker)'} />
                : messages.length != 0
                &&
                messages.map((message, i, arr) => {
                    const isMyMessage = message.author._id == user?._id
                    const timeDiff = i > 0 ? new Date(arr[i - 1].createdAt).getTime() - new Date(message.createdAt).getTime() : 0
                    const hideName = i > 0 ? (arr[i - 1].author._id == message.author._id && Math.abs(timeDiff) < 60 * 1000) : false

                    return (
                        <div ref={i === arr.length - 1 ? lastMessageRef : null} key={message._id} className={clsx(styles.message, isMyMessage && styles.myMessage)}>
                            {(!isMyMessage && !hideName) && <div className={styles.messageAuthor}>
                                {message.author.fullName}
                            </div>}
                            <div className={styles.messageDetails}>
                                <div className={styles.messageText}>
                                    {message.text}
                                </div>
                                <div className={styles.messageTime}>
                                    {getFormattedTime(message.createdAt)}
                                </div>

                            </div>
                        </div>
                    )
                })}
        </div>
    )
}

export default Messages
