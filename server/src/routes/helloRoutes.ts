import express from 'express'

const router = express.Router()

router.get('/', (req, res) => res.success(200, { message: 'Hello World! Welcome to just cotraveller yc addition' }))

export default router
