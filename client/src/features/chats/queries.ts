import { infiniteQueryOptions } from "@tanstack/react-query"
import { fetchMessages } from "./api"

export const messagesKeys = {
    infinite: (groupId: string) => ['groups', groupId, 'chats', 'infinite']
}

export const messagesInfiniteQueryOptions = (groupId: string) => infiniteQueryOptions({
    queryKey: messagesKeys.infinite(groupId),
    queryFn: ({ pageParam }) => fetchMessages(groupId, pageParam),
    initialPageParam: 'default',
    getNextPageParam: (lastPageData) => lastPageData.data.pagination.nextCursor,
    select: (res) => res.pages.flatMap(page => page.data.messages),
    staleTime: Infinity
})