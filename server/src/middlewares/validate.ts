import { ZodType } from "zod"
import xss from 'xss'
import { RequestHandler } from "express"

type ZodXssValidator = (schema: ZodType) => RequestHandler

export const zodXssValidator: ZodXssValidator = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)
        if (!result.success) return res.fail(400, "INVALID_BODY", "Request body was invalid")

        // ###FIX LATER as any declaration
        const { data } = result as any
        for (const key in data) {
            if (typeof data[key] === "string") data[key] = xss(data[key])
        }
        req.body = data
        next()
    }
}


