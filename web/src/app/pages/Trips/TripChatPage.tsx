import { Navigate, useParams } from 'react-router-dom'
import styles from './Trips.module.css'
import ChatBox from '@/features/chat/components/ChatBox'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import TripChatHeader from '@/features/trips/components/TripChatHeader'

type Payload = {
    trip: {
        _id: string,
        name: string
    },
    chatRoom: {
        _id: string
    }
}

const TripChatPage = () => {
    const { tripId } = useParams() as { tripId: string }

    const { data, isError, isPending } = useQuery({
        queryKey: ['trips', tripId, 'chats'],
        queryFn: () => api.get<Payload>(`/trips/${tripId}/chats`),
        select: (res) => res.data
    })
    if (isPending) return
    if (isError) return <Navigate to={'/'} />

    const { trip, chatRoom } = data

    return (
        <div data-mobile-nav-visible={false} data-mobile-visible={true} className={styles.chatBoxWrapper}>
            <TripChatHeader trip={trip} />
            <ChatBox roomId={chatRoom._id} />
        </div>
    )
}

export default TripChatPage
