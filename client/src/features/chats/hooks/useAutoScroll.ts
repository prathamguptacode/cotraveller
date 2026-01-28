import { useEffect, type RefObject } from "react"
import scrollToBottom from "../utils/scrollToBottom"
import type { Message } from "../types"

export const useAutoScroll = (containerRef: RefObject<HTMLElement | null>, messages: Message[]) => {
    useEffect(() => {
        const div = containerRef.current
        if (messages.length == 0 || !div) return

        scrollToBottom(containerRef)
        div.style.scrollBehavior = 'smooth'
        //We add smoothScroll class for further auto-scroll after first hardscroll
    }, [messages])

}

