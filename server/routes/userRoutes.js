import express from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { fetchIncomingRequestsController, fetchJoinedGroupsController } from '../controllers/userController.js'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/groups', verifyAccessToken, asyncHandler(fetchJoinedGroupsController))

router.get('/inbox',verifyAccessToken,asyncHandler(fetchIncomingRequestsController))

export default router