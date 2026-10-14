import { fetchDMChats, fetchTripChats } from '@/controllers/userController'
import asyncHandler from '@/middlewares/asyncHandler'
import express from 'express'

const router = express.Router()

router.get('/me/chats', asyncHandler(fetchDMChats))
router.get('/me/trips/chats', asyncHandler(fetchTripChats))

export default router