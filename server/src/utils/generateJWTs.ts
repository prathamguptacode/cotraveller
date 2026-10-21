import env from '@/config/env'
import { AuthTokenPayload, OTPTokenPayload } from '@/types/types'
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


export const generateInviteToken = async (payload: { tripId: string }) => {
    try {
        const inviteToken = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1d')
            .sign(generateUint8Array(env.INVITE_TOKEN_SECRET))

        return inviteToken
    } catch (error) {
        console.error("Could not generate invite token", error)
        throw error
    }
}


export const generateOTPToken = async (payload: OTPTokenPayload) => {
    try {
        const otpToken = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('15m')
            .sign(generateUint8Array(env.OTP_TOKEN_SECRET))
        return otpToken
    } catch (error) {
        console.error("Could not generate invite token", error)
        throw error
    }
}