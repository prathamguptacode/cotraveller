import express from 'express'
import { validateEmailController, validateUsernameController } from '../controllers/fieldValidationController'


const router = express.Router()

router.post('/email', validateEmailController)

router.post('/username', validateUsernameController)


export default router