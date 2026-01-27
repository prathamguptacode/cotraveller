import { CustomError } from '../utils/CustomError'
import User from '../models/User'
import { RequestHandler } from 'express'

// ###CHANGE or RETHINK LATER, these are great for UX , but might be bad for system design as they can cause load on server

export const validateEmailController: RequestHandler = async (req, res) => {
    const email = req.body?.email
    if (!email) return res.fail(400, "INVALID_EMAIL", "An email address is required")

    if (await User.exists({ email })) return res.fail(409, "EMAIL_TAKEN", "Email is already registered")
    res.success()

}

export const validateUsernameController: RequestHandler = async (req, res) => {
    const username = req.body?.username
    if(!username) return res.fail(400,"INVALID_USERNAME","A username is required")
    
    if(await User.exists({username})) return res.fail(409,"USERNAME_TAKEN","Username is already taken")
    
    res.success()
}
