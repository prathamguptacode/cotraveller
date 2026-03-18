import { useAuth } from '@/hooks/useAuth'
import { EventSourceContext } from '@/hooks/useEventSource'
import { useEffect, useState, type ReactNode } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'

const EventSourceProvider = ({ children }: { children: ReactNode }) => {

    const { accessToken } = useAuth()
    const [eventSource] = useState<EventSourcePolyfill>(() => {
        const es = new EventSourcePolyfill('/api/events', {
            headers: {
                'authorization': `Bearer ${accessToken}`
            },

        })
        return es
    })

    useEffect(() => {
        eventSource.addEventListener('open', () => console.log('Connected to SSE'))
        return () => eventSource.close()
    }, [])

    return (
        <EventSourceContext.Provider value={eventSource}>
            {children}
        </EventSourceContext.Provider>
    )
}

export default EventSourceProvider
