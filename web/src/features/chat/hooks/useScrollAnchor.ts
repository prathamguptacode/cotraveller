import { useEffect, useRef, useState } from "react"
import type { Message } from "../types"
import { useAuth } from "@/hooks/useAuth"

export const useScrollAnchor = ({ messages }: { messages: Message[] }) => {
    const anchorRef = useRef<HTMLDivElement>(null)
    const [isAnchored, setIsAnchored] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        // Initial anchoring
        const anchor = anchorRef.current
        if (!anchor) return
        anchor.scrollIntoView({ behavior: 'instant' })

        const observer = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) setIsAnchored(false)
            else setIsAnchored(true)
        })


        observer.observe(anchor)
        console.log('Observing anchor')

        return () => observer.disconnect()
    }, [])


    useEffect(() => {
        const anchor = anchorRef.current
        const lastMessage = messages[messages.length - 1]
        if (!anchor || !lastMessage) return


        // Don't anchor only iff its not my message && not anchored already
        if (lastMessage.author._id !== user?._id && !isAnchored) return
        else {
            anchor.scrollIntoView({ behavior: 'smooth' })
            // Observer takes care of isAnchored state
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages])



    return { anchorRef }
}