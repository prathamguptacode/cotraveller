import * as jose from 'jose'
import env from '../config/env.js'


export const generateUni8Array = (JWT_SECRET) => new TextEncoder().encode(JWT_SECRET)

export const generateAccessToken = async (email) => {
    try {
        const jwt = await new jose.SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("2h")
            .sign(generateUni8Array(env.ACCESS_TOKEN_SECRET))
            console.log(generateUni8Array(env.ACCESS_TOKEN_SECRET))
        return jwt
    } catch (error) {
        throw error
    }
}


export const generateRefreshToken = (email) => {
    try {
        const jwt = new jose.SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(generateUni8Array(env.REFRESH_TOKEN_SECRET))
            console.log(generateUni8Array(env.REFRESH_TOKEN_SECRET))
        return jwt
    } catch (error) {
        throw error
    }
}

