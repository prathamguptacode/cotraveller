import { useEffect, useRef, type Dispatch, type RefObject, type SetStateAction } from "react"
import type { Group } from "../types"
import { useQueryClient } from "@tanstack/react-query"

export const useLastMessageObserver = (group: Group, setIsAtBottom: Dispatch<SetStateAction<boolean>>, setUnreadCount: Dispatch<SetStateAction<number>>, lastMessageRef: RefObject<HTMLDivElement | null>) => {

    const queryClient = useQueryClient()
    const observerRef = useRef<IntersectionObserver>(null)



    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) setIsAtBottom(false)
            else {
                setIsAtBottom(true)
                setUnreadCount(0)
            }
        }, { threshold: 0 })
        observerRef.current = observer

        return () => {
            observer.disconnect()
        }
    }, [queryClient, setIsAtBottom, setUnreadCount])

    //Observer for LastMessage


    //Check if LastMessage exists and start observing the latest one
    useEffect(() => {
        const lastMessageDiv = lastMessageRef.current
        const observer = observerRef.current
        if (!lastMessageDiv || !observer) return
        observer.observe(lastMessageDiv)

        return () => {
            observer.unobserve(lastMessageDiv)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group.messages])

}
