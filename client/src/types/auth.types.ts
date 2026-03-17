export type AuthContextUser = {
    _id: string,
    email: string,
    fullName: string,
    username: string,
    avatar: {
        publicId: string,
        version: number
    }
} | null