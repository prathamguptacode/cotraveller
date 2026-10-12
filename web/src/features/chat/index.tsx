import MessageComposer from "./components/MessageComposer"
import ChatMessages from "./components/ChatMessages"




const ChatPage = ({ roomId }: { roomId: string }) => {


    return (
        <div>
            <div> Room ID:{roomId} </div>
            <MessageComposer roomId={roomId} />
            <ChatMessages roomId={roomId} />
        </div>
    )
}

export default ChatPage
