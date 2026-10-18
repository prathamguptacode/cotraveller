declare global {
    namespace Express {
        interface Response {
            success: (status?: number, data?: {}, message?: string) => Response,
            fail: (status?: number, code?: string, message?: string) => Response
        }
        interface Request {
            user: { _id: string }
        }
    }
}

declare module 'socket.io' {
    interface Socket {
        session: {
            userId: string,
            expiry: number
        }
    }
}

export { }