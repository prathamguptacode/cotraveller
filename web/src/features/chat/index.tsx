import MessageComposer from "./components/MessageComposer"
import ChatMessages from "./components/ChatMessages"




const ChatPage = ({ roomId }: { roomId: string }) => {


    return (
        <div>
            <div> Room ID:{roomId} </div>
            <MessageComposer key={roomId} roomId={roomId} />
            <ChatMessages key={roomId} roomId={roomId} />
        </div>
    )
}

export default ChatPage
