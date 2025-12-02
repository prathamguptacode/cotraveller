import * as jose from 'jose'
import { generateUni8Array } from '../utils/generateToken.js'
import env from '../config/env.js'
import User from '../models/User.js'

export const verifyAccessToken = async (req, res, next) => {
    const authHeader = req.headers?.Authorization
    const accessToken = authHeader && authHeader.split(' ')[1]
    if (!accessToken) return res.fail(401, "TOKEN_NOT_FOUND", "Acesss token could not be found")

    var decoded
    try {
        decoded = await jose.jwtVerify(accessToken, generateUni8Array(env.ACCESS_TOKEN_SECRET))
    } catch (error) {
        const { code } = error
        if (code === "ERR_JWT_EXPIRED") return res.fail(401, "ACCESS_TOKEN_EXPIRED", "Access token expired, request a new one")

        res.clearCookie('refreshToken', env.REFRESH_COOKIE_OPTIONS)
        return res.fail(500, "INVALID_TOKEN")
    }

    const { payload: { email } } = decoded
    const user = await User.findOne({ email })

    //Incase user was deleted by admin or devs or blacklisted, or anything like that, we logout the user
    if (!user) {
        res.clearCookie('refreshToken', env.REFRESH_COOKIE_OPTIONS)
        return res.fail(401,"USER_NOT_FOUND","Associated user could not be found, logging out")
    }

    req.user = user
    next()
}
