import { useQuery } from '@tanstack/react-query'
import MonthCalendarGrid from './components/MonthCalendarGrid'
import styles from './styles.module.css'
import { api } from '@/lib/axios'
import { useParams } from 'react-router-dom'

type Event = {
    startTime: string,
    name: string
}
type Trip = {
    itineraryItems: Event[]
}



const Calendar = () => {
    const { tripId } = useParams() as { tripId: string }

    const { data, error, isPending } = useQuery({
        queryKey: ["trips", tripId],
        queryFn: () => api.get<{ trip: Trip }>(`/trips/${tripId}`),
        select: (res) => res.data.trip
    })

    if (error) return <div>Something went wrong</div>
    if (isPending) return <div>Loading</div>

    const events = data.itineraryItems

    return (
        <div data-mobile-visible={true} className={styles.wrapper}>
            <MonthCalendarGrid events={events} />
        </div>
    )
}

export default Calendar
