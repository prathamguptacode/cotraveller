import { useAuth } from "@/hooks/useAuth"

import styles from './chat.module.css'
import clsx from "clsx"
import { useScrollAnchor } from "./hooks/useScrollAnchor"
import { useInfinitePagination } from "./hooks/useInfinitePagination"
import MessageComposer from "./components/MessageComposer"




const ChatPage = ({ roomId }: { roomId: string }) => {
    const { user } = useAuth()

    // Non-damped infinite reverse scrolling and pagination
    const { messages, containerRef } = useInfinitePagination(roomId)

    // Scroll Anchor
    const { anchorRef } = useScrollAnchor({ messages })




    return (
        <div>
            <div> Room ID:{roomId} </div>
            <MessageComposer key={roomId} roomId={roomId} />

            <div ref={containerRef} className={styles.messages}>
                {messages.map((message) => {
                    const isMyMessage = message.author._id == user?._id

                    return (
                        <div key={message._id} className={clsx(styles.message, isMyMessage && styles.myMessage)}>
                            {message.text}
                        </div>
                    )
                })}
                <div ref={anchorRef} aria-hidden></div>
            </div>
        </div>
    )
}

export default ChatPage
