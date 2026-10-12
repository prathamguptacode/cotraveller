import { fetchChatMessages } from '@/controllers/chatController'
import asyncHandler from '@/middlewares/asyncHandler'
import express from 'express'

const router = express.Router()

router.get('/', asyncHandler(fetchChatMessages))

export default router