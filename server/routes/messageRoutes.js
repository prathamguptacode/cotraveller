import express from 'express'
import { fetchGroupChatController, postMessageController } from '../controllers/messageController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', verifyAccessToken, asyncHandler(postMessageController))

router.get('/:groupId', verifyAccessToken, asyncHandler(fetchGroupChatController))
export default router