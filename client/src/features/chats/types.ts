export type Group = {
    _id: string,
    title: string,
    messages: Message[],
    members: { _id: string, fullName: string }[]
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
