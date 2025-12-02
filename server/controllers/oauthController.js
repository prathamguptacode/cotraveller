import { generateCodeVerifier, generateState, OAuth2RequestError, } from "arctic"
import { google } from "../libs/oauth.js"
import env from "../config/env.js"
import * as jose from 'jose'
import { generateRefreshToken } from "../utils/generateToken.js"
import User from "../models/User.js"
import { generateFromEmail } from 'unique-username-generator'

export const redirectToGoogleOAuth = (req, res) => {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const scopes = ["email", "openid", "profile"]

    const url = google.createAuthorizationURL(state, codeVerifier, scopes)

    res.cookie('googleState', state, env.OAUTH_COOKIE_OPTIONS)
    res.cookie('googleCodeVerifier', codeVerifier, env.OAUTH_COOKIE_OPTIONS)

    res.redirect(url)
}

export const googleOAuthCallback = async (req, res) => {
    const googleState = req.cookies?.googleState
    const googleCodeVerifier = req.cookies?.googleCodeVerifier
    const state = req.query?.state
    const code = req.query?.code

    const clearCookies = () => {
        res.clearCookie('googleState', env.OAUTH_COOKIE_OPTIONS)
        res.clearCookie('googleCodeVerifier', env.OAUTH_COOKIE_OPTIONS)
    }

    //###LATER FIX , handle error in a better way 
    if (!googleState || !googleCodeVerifier || !state || !code) return res.fail(400, "BAD_REQUEST", "Google oauth cookies or queries were missing")

    if (googleState !== state) {
        clearCookies()
        return res.fail(400, "OAUTH_INVALID_STATE", "Google oauth state did not match")
    }

    var tokens
    try {
        tokens = await google.validateAuthorizationCode(code, googleCodeVerifier)
    } catch (error) {
        if (error instanceof OAuth2RequestError) {
            clearCookies()
            //Incorrect authorization creds/code or redirect uri
            return res.fail(401, "OAUTH_UNAUTHORIZED", "Google oauth code was invalid, verification failed")
        }
        throw error
    }

    const idToken = tokens.idToken()

    const rsaPublicKey = await jose.importJWK({
        kty: "RSA",
        e: "AQAB",
        n: "lS1jk0KK-dNV-znvOtWcgkiY52Wdfs7RN3117id4c1cmJ3gR0bgRbKo_G6MeY6pAdgWjoGl114tkEAbhKv-4uONGXizTMtqEj10vXzDaZhFeAYX-7VthR-kyuCKFDwU6KHYunV7G-kcKIlCM9p6nnpky7JxBYh9eDzshRbrF6qhxemidcsoL0OGclfslbzgkcUbG2uP21X-fGpX2NmoT5CWcSBoFoo3oesggZuU7goQ_mXdsndPtOEwspmwRpwC_sssdMhDhkG8ehuSSYrbGMCUF3yAOkZfmFRKf6cjtOBeBifmzarhk5XCD5-NIMUBBoD5pdQrsrZuQrImIIPoqwQ",
    }, "RS256")

    const decoded = await jose.jwtVerify(idToken, rsaPublicKey, {
        issuer: "https://accounts.google.com",
        audience: env.GOOGLE_CLIENT_ID,
    })

    const { name: fullName, email } = decoded.payload


    //User basic auth
    const refreshToken = await generateRefreshToken(email)
    res.cookie('refreshToken', refreshToken, env.REFRESH_COOKIE_OPTIONS)

    if (await User.exists({ email })) {
        await User.updateOne({ email }, { $addToSet: { oAuthProviders: "google" } })
    }
    else {
        const username = generateFromEmail(email, { randomDigits: 3, leadingFallback: traveller })
        await User.create({ email, fullName, username })
    }

    res.redirect('/group')
}

