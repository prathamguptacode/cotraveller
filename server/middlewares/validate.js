import { safeParse } from "zod"
import xss from 'xss'

export const zodXssValidator = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)
        if (!result.success) return res.fail(400, "INVALID_BODY", "Request body was invalid")

        const { data } = result
        for (const key in data) {
            if (typeof data[key] === "string") data[key] = xss(data[key])
        }
        req.body = data
        next()
    }
}

