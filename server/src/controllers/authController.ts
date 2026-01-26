import User from '../models/User'
import * as argon2 from 'argon2'
import { uuid } from 'uuidv4'
import env from '../config/env'
import OtpSession from '../models/OtpSession'
import { sendOtp } from '../services/nodemailer'
import { generateAccessToken, generateRefreshToken, generateUni8Array } from '../utils/generateToken'
import { CustomError } from '../utils/CustomError'
import OtpRequestLimit from '../models/OtpRequestLimit'
import * as cookies from '../libs/cookies'
import * as jose from 'jose'
import { RequestHandler } from 'express'


export const signupController: RequestHandler = async (req, res) => {
    const { username, password, fullName } = req.body
    const email = req.body.email.toLowerCase()


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

    //Creating and hashing otp
    const otp = Math.floor((Math.random() * (1e6 - 1e5)) + 1e5)
    const otpHash = await argon2.hash(otp.toString(), {
        type: argon2.argon2id,
        memoryCost: 64 * 1024,
        timeCost: 3,
        parallelism: 1,
    })
    const otpUUID = uuid()

    //Checking OtpRequestLimit
    const emailSession = await OtpRequestLimit.findOne({ email })
    if (emailSession) {
        if (emailSession.requests > 3) return res.fail(429, "EMAIL_SESSION_LIMIT", "Otp request limit reached for email, please try after 10min")
        await OtpRequestLimit.updateOne({ email }, { $inc: { requests: 1 } })
    }
    else {
        await OtpRequestLimit.create({ email })
    }

    //Creating OtpSession
    await OtpSession.create({ email, passwordHash, fullName, username, otpHash, otpUUID })

    //Sending otp using nodemailer via email
    sendOtp(email, otp)

    //Sending a cookie containing otpUUID
    res.cookie('otpUUID', otpUUID, {
        sameSite: "lax",
        secure: true,
        httpOnly: true,
        maxAge: 5 * 60 * 1000,
    })

    res.success(200, "OK", "Registeration process initiated, otp sent via email")

}

export const otpVerificationController: RequestHandler = async (req, res) => {
    const enteredOtp = req.body?.otp
    if (!enteredOtp) return res.fail(400, "INVALID_OTP_FORMAT", "Entered otp had an invalid format")

    const otpUUID = req.cookies?.otpUUID
    if (!otpUUID) return res.fail(410, "SESSION_EXPIRED", "Otp session expired, please re-signup")

    const token = await OtpSession.findOne({ otpUUID })
    if (!token) return res.fail(400, "SESSION_EXPIRED", "Otp session expired, please re-signup")

    //Extracting OtpSession data
    const { otpHash, email, fullName, passwordHash, username, attempts } = token

    //Current attempt
    const attemptNumber = attempts + 1
    if (attemptNumber > 3) return res.fail(429, "OTP_SESSION_LIMIT", "You have excceded the no of attempts to enter otp, please request a new one")



    //Verifying otp (Expensive)
    const isValid = await argon2.verify(otpHash, enteredOtp.toString())

    //Updating attempts now so that, only updated if hash veification doesnt throw
    await OtpSession.updateOne({ otpUUID }, { $inc: { attempts: 1 } })
    if (!isValid) return res.fail(400, "INVALID_OTP", "OTP did not match, please retry")

    //Creating new user
    if (await User.exists({ $or: [{ email }, { username }] })) return res.fail(409, "USER_EXISTS", "User already exists")
    const user = await User.create({ email, fullName, passwordHash, username })


    //Generating tokens, sending cookie and auth data
    const accessToken = await generateAccessToken(email)
    const refreshToken = await generateRefreshToken(email)
    res.cookie('refreshToken', refreshToken, cookies.REFRESH_COOKIE_OPTIONS)

    //Deleting OtpSession (More efficent > auto delete), but no need to await since, if it throws ttl is backup and otherwise it will be deleted in bg
    await OtpSession.deleteOne({ otpUUID })
    await OtpRequestLimit.deleteOne({ email })
    res.clearCookie('otpUUID', {
        sameSite: "lax",
        secure: true,
        httpOnly: true,
        maxAge: 5 * 60 * 1000,
    })

    //###REMOVE/CHANGE LATER, send only basic, non-sensitive, required user data to frontend
    res.success(201, { user: { fullName, username, email, _id: user._id }, accessToken }, "Signup Successful")

}


export const loginController: RequestHandler = async (req, res) => {
    const { email, password } = req.body

    //Check if user exists
    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user) return res.fail(400, "USER_NOT_FOUND", "Email not registered")

    //Check if password mathces
    const { passwordHash, fullName, username, _id } = user
    if (!passwordHash) return res.fail(400, "PASSWORD_NOT_FOUND", "You do not have a password set, please login using other methods or use 'Forgot Password' to make a new one")

    if (!await argon2.verify(passwordHash, password)) return res.fail(400, "INVALID_PASSWORD", "Password is invalid")

    //Generating tokens, sending cookie and auth data
    const accessToken = await generateAccessToken(email)
    const refreshToken = await generateRefreshToken(email)
    res.cookie('refreshToken', refreshToken, cookies.REFRESH_COOKIE_OPTIONS)

    //###REMOVE/CHANGE LATER, send only basic, non-sensitive, required user data to frontend
    res.success(200, { accessToken, user: { email, username, fullName, _id } }, "Login Successful")

}


export const resendOtpController: RequestHandler = async (req, res) => {
    const otpUUID = req.cookies?.otpUUID
    if (!otpUUID) return res.fail(410, "SESSION_EXPIRED", "Otp session expired, please re-signup")

    //Checking no. of attempts for the email session
    const session = await OtpSession.findOne({ otpUUID })
    if (!session) return res.fail(410, "SESSION_EXPIRED", "Otp session expired, please re-signup")
    const { email } = session

    const requestLimit = await OtpRequestLimit.findOne({ email })
    if (!requestLimit) return res.fail(410, "SESSION_EXPIRED", "Otp session expired, please re-signup")
    const { requests } = requestLimit

    const requestNumber = requests + 1
    if (requestNumber > 4) return res.fail(429, "EMAIL_SESSION_LIMIT", "Otp request limit reached for email, please try after 10min")

    await OtpRequestLimit.updateOne({ email }, { $inc: { requests: 1 } })

    //Creating and sending a new otp
    const otp = Math.floor((Math.random() * (1e6 - 1e5)) + 1e5)
    const otpHash = await argon2.hash(otp.toString(), {
        type: argon2.argon2id,
        memoryCost: 64 * 1024,
        timeCost: 3,
        parallelism: 1,
    })

    sendOtp(email, otp)

    //Updating OtpSession data
    await OtpSession.updateOne({ otpUUID }, { $set: { attempts: 0, otpHash } })

    return res.success(200, "OK", "Otp resent")
}


export const refreshTokenController: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) throw new CustomError(401, "TOKEN_NOT_FOUND", "Refresh token was missing")

    //Extracting data
    var decoded
    try {
        decoded = await jose.jwtVerify<{ email: string }>(refreshToken, generateUni8Array(env.REFRESH_TOKEN_SECRET))
    } catch (error) {
        res.clearCookie('refreshToken', cookies.REFRESH_COOKIE_OPTIONS)
        if (error instanceof jose.errors.JOSEError) {
            const { code } = error
            if (code === "ERR_JWT_EXPIRED") return res.fail(401, "REFRESH_TOKEN_EXPIRED", "Refresh token expired")
            if (code === "ERR_SIGNATURE_VERIFICATION_FAILED") return res.fail(401, "INVALID_SIGNATURE", "Token signature has been tampered with")
            throw new CustomError(500, error.code, error.message)
        }
        else throw error
    }

    const { payload: { email } } = decoded

    //Creating new accessToken and fetching auth data
    const accessToken = await generateAccessToken(email)
    const user = await User.findOne({ email })

    if (!user) {
        res.clearCookie('refreshToken', cookies.REFRESH_COOKIE_OPTIONS)
        res.fail(401, "USER_NOT_FOUND", "User does not exist")
    }

    res.success(200, { accessToken, user })

}

export const logoutController: RequestHandler = (req, res) => {
    res.clearCookie('refreshToken', cookies.REFRESH_COOKIE_OPTIONS)
    return res.sendStatus(204)
}
