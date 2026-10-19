import { createChatRoom, fetchChatRoom, fetchDMChats, fetchUserTrips } from '@/controllers/userController'
import asyncHandler from '@/middlewares/asyncHandler'
import authMiddleware from '@/middlewares/authMiddleware'
import express from 'express'

const router = express.Router()

router.use(authMiddleware)

router.get('/me/dms', asyncHandler(fetchDMChats))
router.get('/me/trips', asyncHandler(fetchUserTrips))
router.get('/:userId/chats', asyncHandler(fetchChatRoom))
router.post('/:userId/chats', asyncHandler(createChatRoom))

export default router