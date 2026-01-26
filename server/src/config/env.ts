import 'dotenv/config'
import * as z from 'zod'


const EnvSchema = z.object({
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    PORT: z.coerce.number().int().min(1000).default(8080),
    MONGO_URI: z.string(),
    EMAIL_ID: z.string(),
    EMAIL_PASS: z.string(),
    CLOUD_NAME: z.string(),
    CLOUD_API_KEY: z.string(),
    CLOUD_API_SECRET: z.string(),
    CLIENT_URL: z.string(),
    MODE: z.enum(["development", "production"]),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REDIRECT_URI: z.string(),
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