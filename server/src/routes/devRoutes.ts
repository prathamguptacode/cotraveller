import env from '@/config/env'
import { createChatRoom, createTrip } from '@/controllers/devController'
import asyncHandler from '@/middlewares/asyncHandler'
import express from 'express'

const router = express.Router()

router.use((req, res, next) => {
    if (env.NODE_ENV === 'development') next()
    else return res.fail(404, "NOT_FOUND")
})

router.post('/chats/rooms/:userId', asyncHandler(createChatRoom))
router.post('/trips', asyncHandler(createTrip))

export default router