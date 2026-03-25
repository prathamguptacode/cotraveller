import { api } from "@/api/axios"
import { infiniteQueryOptions } from "@tanstack/react-query"
import type { Message } from "./types"

export const messagesKeys = {
    infinite: (groupId: string) => ['groups', groupId, 'chats', 'infinite']
}

export const messagesInfiniteQueryOptions = (groupId: string) => infiniteQueryOptions({
    queryKey: messagesKeys.infinite(groupId),
    queryFn: ({ pageParam }) => api.get<{ messages: Message[], pagination: { hasNextPage: boolean, nextCursor: string } }>(`/message/${groupId}?cursor=${pageParam}&limit=${50}`),
    initialPageParam: 'default',
    getNextPageParam: (lastPageData) => lastPageData.data.pagination.hasNextPage ? lastPageData.data.pagination.nextCursor : undefined,
    select: (res) => {
        return { messages: [...res.pages].reverse().flatMap(page => page.data.messages), pagination: res.pages[res.pages.length - 1].data.pagination }
    },
    staleTime: Infinity,
})