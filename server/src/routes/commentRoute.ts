import express from 'express'
const router = express.Router()
import { addComment } from '../controllers/commentController'
import  asyncHandler  from '../middlewares/asyncHandler'
import { viewComment } from '../controllers/commentController'
import { verifyAccessToken } from '../middlewares/authMiddleware'

//should have middle auth
router.post('/comment', verifyAccessToken, asyncHandler(addComment))

export default router