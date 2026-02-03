import express from 'express'
const router = express.Router()
import { addGroup, viewRequest, acceptIncomingRequestController, declineIncomingRequestController, groupnumber, editGroup, addComment } from '../controllers/groupController'
import asyncHandler from '../middlewares/asyncHandler'
import { viewGroup } from '../controllers/groupController'
import { viewGroupByFilter } from '../controllers/groupController'
import { addRequest } from '../controllers/groupController'
import { verifyAccessToken } from '../middlewares/authMiddleware'
import groupSchema from '@/models/groupSchema'


//should have middleware
router.post('/addgroup', verifyAccessToken, asyncHandler(addGroup))

router.get('/:groupId', asyncHandler(viewGroup))//we never have to use this route

router.post('/viewgroupbyfilter', asyncHandler(viewGroupByFilter))//no middleware required

//adding people to group logic
//so the logic goes (like) first sees the post and (like) one so they request to join group
//after this reequest comes to members (or owner) of group
//if they accecpt the request then walah user is added as member and they all can talk now
//then group people can talk from socket io

router.get('/getnumbers', groupnumber)


router.use(verifyAccessToken)


router.get('/viewrequest', asyncHandler(viewRequest))// this is for member to see request

router.patch('/:groupId', asyncHandler(editGroup))

router.post('/:groupId/comments', asyncHandler(addComment))

router.post('/:groupId/requests', asyncHandler(addRequest))

router.post('/:groupId/requests/:requestId', asyncHandler(acceptIncomingRequestController))

router.delete('/:groupId/requests/:requestId', asyncHandler(declineIncomingRequestController))


router.param('groupId', async (req, res, next, groupId) => {
    try {
        const group = await groupSchema.findById(groupId)
        if (!group) return res.fail(404, "GROUP_NOT_FOUND", "The group does not exist")
        next()
    } catch (error) {
        console.error(error)
        return res.fail(500, "INTERNAL_ERROR", "Something went wrong !")
    }
})


export default router