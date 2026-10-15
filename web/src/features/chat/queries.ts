import { api } from "@/lib/axios"
import { infiniteQueryOptions } from "@tanstack/react-query"
import type { Message } from "./types"

const LIMIT = 50

export const messagesInfiniteQueryOptions = (roomId: string) => infiniteQueryOptions({
    queryKey: ['chats', roomId],
    queryFn: ({ pageParam }) => api.get<{ messages: Message[], pagination: { hasNextPage: boolean, nextCursor: string } }>(`/chats?roomId=${roomId}&cursor=${pageParam}&limit=${LIMIT}`),
    initialPageParam: 'default',
    getNextPageParam: (lastPageData) => lastPageData.data.pagination.hasNextPage ? lastPageData.data.pagination.nextCursor : undefined,
    select: (res) => {
        return { messages: [...res.pages].reverse().flatMap(page => page.data.messages), pagination: res.pages[res.pages.length - 1].data.pagination }
    },
    staleTime: Infinity,
})