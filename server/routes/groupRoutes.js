import express from 'express'
const router=express.Router()
import {addGroup, addMember, leaveGroup, viewRequest} from '../controllers/groupController.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {viewGroup} from '../controllers/groupController.js'
import {viewGroupByFilter} from '../controllers/groupController.js'
import { addRequest } from '../controllers/groupController.js'

//should have middleware
router.post('/addgroup',asyncHandler(addGroup))

router.get('/viewgroup',asyncHandler(viewGroup))

router.get('/viewgroupbyfilter',asyncHandler(viewGroupByFilter))

//adding people to group logic
//so the logic goes (like) first sees the post and (like) one so they request to join group
//after this reequest comes to members (or owner) of group
//if they accecpt the request then walah user is added as member and they all can talk now
//then group people can talk from socket io

//should have middle ware
router.post('/addrequest',addRequest)
router.get('/viewrequest',viewRequest)
router.post('/addmember',addMember)
router.delete('/leavegroup',leaveGroup)

export default router