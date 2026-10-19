import ChatMessages from './ChatMessages'
import MessageComposer from './MessageComposer'
import styles from './styles.module.css'

type ChatBoxProps = {
    roomId: string
}

const ChatBox = ({ roomId }: ChatBoxProps) => {

    return (
        <div className={styles.wrapper}>
            <ChatMessages roomId={roomId} />
            <MessageComposer roomId={roomId} />
        </div>
    )
}

export default ChatBox
