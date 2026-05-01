export type Group = {
    _id: string,
    title: string,
    lastMessage?: {
        author: string,
        text: string,
        createdAt: Date
    },
    unreadMessagesCount: number,
    avatar:{
        publicId:string,
        version:number
    }
}