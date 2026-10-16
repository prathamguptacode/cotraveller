import ChatMessages from './ChatMessages'
import MessageComposer from './MessageComposer'

type ChatBoxProps = {
    roomId: string
}

const ChatBox = ({ roomId }: ChatBoxProps) => {

    return (
        <div>
            <ChatMessages roomId={roomId} />
            <MessageComposer roomId={roomId} />
        </div>
    )
}

export default ChatBox
