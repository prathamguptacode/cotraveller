import 'dotenv/config'
import { z } from 'zod'


const EnvSchema = z.object({
    // Basic
    PORT: z.coerce.number().int().positive().max(65535).default(8080),
    CLIENT_URL: z.string(),
    NODE_ENV: z.enum(['development', 'production']),

    // Database
    MONGO_URI: z.string(),

    // Cloudinary
    CLOUDINARY_URL: z.string(),

    // JWT Tokens
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    OTP_TOKEN_SECRET: z.string(),
    INVITE_TOKEN_SECRET: z.string(),

    // Gmail Credentials
    EMAIL_ID: z.email(),
    EMAIL_APP_PASSWORD: z.string(),

    // OAuth Credentials
    // Google
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REDIRECT_URI: z.string(),
    // Github
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GITHUB_REDIRECT_URI: z.string(),
})

const parsedData = EnvSchema.safeParse(process.env)

if (!parsedData.success) {
    console.error("Environment varaibles are missing/invalid, exiting now...", parsedData.error)
    process.exit(1)
}

const env = parsedData.data

export default env
