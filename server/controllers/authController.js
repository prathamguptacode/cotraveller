import User from '../models/User.js'
import { resolveMx } from "dns/promises"
import * as argon2 from 'argon2'
import { uuid } from 'uuidv4'
import env from '../config/env.js'
import TempToken from '../models/TempToken.js'
import { sendOtp } from '../services/nodemailer.js'
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js'
import { CustomError } from '../utils/CustomError.js'

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
    const otpExpiresAt = Date.now() + 5 * 60 * 1000

    //Creating tempToken
    await TempToken.create({ email, passwordHash, fullName, username, otpHash, otpUUID, otpExpiresAt })

    //Sending otp using nodemailer via email
    sendOtp(email, otp)

    //Sending a cookie containing otpUUID
    res.cookie('otpUUID', otpUUID, {
        sameSite: "lax",
        secure: env.COOKIE_IS_SECURE,
        httpOnly: true,
        maxAge: 20 * 60 * 1000,
    })

    res.success(200, "OK", "Registeration process initiated, otp sent via email")

}

export const otpVerificationController = async (req, res) => {
    const enteredOtp = req.body?.otp
    if (!enteredOtp) return res.fail(400, "INVALID_OTP_FORMAT", "Entered otp had an invalid format")

    const otpUUID = req.cookies?.otpUUID
    if (!otpUUID) return res.fail(400, "INVALID_COOKIE", "Otp uuid cookie was invalid")

    const token = await TempToken.findOne({ otpUUID })
    if (!token) return res.fail(410, "SESSION_EXPIRED", "Otp session expired, please re-signup")

    //Extracting tempToken data and checking for otp expiry
    const { otpHash, email, fullName, passwordHash, username, otpExpiresAt } = token
    if (Date.now() > otpExpiresAt) return res.fail(410, "OTP_EXPIRED", "Otp has expired, please request a new one")

    //Verifying otp (Expensive)
    if (!await argon2.verify(otpHash, enteredOtp.toString())) return res.fail(400, "INVALID_OTP", "OTP did not match")

    //Creating new user
    var user
    try {
        user = await User.create({ email, fullName, passwordHash, username })
    } catch (error) {
        if (error.code === 11000) return res.fail(409, "USER_EXISTS", "User already exists")
        throw new CustomError()
    }

    //Generating tokens, sending cookie and auth data
    const accessToken = generateAccessToken(email)
    const refreshToken = generateRefreshToken(email)
    res.cookie('refreshToken', refreshToken, env.REFRESH_COOKIE_OPTIONS)

    //Deleting tempToken (More efficent > auto delete)
    await TempToken.deleteOne({ otpUUID })

    //###REMOVE/CHANGE LATER, send only basic, non-sensitive, required user data to frontend
    res.success(201, { user, accessToken }, "Signup Successful")

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
    res.cookie('refreshToken', refreshToken, env.REFRESH_COOKIE_OPTIONS)

    //###REMOVE/CHANGE LATER, send only basic, non-sensitive, required user data to frontend
    res.success(200, { accessToken, user }, "Login Successful")

}


