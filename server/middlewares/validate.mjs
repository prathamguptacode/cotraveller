import { safeParse } from "zod"
import xss from 'xss'

export const zodXssValidator = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)
        if (!result.success) return res.fail(400, "INVALID_BODY", "Request body was invalid")

        for (const key in result) {
            if (typeof result[key] === "string") result[key] = xss(result[key])
        }
        req.body = result
        next()
    }
}

