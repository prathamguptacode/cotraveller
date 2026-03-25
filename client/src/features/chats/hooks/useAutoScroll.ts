import { useEffect } from "react"
import type { Dispatch, RefObject, SetStateAction } from 'react'
import type { Message } from "../types"
import { useAuth } from "@/hooks/useAuth"

export const useAutoScroll = (lastMessage: Message | undefined, isAtBottom: boolean, lastMessageRef: RefObject<HTMLDivElement | null>, setUnreadCount: Dispatch<SetStateAction<number>>) => {

    const { user } = useAuth()


    useEffect(() => {
        const div = lastMessageRef.current
        if (!lastMessage || !div) return
        if (lastMessage.author._id != user?._id && !isAtBottom) {
            setUnreadCount(count => count + 1)
        }
        else div.scrollIntoView({ behavior: 'smooth' })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastMessage?._id])

}

