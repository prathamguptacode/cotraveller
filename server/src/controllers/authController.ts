import env from "@/config/env"
import { OTP_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from "@/lib/cookies"
import User from "@/models/User"
import { AuthTokenPayload, OTPTokenPayload } from "@/types/types"
import { generateAccessToken, generateOTPToken, generateRefreshToken, generateUint8Array } from "@/utils/generateJWTs"
import { RequestHandler } from "express"
import { jwtVerify } from "jose"
import { JOSEError, JWTExpired } from "jose/errors"
import { z } from "zod"
import * as argon2 from 'argon2'
import AuthLimitSession from "@/models/AuthLimitSession"
import AuthOTPSession from "@/models/AuthOTPSession"
import { sendOtp } from "@/utils/nodemailer"


const SignupBodySchema = z.object({
    email: z
        .email({ message: "Email is invalid or already taken" })
        .toLowerCase()
        .trim(),
    password: z.string()
        .trim()
        .min(8, { message: "Password is too short" })
        .max(64, { message: "Password is too long" })
        .regex(/[A-Z]/, { message: "Password needs an uppercase letter" })
        .regex(/[a-z]/, { message: "Password needs a lowercase letter" })
        .regex(/[0-9]/, { message: "Password needs a number" })
        .regex(/[^A-Za-z0-9\s]/, { message: "Password needs a special character" }),
    fullName: z.string()
        .trim()
        .transform(e => !e.length ? undefined : e)
        .pipe(z.string()
            .min(1, { error: "Name too short" })
            .max(32, { error: "Name too long" })
            .optional())
        .describe("Optional , but if there must be atleast 1 character long"),
    username: z
        .string({ error: "Username too short" })
        .trim()
        .min(4, { error: "Username too short" })
        .max(16, { error: "Username too long" })
        .regex(/^[a-zA-Z0-9]+(-?[a-zA-Z0-9])*$/, { error: "Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen." })
        .toLowerCase()
})

export const signup: RequestHandler = async (req, res) => {
    const parsedData = SignupBodySchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", parsedData.error.message)

    const { email, password, username, fullName } = parsedData.data


    //Check if email already exists
    if (await User.exists({ email })) return res.fail(409, "EMAIL_TAKEN", "Email is already registered")

    //Check if username is taken 
    if (await User.exists({ username })) return res.fail(409, "USERNAME_TAKEN", "Username is already taken")

    //Hashing password
    const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 64 * 1024,
        timeCost: 3,
        parallelism: 1
    })

    //Creating and hashing a 8 digit otp
    const otp = Math.floor((Math.random() * (1e8 - 1e7)) + 1e7)
    const otpHash = await argon2.hash(otp.toString(), {
        type: argon2.argon2id,
        memoryCost: 64 * 1024,
        timeCost: 3,
        parallelism: 1,
    })

    //Creating new AuthLimit Session to limit email usage
    const authLimitSession = await AuthLimitSession.findOne({ email })
    if (authLimitSession && authLimitSession.attempts >= 5) return res.fail(429, "AUTH_LIMIT_REACHED", "You have exceeded the maximum number of signup attempts for this email. Please try again later")

    let newAuthLimitSessionPromise
    if (authLimitSession) {
        authLimitSession.attempts += 1
        newAuthLimitSessionPromise = authLimitSession.save()
    }
    else newAuthLimitSessionPromise = AuthLimitSession.create({ email })

    // Create AuthOTPSession
    const authOTPSessionPromise = AuthOTPSession.create({
        otpHash, payload: { email, passwordHash, username, fullName }
    })

    const [authOTPSession] = await Promise.all([authOTPSessionPromise, newAuthLimitSessionPromise])


    // Create a JWT storing the id of the authOTPSession
    const otpToken = await generateOTPToken({ authOTPSessionId: authOTPSession.id })



    //Sending otp to the given email using nodemailer
    sendOtp(email, otp)

    //Sending a httpOnly cookie storing the otpToken for 15 mins
    res.cookie('otpToken', otpToken, OTP_COOKIE_OPTIONS)

    return res.success(200, "OK", "OTP sent to your email successfully")
}


const VerifyOTPSchema = z.object({
    otp: z.coerce.number().int().min(1e7).max(1e8 - 1).describe("8 digit OTP")
})


export const verifyOTP: RequestHandler = async (req, res) => {
    const parsedData = VerifyOTPSchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid data")


    const { otpToken } = req.cookies
    if (!otpToken) return res.redirect('/')

    try {
        const { payload: { authOTPSessionId } } = await jwtVerify<OTPTokenPayload>(otpToken, generateUint8Array(env.OTP_TOKEN_SECRET))

        const authOTPSession = await AuthOTPSession.findById(authOTPSessionId)

        if (!authOTPSession || new Date().getTime() >= authOTPSession.createdAt.getTime() + 15 * 60 * 1000) {
            res.clearCookie('otpToken', OTP_COOKIE_OPTIONS)
            return res.redirect('/')
        }

        // Session exists, lets check for expiry and attempts
        const { otpHash, payload, incorrectAttempts, lastSentAt } = authOTPSession

        // Check for attempts left
        if (incorrectAttempts >= 3) return res.fail(429, "INCORRECT_ATTEMPTS_LIMIT", "Too many incorrect attempts, please request a new OTP")

        // Check for expiry
        if (new Date().getTime() >= lastSentAt.getTime() + 5 * 60 * 1000) return res.fail(410, "OTP_EXPIRED", "OTP has expired, please request a new one")


        // Check if OTP is correct
        if (!await argon2.verify(otpHash, parsedData.data.otp.toString())) {
            authOTPSession.incorrectAttempts += 1
            await authOTPSession.save()
            return res.fail(400, "INCORRECT_OTP", "Entered OTP was incorrect")
        }

        // OTP is correct, finish things up

        // Final check for pre-existing user conflicts
        if (await User.exists({ $or: [{ email: payload.email }, { username: payload.username }] })) {
            res.clearCookie('otpToken', OTP_COOKIE_OPTIONS)
            return res.redirect('/')
        }

        // Create User ( DONT SPREAD THE PAYLOAD DIRECTLY, because its not a plain JSON but mongoose doc )
        const { email, passwordHash, username, fullName } = payload
        const user = await User.create({ email, passwordHash, username, fullName })


        // Clear otpToken cookie
        res.clearCookie('otpToken', OTP_COOKIE_OPTIONS)

        // Creating AuthTokens
        const [accessToken, refreshToken] = await Promise.all([
            generateAccessToken({ userId: user.id }),
            generateRefreshToken({ userId: user.id })
        ])

        res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)


        return res.success(201, { user, accessToken })

    } catch (error) {
        if (error instanceof JOSEError) {
            res.clearCookie('otpToken', OTP_COOKIE_OPTIONS)
            return res.redirect('/')
        }
        throw error
    }
}


export const resendOTP: RequestHandler = async (req, res) => {
    const { otpToken } = req.cookies
    if (!otpToken) return res.redirect('/')

    try {
        const { payload: { authOTPSessionId } } = await jwtVerify<OTPTokenPayload>(otpToken, generateUint8Array(env.OTP_TOKEN_SECRET))

        const authOTPSession = await AuthOTPSession.findById(authOTPSessionId)

        if (!authOTPSession || new Date().getTime() >= authOTPSession.createdAt.getTime() + 15 * 60 * 1000) {
            res.clearCookie('otpToken', OTP_COOKIE_OPTIONS)
            return res.redirect('/')
        }

        // Session exists, lets check for expiry and attempts
        const { lastSentAt, resendRequests, payload: { email } } = authOTPSession

        // Check if otp can be resent
        if (resendRequests >= 3) return res.fail(429, "TOO_MANY_REQUESTS", "You have requested the maximum number of OTPs for the session. Try signing up again.")


        // Check for resend cooldown expiry of 1m
        const remainingTime = (lastSentAt.getTime() + 1 * 60 * 1000) - new Date().getTime()
        if (remainingTime >= 0) return res.fail(429, "TOO_MANY_REQUESTS", `Please wait for another ${Math.ceil(remainingTime / 1000)} seconds before requesting a new OTP`)


        //Creating and hashing a new 8 digit otp
        const otp = Math.floor((Math.random() * (1e8 - 1e7)) + 1e7)
        const otpHash = await argon2.hash(otp.toString(), {
            type: argon2.argon2id,
            memoryCost: 64 * 1024,
            timeCost: 3,
            parallelism: 1,
        })

        // Update db with new OTP
        authOTPSession.otpHash = otpHash
        authOTPSession.lastSentAt = new Date()
        authOTPSession.incorrectAttempts = 0
        authOTPSession.resendRequests += 1

        await authOTPSession.save()
        //Send new otp
        sendOtp(email, otp)

        return res.success(200, "OK", "Fresh OTP sent to your email successfully")


    } catch (error) {
        if (error instanceof JOSEError) {
            res.clearCookie('otpToken', OTP_COOKIE_OPTIONS)
            return res.redirect('/')
        }
        throw error
    }
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
    if (!refreshToken) return res.fail(401, "REFRESH_TOKEN_NOT_FOUND", "Refresh token was missing")

    // Basic Anti-CSRF
    const csrfHeader = req.headers['x-requested-with']
    if (!csrfHeader) {
        res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
        return res.fail(401, "UNAUTHORIZED_ORIGIN")
    }


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
