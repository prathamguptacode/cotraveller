import express from 'express'
const router=express.Router()
import {addGroup} from '../controllers/groupController.mjs'
import {asyncHandler} from '../utils/asyncHandler.mjs'
import {viewGroup} from '../controllers/groupController.mjs'
import {viewGroupByFilter} from '../controllers/groupController.mjs'

export const addGroupRoute=router.post('/addgroup',asyncHandler(addGroup))

export const viewGroupRoute=router.get('/viewgroup',asyncHandler(viewGroup))

export const viewGroupByFilterRoute=router.get('/viewgroupbyfilter',asyncHandler(viewGroupByFilter))
