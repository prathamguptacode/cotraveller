import express from 'express'
import { signupController, otpVerificationController, loginController } from '../controllers/authController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { zodXssValidator } from '../middlewares/validate.js'
import { LoginSchema, SignupSchema } from '../validators/userValidator.js'
import { refreshOtpController } from '../controllers/authController.js'
import { refreshTokenController } from '../controllers/authController.js'
import { logoutController } from '../controllers/authController.js'



const router = express.Router()

router.post('/signup', zodXssValidator(SignupSchema), asyncHandler(signupController))

router.post('/signup/verify', asyncHandler(otpVerificationController))

router.post('/signup/refresh', asyncHandler(refreshOtpController))

router.post('/login', zodXssValidator(LoginSchema), asyncHandler(loginController))

router.post('/refresh', asyncHandler(refreshTokenController))

//###LATER CSRF TOKEN shit and all--> https://www.reddit.com/r/learnprogramming/comments/go5l97/should_logout_in_websites_be_done_using_post/
router.post('/logout', logoutController)

export default router