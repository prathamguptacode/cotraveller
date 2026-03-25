import express from 'express'
const router = express.Router()
import { addGroup, viewRequest, acceptIncomingRequestController, declineIncomingRequestController, groupnumber, editGroup, addComment } from '../controllers/groupController'
import asyncHandler from '../middlewares/asyncHandler'
import { viewGroup } from '../controllers/groupController'
import { viewGroupByFilter } from '../controllers/groupController'
import { addRequest } from '../controllers/groupController'
import { authMiddleware } from '../middlewares/authMiddleware'
import Group from '@/models/Group'


//should have middleware

router.post('/', authMiddleware, asyncHandler(addGroup))

router.get('/viewgroupbyfilter', asyncHandler(viewGroupByFilter))//no middleware required

router.get('/live', groupnumber)

router.get('/:groupId', asyncHandler(viewGroup))//we never have to use this route

router.use(authMiddleware)


router.patch('/:groupId', asyncHandler(editGroup))

router.post('/:groupId/comments', asyncHandler(addComment))

router.post('/:groupId/requests', asyncHandler(addRequest))

router.post('/:groupId/requests/:requestId', asyncHandler(acceptIncomingRequestController))

router.delete('/:groupId/requests/:requestId', asyncHandler(declineIncomingRequestController))


router.param('groupId', async (req, res, next, groupId) => {
    try {
        const group = await Group.findById(groupId)
        if (!group) return res.fail(404, "GROUP_NOT_FOUND", "The group does not exist")
        next()
    } catch (error) {
        console.error(error)
        return res.fail(500, "INTERNAL_ERROR", "Something went wrong !")
    }
})


export default router