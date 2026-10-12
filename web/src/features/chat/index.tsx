import { useAuth } from "@/hooks/useAuth"

import styles from './chat.module.css'
import clsx from "clsx"
import { useChatRoom } from "./hooks/useChatRoom"
import { useScrollAnchor } from "./hooks/useScrollAnchor"
import { useInfinitePagination } from "./hooks/useInfinitePagination"




const ChatPage = ({ roomId }: { roomId: string }) => {
    const { user } = useAuth()
    const { composeMessage, text, setText } = useChatRoom(roomId)


    // Non-damped infinite reverse scrolling and pagination
    const { messages, containerRef } = useInfinitePagination(roomId)

    // Scroll Anchor
    const { anchorRef } = useScrollAnchor({ messages })




    return (
        <div>
            <div> Room ID:{roomId} </div>
            <input value={text} onChange={(e) => setText(e.target.value)} type="text" />
            <button onClick={composeMessage}>SEND</button>


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
