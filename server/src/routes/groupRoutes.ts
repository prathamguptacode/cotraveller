import express from 'express'
const router = express.Router()
import { addGroup, viewRequest, memberInfo, acceptIncomingRequestController, declineIncomingRequestController, groupnumber, editGroup } from '../controllers/groupController'
import asyncHandler from '../middlewares/asyncHandler'
import { viewGroup } from '../controllers/groupController'
import { viewGroupByFilter } from '../controllers/groupController'
import { addRequest } from '../controllers/groupController'
import { verifyAccessToken } from '../middlewares/authMiddleware'

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

router.get('/getnumbers', groupnumber)

//should have middle ware
router.use(verifyAccessToken)

router.post('/addrequest', asyncHandler(addRequest))

router.get('/viewrequest', asyncHandler(viewRequest))// this is for member to see request


router.post('/:groupId/requests/:requestId', asyncHandler(acceptIncomingRequestController))

router.delete('/:groupId/requests/:requestId', asyncHandler(declineIncomingRequestController))

router.post('/editgroup', asyncHandler(editGroup))


export default router