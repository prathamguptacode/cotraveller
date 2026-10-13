import MessageComposer from "./components/MessageComposer"
import ChatMessages from "./components/ChatMessages"




const ChatPage = ({ roomId }: { roomId: string }) => {


    return (
        <div>
            <div> Room ID:{roomId} </div>
            <ChatMessages roomId={roomId} />
            <MessageComposer roomId={roomId} />
        </div>
    )
}

export default ChatPage
