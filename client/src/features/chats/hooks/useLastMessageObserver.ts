import { useEffect, type Dispatch, type RefObject, type SetStateAction } from "react"
import type { Group } from "../types"

export const useLastMessageObserver = (group: Group, setIsAtBottom: Dispatch<SetStateAction<boolean>>, setUnreadCount: Dispatch<SetStateAction<number>>, lastMessageRef: RefObject<HTMLDivElement | null>) => {

    //Observer for LastMessage
    const observer = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) setIsAtBottom(false)
        else {
            setIsAtBottom(true)
            setUnreadCount(0)
        }
    }, { threshold: 0 })

    //Check if LastMessage exists and start observing the latest one
    useEffect(() => {
        const lastMessageDiv = lastMessageRef.current
        if (!lastMessageDiv) return
        observer.observe(lastMessageDiv)

        return () => {
            observer.unobserve(lastMessageDiv)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group.messages])

}