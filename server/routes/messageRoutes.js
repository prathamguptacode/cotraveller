import express from 'express'
import { postMessageController } from '../controllers/messageController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', verifyAccessToken, asyncHandler(postMessageController))

export default router