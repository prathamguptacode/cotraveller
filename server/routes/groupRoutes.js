import express from 'express'
const router=express.Router()
import {addGroup} from '../controllers/groupController.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {viewGroup} from '../controllers/groupController.js'
import {viewGroupByFilter} from '../controllers/groupController.js'

//should have middleware
export const addGroupRoute=router.post('/addgroup',asyncHandler(addGroup))

export const viewGroupRoute=router.get('/viewgroup',asyncHandler(viewGroup))

export const viewGroupByFilterRoute=router.get('/viewgroupbyfilter',asyncHandler(viewGroupByFilter))
