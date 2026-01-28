import type { RefObject } from "react"

const scrollToBottom = (containerRef: RefObject<HTMLElement | null>) => {
    const div = containerRef.current
    if (!div) return
    div.scrollTop = div.scrollHeight
}

export default scrollToBottom