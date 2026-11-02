import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query"
import { messagesInfiniteQueryOptions } from "../queries"
import { useEffect, useMemo, useRef } from "react"
import { api } from "@/lib/axios"
import type { ConversationRecord } from "../types"
import { useAuth } from "@/hooks/useAuth"


export const useInfinitePagination = (roomId: string) => {
    const { user } = useAuth()
    const { data: { messages }, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(messagesInfiniteQueryOptions(roomId))

    const { data: conversationRecords } = useSuspenseQuery({
        queryKey: ['chats', 'conversation-records', roomId],
        queryFn: () => api.get<{ conversationRecords: ConversationRecord[] }>(`/chats/conversation-records?roomId=${roomId}`),
        select: (res) => res.data.conversationRecords
    })

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


    const lastReadByEveryoneAt = useMemo(() => {
        let temp = Infinity
        conversationRecords.forEach(record => {
            const readAt = new Date(record.lastReadAt).getTime()
            if (record.member != user?._id) temp = Math.min(readAt, temp)
        })
        return temp
    }, [conversationRecords, user])

    return { messages, containerRef, lastReadByEveryoneAt }
}