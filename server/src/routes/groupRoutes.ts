import express from 'express'
const router = express.Router()
import { addGroup, viewRequest, acceptIncomingRequestController, declineIncomingRequestController, groupnumber, editGroup, addComment } from '../controllers/groupController'
import asyncHandler from '../middlewares/asyncHandler'
import { viewGroup } from '../controllers/groupController'
import { viewGroupByFilter } from '../controllers/groupController'
import { addRequest } from '../controllers/groupController'
import { verifyAccessToken } from '../middlewares/authMiddleware'
import groupSchema from '@/models/groupSchema'


router.post('/addgroup', verifyAccessToken, asyncHandler(addGroup))


router.post('/viewgroupbyfilter', asyncHandler(viewGroupByFilter))//no middleware required

router.get('/live', groupnumber)

router.get('/viewrequest',verifyAccessToken, asyncHandler(viewRequest))// this is for member to see request

router.get('/:groupId', asyncHandler(viewGroup))//we never have to use this route

router.use(verifyAccessToken)


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