import { NavLink } from 'react-router-dom'
import styles from './styles.module.css'
import leon from '@/assets/leon.jpeg'
import clsx from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

type Trip = {
    _id: string,
    name: string,
    lastMessage?: {
        text: string,
        author: string,
        createdAt: string
    }
}


const TripsList = () => {
    const { data: trips } = useQuery({
        queryKey: ['users', 'me', 'trips'],
        queryFn: () => api.get<{ trips: Trip[] }>('/users/me/trips'),
        select: (res) => res.data.trips
    })


    return (
        <section className={styles.wrapper}>
            <header className={styles.listHeader}>
                <h2 className={styles.listHeading}>
                    Trips
                </h2>
            </header>
            <div className={styles.list}>
                {trips?.map(trip => {
                    return (
                        <ListItem key={trip._id} trip={trip} />
                    )
                })}
            </div>
        </section>
    )
}

export default TripsList

type ListItem = {
    trip: Trip
}

const ListItem = ({ trip }: ListItem) => {

    return (
        <NavLink to={`/trips/${trip._id}`} className={({ isActive }) => {
            return clsx(styles.listItem, isActive && styles.activeItem)
        }}>
            <div className={styles.imageWrapper}>
                <img src={leon} alt="display-picture" />
            </div>
            <div className={styles.itemContentWrapper}>
                <div className={styles.itemContent}>
                    <span className={styles.title}>
                        {trip.name}
                    </span>
                    {trip.lastMessage &&
                        <span className={styles.description}>
                            {trip.lastMessage.text}
                        </span>}
                </div>
                <div className={styles.extraItemContent}>
                    {trip.lastMessage &&
                        <span>
                            {new Date(trip.lastMessage.createdAt).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>}
                </div>
            </div>
        </NavLink>
    )
}
