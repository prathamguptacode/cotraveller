import { fetchDMChats } from '@/controllers/userController'
import asyncHandler from '@/middlewares/asyncHandler'
import express from 'express'

const router = express.Router()

router.get('/me/chats', asyncHandler(fetchDMChats))

export default router