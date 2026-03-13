import express from 'express'
import { fetchGroupChatController, postMessageController } from '../controllers/messageController'
import  asyncHandler  from '../middlewares/asyncHandler'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/', authMiddleware, asyncHandler(postMessageController))

router.get('/:groupId', authMiddleware, asyncHandler(fetchGroupChatController))
export default router