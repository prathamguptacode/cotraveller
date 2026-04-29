export type Group = {
    _id: string,
    title: string,
    messages: Message[],
    member: { _id: string, fullName: string }[],
    owner: string,
    unreadMessagesCount: number,
    avatar: {
        publicId: string,
        version: number
    }
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

export type ConversationRecord = {
    memberId: string,
    roomId: string,
    lastReadAt: string
}

