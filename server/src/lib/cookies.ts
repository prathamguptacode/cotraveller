type CookieOptions = {
    httpOnly: true,
    maxAge: number,
    sameSite: 'lax',
    secure: true,
    path?: string
}

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    sameSite: "lax",
    secure: true,
    path: '/api/auth/refresh'
}

export const OTP_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15m
    sameSite: "lax",
    secure: true,
    path: '/api/auth/signup/'
}

export const OAUTH_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 5 * 60 * 1000, // 5m
    sameSite: "lax",
    path: '/api/oauth'
}