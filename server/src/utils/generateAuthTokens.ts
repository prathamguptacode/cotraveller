import env from '@/config/env'
import { AuthTokenPayload } from '@/types/types'
import * as jose from 'jose'

const textEncoder = new TextEncoder()

export const generateUint8Array = (JWT_SECRET: string) => textEncoder.encode(JWT_SECRET)

export const generateAccessToken = async (payload: AuthTokenPayload) => {
    try {
        const accessToken = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('15m')
            .sign(generateUint8Array(env.ACCESS_TOKEN_SECRET))

        return accessToken

    } catch (error) {
        console.error("Could not generate access token", error)
        throw error
    }

}

export const generateRefreshToken = async (payload: AuthTokenPayload) => {
    try {
        const refreshToken = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(generateUint8Array(env.REFRESH_TOKEN_SECRET))

        return refreshToken
    } catch (error) {
        console.error("Could not generate refresh token", error)
        throw error
    }
}