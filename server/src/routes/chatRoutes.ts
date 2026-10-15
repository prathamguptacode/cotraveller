import { fetchChatMessages, fetchConversationRecords } from '@/controllers/chatController'
import asyncHandler from '@/middlewares/asyncHandler'
import authMiddleware from '@/middlewares/authMiddleware'
import express from 'express'

const router = express.Router()

router.use(authMiddleware)

router.get('/', asyncHandler(fetchChatMessages))
router.get('/conversation-records', asyncHandler(fetchConversationRecords))

export default router