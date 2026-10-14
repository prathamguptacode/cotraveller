import { fetchChatMessages, fetchConversationRecords } from '@/controllers/chatController'
import asyncHandler from '@/middlewares/asyncHandler'
import express from 'express'

const router = express.Router()

router.get('/', asyncHandler(fetchChatMessages))
router.get('/conversation-records', asyncHandler(fetchConversationRecords))

export default router