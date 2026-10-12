import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { messagesInfiniteQueryOptions } from "../queries"
import { useEffect, useRef } from "react"


export const useInfinitePagination = (roomId: string) => {
    const { data: { messages }, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(messagesInfiniteQueryOptions(roomId))

    const containerRef = useRef<HTMLDivElement>(null)
    const isAdjustingScrollRef = useRef(false)

    useEffect(() => {
        const container = containerRef.current
        if (!container || !hasNextPage) return

        const scrollHandler = async () => {
            if (container.scrollTop < 1200 && !isFetchingNextPage && !isAdjustingScrollRef.current) {
                isAdjustingScrollRef.current = true
                await fetchNextPage()
                isAdjustingScrollRef.current = false
            }
        }

        container.addEventListener('scroll', scrollHandler)
        return () => {
            container.removeEventListener('scroll', scrollHandler)
        }

    }, [hasNextPage, fetchNextPage, isFetchingNextPage])

    return { messages, containerRef }
}