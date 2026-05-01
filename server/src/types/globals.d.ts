import { Types } from "mongoose"

declare global {
    namespace Express {
        interface Response {
            success: (status?: number, data?: {}, message?: string) => Response,
            fail: (status?: number, code?: string, message?: string) => Response
        }
        interface Request {
            user: {
                _id: Types.ObjectId,
                email: string,
                fullName: string,
                username: string,
                groups: Types.ObjectId[],
                avatar: {
                    publicId?: string | null | undefined,
                    version?: number | null | undefined
                },
            },
        }
    }
}

export { }