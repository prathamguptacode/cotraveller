import express from 'express'
const router=express.Router()
import { addComment } from '../controllers/commentController.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { viewComment } from '../controllers/commentController.js'

//should have middle auth
export const addCommentRoute= router.post('/comment',asyncHandler(addComment))

export const viewCommentRoute= router.get('/viewcomment',asyncHandler(viewComment) )