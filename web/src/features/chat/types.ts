export type Message = {
    _id: string,
    author: {
        _id: string,
        username: string
    },
    text: string,
    createdAt: string
}

export type ConversationRecord = {
    member: string,
    lastReadAt: string
}

