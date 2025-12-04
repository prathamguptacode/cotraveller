import { generateCodeVerifier, generateState, OAuth2RequestError, } from "arctic"
import { github, google } from "../libs/oauth.js"
import env from "../config/env.js"
import * as jose from 'jose'
import { generateRefreshToken } from "../utils/generateToken.js"
import User from "../models/User.js"
import { generateFromEmail } from 'unique-username-generator'
import * as cookies from '../libs/cookies.js'
import axios from 'axios'


export const redirectToGoogleOAuth = (req, res) => {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const scopes = ["email", "openid", "profile"]

    const url = google.createAuthorizationURL(state, codeVerifier, scopes)

    res.cookie('googleState', state, cookies.OAUTH_COOKIE_OPTIONS)
    res.cookie('googleCodeVerifier', codeVerifier, cookies.OAUTH_COOKIE_OPTIONS)

    res.redirect(url)
}

export const googleOAuthCallback = async (req, res) => {
    const googleState = req.cookies?.googleState
    const googleCodeVerifier = req.cookies?.googleCodeVerifier
    const state = req.query?.state
    const code = req.query?.code

    const clearCookies = () => {
        res.clearCookie('googleState', cookies.OAUTH_COOKIE_OPTIONS)
        res.clearCookie('googleCodeVerifier', cookies.OAUTH_COOKIE_OPTIONS)
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
    res.cookie('refreshToken', refreshToken, cookies.REFRESH_COOKIE_OPTIONS)

    if (await User.exists({ email })) {
        await User.updateOne({ email }, { $addToSet: { oAuthProviders: "google" } })
    }
    else {
        const username = generateFromEmail(email, { randomDigits: 3, leadingFallback: "traveller" })
        await User.create({ email, fullName, username })
    }

    res.redirect('/group')
}


export const redirectToGithubOAuth = (req, res) => {
    const state = generateState()
    const scopes = ["user:email", 'read:user']

    const url = github.createAuthorizationURL(state, scopes)
    res.cookie('githubState', state, cookies.OAUTH_COOKIE_OPTIONS)

    res.redirect(url)
}

export const githubOAuthCallback = async (req, res) => {
    const state = req.query?.state
    const code = req.query?.code
    const githubState = req.cookies?.githubState

    const clearCookies = () => {
        res.clearCookie('githubState', cookies.OAUTH_COOKIE_OPTIONS)
    }

    if (!state || !githubState || !code) return res.fail(400, "BAD_REQUEST", "Github oauth cookies or queries were missing")

    if (state !== githubState) return res.fail(401, "OAUTH_INVALID_STATE", "Github oauth state was invalid")

    var tokens
    try {
        tokens = await github.validateAuthorizationCode(code)
    } catch (error) {
        if (error instanceof OAuth2RequestError) {
            clearCookies()
            return res.fail(401, "OAUTH_UNAUTHRORIZED", "Github oauth authorization code was invalid")
        }
        throw error
    }

    const githubAccessToken = tokens.accessToken()

    const { data: { login: githubUsername, name } } = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${githubAccessToken}` }
    })
    const { data: emails } = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${githubAccessToken}` }
    })

    const { email } = emails.find(obj => obj.primary)



    if (await User.exists({ email })) {
        await User.updateOne({ email }, { $addToSet: { oAuthProviders: "github" } })
    }
    else {

        let username
        if (await User.exists({ username: githubUsername })) {
            username = generateFromEmail(email, { randomDigits: 3, leadingFallback: "traveller" })
        }
        else {
            username = githubUsername
        }

        await User.create({ email, fullName: name, username, oAuthProviders: ["github"] })
    }


    const refreshToken = await generateRefreshToken(email)
    res.cookie('refreshToken', refreshToken, cookies.REFRESH_COOKIE_OPTIONS)
    clearCookies()
    res.redirect('/group')
}
