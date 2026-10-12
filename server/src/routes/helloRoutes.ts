import express from 'express'

const router = express.Router()

router.get('/', (req, res) => res.send('Hello World! Welcome to just cotraveller yc addition'))

export default router