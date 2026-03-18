import express from 'express'
import asyncHandler from '../middlewares/asyncHandler'
import { deleteOutgoingRequestController, fetchIncomingRequestsController, fetchJoinedGroupsController, uploadAvatarController } from '../controllers/userController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { checkMagicBytes, checkMulterUploadPath, multerUploadImage } from '@/middlewares/multer'

const router = express.Router()

router.use(authMiddleware)

router.get('/groups', asyncHandler(fetchJoinedGroupsController))

router.get('/inbox', asyncHandler(fetchIncomingRequestsController))

router.patch('/avatar', asyncHandler(checkMulterUploadPath), multerUploadImage.single('user-avatar'), asyncHandler(checkMagicBytes), asyncHandler(uploadAvatarController))

router.delete('/requests/:requestId', asyncHandler(deleteOutgoingRequestController))

export default router