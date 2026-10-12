import { login, logout, refreshToken, signup } from '@/controllers/authController'
import asyncHandler from '@/middlewares/asyncHandler'
import express from 'express'

const router = express.Router()

router.post('/signup', asyncHandler(signup))
router.post('/login', asyncHandler(login))
router.post('/refresh', asyncHandler(refreshToken))
router.post('/logout', logout)

export default router