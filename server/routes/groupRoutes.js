import express from 'express'
const router = express.Router()
import { addGroup, leaveGroup, viewRequest, addMember, memberInfo, acceptIncomingRequestController, declineIncomingRequestController } from '../controllers/groupController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { viewGroup } from '../controllers/groupController.js'
import { viewGroupByFilter } from '../controllers/groupController.js'
import { addRequest } from '../controllers/groupController.js'
import { verifyAccessToken } from '../middlewares/authMiddleware.js'

//should have middleware
router.post('/addgroup', verifyAccessToken, asyncHandler(addGroup))

router.get('/viewgroup', asyncHandler(viewGroup))//we never have to use this route

router.post('/viewgroupbyfilter', asyncHandler(viewGroupByFilter))//no middleware required

//adding people to group logic
//so the logic goes (like) first sees the post and (like) one so they request to join group
//after this reequest comes to members (or owner) of group
//if they accecpt the request then walah user is added as member and they all can talk now
//then group people can talk from socket io

//to get member info i need this route
router.get('/getname', memberInfo)


//should have middle ware
router.use(verifyAccessToken)

router.post('/addrequest', asyncHandler(addRequest))

router.get('/viewrequest', asyncHandler(viewRequest))// this is for member to see request

router.post('/addmember', asyncHandler(addMember))

router.delete('/leavegroup', asyncHandler(leaveGroup))

router.post('/:groupId/requests/:requestId', asyncHandler(acceptIncomingRequestController))

router.delete('/:groupId/requests/:requestId', asyncHandler(declineIncomingRequestController))


export default router