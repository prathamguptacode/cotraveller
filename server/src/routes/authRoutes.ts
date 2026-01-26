import express from 'express'
import { signupController, otpVerificationController, loginController } from '../controllers/authController'
import  asyncHandler  from '../middlewares/asyncHandler'
import { zodXssValidator } from '../middlewares/validate'
import { LoginSchema, SignupSchema } from '../validators/userValidator'
import { resendOtpController } from '../controllers/authController'
import { refreshTokenController } from '../controllers/authController'
import { logoutController } from '../controllers/authController'



const router = express.Router()

router.post('/signup', zodXssValidator(SignupSchema), asyncHandler(signupController))

router.post('/signup/verify', asyncHandler(otpVerificationController))

router.post('/signup/resend', asyncHandler(resendOtpController))

router.post('/login', zodXssValidator(LoginSchema), asyncHandler(loginController))

router.post('/refresh', asyncHandler(refreshTokenController))

//###LATER CSRF TOKEN shit and all--> https://www.reddit.com/r/learnprogramming/comments/go5l97/should_logout_in_websites_be_done_using_post/
router.post('/logout', logoutController)

export default router