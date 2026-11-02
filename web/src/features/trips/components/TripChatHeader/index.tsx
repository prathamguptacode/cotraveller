import { CalendarIcon } from '@phosphor-icons/react'
import mystyle from './styles.module.css'
import { Link } from 'react-router-dom'
import { getImgURL } from '@/lib/cloudinary'

type TripChatHeaderProps = {
    trip: {
        _id: string,
        name: string,
        avatar: {
            publicId: string,
            version: number
        }
    },
    members: { user: { username: string } }[]
}

const TripChatHeader = ({ trip, members }: TripChatHeaderProps) => {

    return (
        <div className={mystyle.topBar}>
            <div className={mystyle.imgWrapper}>
                <img src={getImgURL(trip.avatar, 200) || "/tripIcon.webp"} alt="trip photo" width="50px" height="50px" />
            </div>
            <div className={mystyle.tripInfo}>
                <div>{trip.name}</div>
                <div>
                    {
                        members.map((e, i) => {
                            return <span key={i}>{e.user.username} {i < members.length - 1 ? ", " : null}</span>
                        })
                    }
                </div>
            </div>
            <div className={mystyle.iconBox}>
                <Link to={`/${trip._id}/calendar`}>
                    <CalendarIcon size={28} />
                </Link>
            </div>
        </div>
    )
}

export default TripChatHeader
