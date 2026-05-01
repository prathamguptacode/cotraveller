import type { EventSourcePolyfill } from "event-source-polyfill";
import { createContext, useContext } from "react";

type EventSourceContextType = EventSourcePolyfill

export const EventSourceContext = createContext<EventSourceContextType | null>(null)

export const useEventSource = () => {
    const ctx = useContext(EventSourceContext)
    if (!ctx) throw new Error('Tried accessing eventContext outside provider')
    return ctx
}