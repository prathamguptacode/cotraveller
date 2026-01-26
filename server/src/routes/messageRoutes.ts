import express from 'express'
import { fetchGroupChatController, postMessageController } from '../controllers/messageController'
import  asyncHandler  from '../middlewares/asyncHandler'
import { verifyAccessToken } from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/', verifyAccessToken, asyncHandler(postMessageController))

router.get('/:groupId', verifyAccessToken, asyncHandler(fetchGroupChatController))
export default router