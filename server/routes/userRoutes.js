import express from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { acceptIncomingRequestController, deleteIncomingRequestController, deleteOutgoingRequestController, fetchIncomingRequestsController, fetchJoinedGroupsController, fetchOutgoingRequestsController } from '../controllers/userController.js'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(verifyAccessToken)

router.get('/groups', asyncHandler(fetchJoinedGroupsController))

router.get('/inbox', asyncHandler(fetchIncomingRequestsController))

router.get('/outbox', asyncHandler(fetchOutgoingRequestsController))

router.delete('/requests/:requestId', asyncHandler(deleteOutgoingRequestController))

router.delete('/dbrequests/:dbrequestId', asyncHandler(deleteIncomingRequestController))

router.post('/dbrequests/:dbrequestId',asyncHandler(acceptIncomingRequestController))

export default router