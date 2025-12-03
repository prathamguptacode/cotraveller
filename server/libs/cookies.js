import env from "../config/env.js";


export const OAUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    maxAge: 5 * 60 * 1000, //5min
    sameSite: "lax",
    secure: true
}

export const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, //7d
    sameSite: "lax",
    secure: true,
}