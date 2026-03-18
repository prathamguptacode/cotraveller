import express from 'express'
import { fetchGroupChatController, postMessageController, updateLastReadAtController } from '@/controllers/messageController'
import asyncHandler from '@/middlewares/asyncHandler'
import { authMiddleware } from '@/middlewares/authMiddleware'

const router = express.Router()

router.use(authMiddleware)

router.post('/', asyncHandler(postMessageController))

router.get('/:groupId', asyncHandler(fetchGroupChatController))

router.patch('/:groupId',asyncHandler(updateLastReadAtController))

export default router