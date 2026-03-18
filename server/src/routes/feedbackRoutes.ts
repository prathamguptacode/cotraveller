import express from 'express'
import { feedbackController } from '../controllers/feedbackController'

const route=express.Router()

route.post('/',feedbackController)

export default route