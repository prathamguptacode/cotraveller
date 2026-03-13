import express from 'express'
import  asyncHandler  from '../middlewares/asyncHandler'
import { deleteOutgoingRequestController, fetchIncomingRequestsController, fetchJoinedGroupsController, fetchOutgoingRequestsController } from '../controllers/userController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = express.Router()

router.use(authMiddleware)

router.get('/groups', asyncHandler(fetchJoinedGroupsController))

router.get('/inbox', asyncHandler(fetchIncomingRequestsController))

router.get('/outbox', asyncHandler(fetchOutgoingRequestsController))

router.delete('/requests/:requestId', asyncHandler(deleteOutgoingRequestController))

export default router