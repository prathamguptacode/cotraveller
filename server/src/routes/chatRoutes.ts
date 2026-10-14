import env from '@/config/env'
import { createChatRoom, fetchChatMessages, fetchConversationRecords } from '@/controllers/chatController'
import asyncHandler from '@/middlewares/asyncHandler'
import express from 'express'

const router = express.Router()

router.get('/', asyncHandler(fetchChatMessages))
router.get('/conversation-records', asyncHandler(fetchConversationRecords))

if (env.NODE_ENV === 'development') router.post('/room/:userId', asyncHandler(createChatRoom))

export default router