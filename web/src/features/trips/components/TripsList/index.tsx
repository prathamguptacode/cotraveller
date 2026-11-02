import { Link, NavLink } from 'react-router-dom'
import styles from './styles.module.css'
import leon from '@/assets/leon.jpeg'
import clsx from 'clsx'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useSocket } from '@/hooks/useSocket'

type Trip = {
    _id: string,
    name: string,
    lastMessage?: {
        text: string,
        author: string,
        createdAt: string
    },
    createdAt: string,
    lastReadAt: string
}


const TripsList = () => {
    const { data: trips } = useQuery({
        queryKey: ['users', 'me', 'trips'],
        queryFn: () => api.get<{ trips: Trip[] }>('/users/me/trips'),
        select: (res) => res.data.trips
    })

    const { user } = useAuth()
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        const updateList = () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'me', 'trips'], exact: true })
        }

        socket.on('trips-list:update', updateList)

        return () => {
            socket.off('trips-list:update', updateList)
        }
    }, [socket, queryClient])

    if (!user) return (
        <section className={styles.wrapper}>
            <header className={styles.listHeader}>
                <h2 className={styles.listHeading}>
                    Trips
                </h2>
            </header>
            {/* ###make design better */}
            <div className={styles.sidebarSignin}>
                <div>Log in to see and plan your trips</div>
                <Link to={"/login"} className={styles.loginBtn}>Log in</Link>
            </div>
        </section>
    )


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
    const isUnread = trip.lastMessage && new Date(trip.lastMessage.createdAt).getTime() >= new Date(trip.lastReadAt).getTime()

    return (
        <NavLink to={`/${trip._id}`} className={({ isActive }) => {
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
                    {trip.lastMessage ?
                        <span className={styles.description}>
                            {trip.lastMessage.text}
                        </span> :
                        <span data-type='placeholder' className={styles.description}>
                            .
                        </span>
                    }
                </div>
                <div className={styles.extraItemContent}>


                    <span>
                        {trip.lastMessage ?
                            getFormattedTimeString(trip.lastMessage.createdAt) :
                            getFormattedTimeString(trip.createdAt)
                        }
                    </span>

                    {isUnread && <span className={styles.unreadIndicator}></span>}

                </div>
            </div>
        </NavLink>
    )
}


const getFormattedTimeString = (dateString: string) => {
    const date = new Date(dateString)
    const isToday = new Date().toLocaleDateString() === date.toLocaleDateString()
    const formatted = isToday ?
        date.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: true }) :
        date.toLocaleDateString('default', { dateStyle: 'short' })

    return formatted
}