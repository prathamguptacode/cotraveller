import { useAuth } from "@/hooks/useAuth"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { messagesInfiniteQueryOptions } from "./queries"

import styles from './chat.module.css'
import clsx from "clsx"
import { useChatRoom } from "./hooks/useChatRoom"




const ChatPage = ({ roomId }: { roomId: string }) => {
    const { user } = useAuth()
    const { composeMessage, text, setText } = useChatRoom(roomId)
    const { data: { messages } } = useSuspenseInfiniteQuery(messagesInfiniteQueryOptions(roomId))




    return (
        <div>
            <div> Room ID:{roomId} </div>
            <input value={text} onChange={(e) => setText(e.target.value)} type="text" />
            <button onClick={composeMessage}>SEND</button>


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
