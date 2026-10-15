import env from "@/config/env"
import { AuthTokenPayload } from "@/types/types"
import { generateUint8Array } from "@/utils/generateJWTs"
import { RequestHandler } from "express"
import { jwtVerify } from "jose"
import { JOSEError, JWTExpired } from "jose/errors"
import { REFRESH_COOKIE_OPTIONS } from "@/lib/cookies"

const authMiddleware: RequestHandler = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader?.split('Bearer ')[1]
    if (!accessToken) return res.fail(401, "UNAUTHORIZED", "Invalid accessToken")


    try {
        const { payload: { userId } } = await jwtVerify<AuthTokenPayload>(accessToken, generateUint8Array(env.ACCESS_TOKEN_SECRET))
        req.user = { _id: userId }
    } catch (error) {
        //Token expired
        if (error instanceof JWTExpired) return res.fail(401, "ACCESS_TOKEN_EXPIRED", "Access token expired, request a new one")
        if (error instanceof JOSEError) {
            // Token invalid, clear refreshToken
            res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
            return res.fail(401, "INVALID_JWT", "Invalid Session")
        }
        // General non-jwt error
        throw error
    }

    next()
}

export default authMiddleware