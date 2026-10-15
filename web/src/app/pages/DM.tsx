import ChatPage from '@/features/chat'
import { useParams } from 'react-router-dom'

const DM = () => {
    const { roomId } = useParams() as { roomId: string }

    return (
        <div>
            <ChatPage roomId={roomId} />
        </div>
    )
}

export default DM
