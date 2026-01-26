import express from 'express'
const router=express.Router()
import { addComment } from '../controllers/commentController.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { viewComment } from '../controllers/commentController.js'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'

//should have middle auth
router.post('/comment',verifyAccessToken,asyncHandler(addComment))

export default router