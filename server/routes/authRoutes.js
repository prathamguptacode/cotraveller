import express from 'express'
import { signupController } from '../controllers/authController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { otpVerificationController } from '../controllers/authController.js'


const router = express.Router()

router.post('/signup', asyncHandler(signupController))

router.post('/signup/verify', asyncHandler(otpVerificationController))

export default router