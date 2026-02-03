export type Comment = {
    author: string,
    comment: string
}

export type Member = {
    _id: string,
    fullName: string
}

export type Group = {
    _id: string,
    requests: string[],
    member: Member[],
    comments: Comment[],
    travelDate: string,
    title: string,
    content: string,
    mode: string,
    intialLocation: string
}