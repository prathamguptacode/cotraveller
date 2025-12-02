import express from 'express'
import { signupController, otpVerificationController, loginController } from '../controllers/authController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { zodXssValidator } from '../middlewares/validate.js'
import { LoginSchema, SignupSchema } from '../validators/userValidator.js'



const router = express.Router()

router.post('/signup', zodXssValidator(SignupSchema), asyncHandler(signupController))

router.post('/signup/verify', asyncHandler(otpVerificationController))

router.post('/login', zodXssValidator(LoginSchema), asyncHandler(loginController))

export default router