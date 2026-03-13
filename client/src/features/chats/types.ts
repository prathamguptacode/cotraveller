export type Group = {
    _id: string,
    title: string,
    messages: Message[],
    members: { _id: string, fullName: string }[],
    owner: string
}

export type Message = {
    _id: string,
    author: {
        _id: string,
        fullName: string
    },
    text: string,
    createdAt: string
}

export type ConversationMember = {
    userId: string,
    roomId: string,
    lastReadAt: number
}
