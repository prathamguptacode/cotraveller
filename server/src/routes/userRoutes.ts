import express from 'express'
import  asyncHandler  from '../middlewares/asyncHandler'
import { deleteOutgoingRequestController, fetchIncomingRequestsController, fetchJoinedGroupsController, fetchOutgoingRequestsController } from '../controllers/userController'
import { verifyAccessToken } from '../middlewares/authMiddleware'

const router = express.Router()

router.use(verifyAccessToken)

router.get('/groups', asyncHandler(fetchJoinedGroupsController))

router.get('/inbox', asyncHandler(fetchIncomingRequestsController))

router.get('/outbox', asyncHandler(fetchOutgoingRequestsController))

router.delete('/requests/:requestId', asyncHandler(deleteOutgoingRequestController))

export default router