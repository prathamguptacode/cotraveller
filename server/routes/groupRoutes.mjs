import express from 'express'
const router=express.Router()
import {addGroup} from '../controllers/groupController.mjs'
import {asyncHandler} from '../utils/asyncHandler.mjs'

export const addGroupRoute=router.post('/addgroup',asyncHandler(addGroup))
