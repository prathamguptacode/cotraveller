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

export { }