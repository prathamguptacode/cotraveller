import { resolveMx } from 'dns/promises'
import { CustomError } from '../utils/CustomError.js'
import User from '../models/User.js'

// ###CHANGE or RETHINK LATER, these are great for UX , but might be bad for system design as they can cause load on server

export const validateEmailController = async (req, res) => {
    const email = req.body?.email
    if (!email) return res.fail(400, "INVALID_EMAIL", "An email address is required")

    const domain = email.split('@')[1]

    try {
        const mxRecords = await resolveMx(domain)
        if (!mxRecords) return res.fail(400, "INVALID_EMAIL", "Must be an email")
    } catch (error) {
        if (error.code == "ENODATA" || error.code == "ENOTFOUND") return res.fail(400, "INVALID_EMAIL", "Must be an email")
        throw new CustomError(500, "MX_RECORDS")
    }

    if (await User.exists({ email })) return res.fail(409, "EMAIL_TAKEN", "Email is already registered")

    res.success()

}

export const validateUsernameController = async (req, res) => {
    const username = req.body?.username
    if(!username) return res.fail(400,"INVALID_USERNAME","A username is required")
    
    if(await User.exists({username})) return res.fail(409,"USERNAME_TAKEN","Username is already taken")
    
    res.success()
}
