import env from "@/config/env"
import { REFRESH_COOKIE_OPTIONS } from "@/lib/cookies"
import User from "@/models/User"
import { AuthTokenPayload } from "@/types/types"
import { generateAccessToken, generateRefreshToken, generateUint8Array } from "@/utils/generateJWTs"
import { RequestHandler } from "express"
import { jwtVerify } from "jose"
import { JOSEError, JWTExpired } from "jose/errors"
import { z } from "zod"
import * as argon2 from 'argon2'

// ###LATER Add trailing spaces and lowercase protection to email later
// ###TEMPORARY , this logic for signup is temporary for early development
const SignupBodySchema = z.object({
    email: z.email(),
    password: z.string()
})

export const signup: RequestHandler = async (req, res) => {
    const parsedData = SignupBodySchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid data")

    const { email, password } = parsedData.data


    //Check if email already exists
    if (await User.exists({ email })) return res.fail(409, "EMAIL_TAKEN", "Email is already registered")

    //Hashing password
    const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 64 * 1024,
        timeCost: 3,
        parallelism: 1
    })

    // Creating user
    const user = await User.create({ email, passwordHash })


    //Generating tokens, sending cookie and auth data
    const accessToken = await generateAccessToken({ userId: user.id })
    const refreshToken = await generateRefreshToken({ userId: user.id })
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)

    user.passwordHash = undefined
    //###REMOVE/CHANGE LATER, send only basic, non-sensitive, required user data to frontend
    res.success(201, { user, accessToken }, "Signup Successful")
}


const LoginBodySchema = z.object({
    email: z.email(),
    password: z.string()
})

export const login: RequestHandler = async (req, res) => {
    const parsedData = LoginBodySchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid data")

    const { email, password } = parsedData.data

    //Check if user exists
    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user) return res.fail(400, "USER_NOT_FOUND", "Email not registered")

    //Check if password mathces
    const { passwordHash, id: userId } = user
    if (!passwordHash) return res.fail(400, "PASSWORD_NOT_FOUND", "You do not have a password set, please login using other methods or use 'Forgot Password' to make a new one")

    if (!await argon2.verify(passwordHash, password)) return res.fail(400, "INVALID_PASSWORD", "Password is invalid")

    //Generating tokens, sending cookie and auth data
    const accessToken = await generateAccessToken({ userId })
    const refreshToken = await generateRefreshToken({ userId })
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)

    user.passwordHash = undefined
    //###REMOVE/CHANGE LATER, send only basic, non-sensitive, required user data to frontend
    res.success(200, { accessToken, user }, "Login Successful")

}


export const refreshToken: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) return res.fail(403, "TOKEN_NOT_FOUND", "Refresh token was missing")


    try {
        const { payload: { userId } } = await jwtVerify<AuthTokenPayload>(refreshToken, generateUint8Array(env.REFRESH_TOKEN_SECRET))

        const [accessToken, user] = await Promise.all([generateAccessToken({ userId }), User.findById(userId)])
        if (!user) {
            res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
            return res.fail(401, "USER_NOT_FOUND", "User does not exist")
        }

        res.success(200, { accessToken, user })
    } catch (error) {
        res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
        //Token expired
        if (error instanceof JWTExpired) return res.fail(401, "SESSION_EXPIRED", "Session expired")
        if (error instanceof JOSEError) {
            // Token invalid
            return res.fail(403, "INVALID_JWT", "Invalid Session")
        }
        // General non-jwt error
        throw error
    }
}

export const logout: RequestHandler = (req, res) => {
    res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
    return res.sendStatus(204)
}
