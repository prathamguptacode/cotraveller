import express from 'express'
import asyncHandler from '../middlewares/asyncHandler'
import { deleteOutgoingRequestController, fetchInboxStatusController, fetchIncomingRequestsController, fetchJoinedGroupsController, removeAvatarController, uploadAvatarController } from '../controllers/userController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { checkMagicBytes, checkMulterUploadPath, multerUploadImage } from '@/middlewares/multer'

const router = express.Router()

router.use(authMiddleware)

router.get('/groups', asyncHandler(fetchJoinedGroupsController))

router.get('/inbox', asyncHandler(fetchIncomingRequestsController))

router.get('/inbox/status',asyncHandler(fetchInboxStatusController))

router.route('/avatar')
    .patch(asyncHandler(checkMulterUploadPath), multerUploadImage.single('user-avatar'), asyncHandler(checkMagicBytes), asyncHandler(uploadAvatarController))
    .delete(asyncHandler(removeAvatarController))

router.delete('/requests/:requestId', asyncHandler(deleteOutgoingRequestController))

export default router