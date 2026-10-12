import ChatPage from '@/features/chat'
import { useAuth } from '@/hooks/useAuth'
import { Navigate, useParams } from 'react-router-dom'

const DM = () => {
    const { userId } = useParams() as { userId: string }
    const { user } = useAuth()
    if (!user) throw new Error("User not logged in")

    if (user._id === userId) return <Navigate to={"/"} />

    const roomId = [user._id, userId].sort().join('|')

    return (
        <div>
            <ChatPage roomId={roomId} />
        </div>
    )
}

export default DM
