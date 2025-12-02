import express from 'express'
import { googleOAuthCallback, redirectToGoogleOAuth } from '../controllers/oauthController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router()

router.get('/google',redirectToGoogleOAuth)

router.get('/google/callback',asyncHandler(googleOAuthCallback))

export default router