import { api } from "@/api/axios";
import type { Message } from "./types";

export const fetchMessages = (groupId: string, cursor: string) => {
    console.log("Cursor:", cursor)
    return api.get<{ messages: Message[], pagination: { hasNextPage: boolean, nextCursor: string } }>(`/message/${groupId}?cursor=${cursor}&limit=${30}`)
}