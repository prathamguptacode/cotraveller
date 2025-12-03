import User from '../models/User.js'
import { resolveMx } from "dns/promises"
import * as argon2 from 'argon2'
import { uuid } from 'uuidv4'
import env from '../config/env.js'
import OtpSession from '../models/OtpSession.js'
import { sendOtp } from '../services/nodemailer.js'
import { generateAccessToken, generateRefreshToken, generateUni8Array } from '../utils/generateToken.js'
import { CustomError } from '../utils/CustomError.js'
import OtpRequestLimit from '../models/OtpRequestLimit.js'
import * as cookies from '../libs/cookies.js'
import * as jose from 'jose'


export const signupController = async (req, res) => {
    const { username, password, fullName } = req.body
    const email = req.body.email.toLowerCase()

    //MX lookup for checking valid email dns
    const domain = email.split("@")[1]
    const mxRecords = await resolveMx(domain)
    if (!mxRecords) return res.fail(400, "INVALID_DOMAIN", "Email address domain cannot receive mails,check if '@example.com' is valid")

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
        secure: env.COOKIE_IS_SECURE,
        httpOnly: true,
        maxAge: 5 * 60 * 1000,
    })

    res.success(200, "OK", "Registeration process initiated, otp sent via email")

}

export const otpVerificationController = async (req, res) => {
    const enteredOtp = req.body?.otp
    if (!enteredOtp) return res.fail(400, "INVALID_OTP_FORMAT", "Entered otp had an invalid format")

    const otpUUID = req.cookies?.otpUUID
    if (!otpUUID) return res.fail(410, "SESSION_EXPIRED", "Otp session expired, please re-signup")

    const token = await OtpSession.findOne({ otpUUID })

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
    var user
    try {
        user = await User.create({ email, fullName, passwordHash, username })
    } catch (error) {
        if (error.code === 11000) return res.fail(409, "USER_EXISTS", "User already exists")
        throw new CustomError()
    }

    //Generating tokens, sending cookie and auth data
    const accessToken = await generateAccessToken(email)
    const refreshToken = await generateRefreshToken(email)
    res.cookie('refreshToken', refreshToken, cookies.REFRESH_COOKIE_OPTIONS)

    //Deleting OtpSession (More efficent > auto delete), but no need to await since, if it throws ttl is backup and otherwise it will be deleted in bg
    await OtpSession.deleteOne({ otpUUID })
    await OtpRequestLimit.deleteOne({ email })
    res.clearCookie('otpUUID', {
        sameSite: "lax",
        secure: env.COOKIE_IS_SECURE,
        httpOnly: true,
        maxAge: 5 * 60 * 1000,
    })

    //###REMOVE/CHANGE LATER, send only basic, non-sensitive, required user data to frontend
    res.success(201, { user: { fullName, username, email }, accessToken }, "Signup Successful")

}


export const loginController = async (req, res) => {
    const { email, password } = req.body

    //Check if user exists
    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user) return res.fail(400, "USER_NOT_FOUND", "User does not exist")

    //Check if password mathces
    const { passwordHash } = user
    if (!await argon2.verify(passwordHash, password)) return res.fail(400, "INVALID_PASSWORD", "Password was invalid!")

    //Generating tokens, sending cookie and auth data
    const accessToken = await generateAccessToken(email)
    const refreshToken = await generateRefreshToken(email)
    res.cookie('refreshToken', refreshToken, cookies.REFRESH_COOKIE_OPTIONS)

    //###REMOVE/CHANGE LATER, send only basic, non-sensitive, required user data to frontend
    res.success(200, { accessToken, user }, "Login Successful")

}


export const refreshOtpController = async (req, res) => {
    const otpUUID = req.cookies?.otpUUID
    if (!otpUUID) return res.fail(410, "SESSION_EXPIRED", "Otp session expired, please re-signup")

    //Checking no. of attempts for the email session
    const { email } = await OtpSession.findOne({ otpUUID })
    console.log(email)
    const { requests } = await OtpRequestLimit.findOne({ email })

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


export const refreshTokenController = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) throw new CustomError(401, "TOKEN_NOT_FOUND", "Refresh token was missing")

    //Extracting data
    var decoded
    try {
        decoded = await jose.jwtVerify(refreshToken, generateUni8Array(env.REFRESH_TOKEN_SECRET))
    } catch (error) {
        res.clearCookie('refreshToken', cookies.REFRESH_COOKIE_OPTIONS)

        const { code } = error
        if (code === "ERR_JWT_EXPIRED") return res.fail(401, "REFRESH_TOKEN_EXPIRED", "Refresh token expired")
        if (code === "ERR_SIGNATURE_VERIFICATION_FAILED") return res.fail(401, "INVALID_SIGNATURE", "Token signature has been tampered with")
        throw new CustomError(500, error.code, error.message)
    }

    const { payload: { email } } = decoded

    //Creating new accessToken and fetching auth data
    const accessToken = await generateAccessToken(email)
    const user = await User.findOne({ email })

    res.success(200, { accessToken, user })

}

export const logoutController = (req, res) => {
    res.clearCookie('refreshToken', cookies.REFRESH_COOKIE_OPTIONS)
    return res.sendStatus(204)
}
