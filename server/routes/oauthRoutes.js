import express from 'express'
import { githubOAuthCallback, googleOAuthCallback, redirectToGithubOAuth, redirectToGoogleOAuth } from '../controllers/oauthController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router()

router.get('/google', redirectToGoogleOAuth)

router.get('/google/callback', asyncHandler(googleOAuthCallback))

router.get('/github', redirectToGithubOAuth)

router.get('/github/callback', asyncHandler(githubOAuthCallback))

export default router