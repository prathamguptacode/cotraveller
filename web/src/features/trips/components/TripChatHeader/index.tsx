import { CalendarIcon, ChatTeardropIcon } from '@phosphor-icons/react'
import mystyle from './styles.module.css'
import { Link } from 'react-router-dom'

type TripChatHeaderProps = {
    trip: {
        _id: string,
        name: string
    }
}

const TripChatHeader = ({ trip }: TripChatHeaderProps) => {
    return (
        <div className={mystyle.topBar}>
            <div className={mystyle.imgWrapper}>
                <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/8f/b2/89/photo0jpg.jpg?w=1200&h=1200&s=1" alt="trip photo" width="50px" height="50px" />
            </div>
            <div className={mystyle.tripInfo}>
                <div>{trip.name}</div>
            </div>
            <div className={mystyle.iconBox}>
                <Link to={`/trips/${trip._id}/calendar`}>
                    <CalendarIcon size={28} />
                </Link>
                <Link to={`/trips/${trip._id}/chats`}>
                    <ChatTeardropIcon size={28} />
                </Link>
            </div>
        </div>
    )
}

export default TripChatHeader
