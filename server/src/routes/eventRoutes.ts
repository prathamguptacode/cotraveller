import { sseRegistry } from '@/events/sseRegistry'
import { authMiddleware } from '@/middlewares/authMiddleware'
import express, { type Request, type Response } from 'express'


const router = express.Router()

router.get('/', authMiddleware, (req, res) => {
    const userId = req.user._id.toString()
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Content-Type', 'text/event-stream')
    res.flushHeaders()

    const prev = sseRegistry.get(userId)
    if (!prev) sseRegistry.set(userId, new Set([res]))
    else sseRegistry.set(userId, new Set([...prev, res]))
    keepAliveConnection(req, res)

    req.on('close', () => {
        sseRegistry.delete(userId)
    })
})

const keepAliveConnection = (req: Request, res: Response) => {
    res.write(`data: ${JSON.stringify('keep-alive')}\n\n`)
    const interval = setInterval(() => {
        res.write(`data: ${JSON.stringify('keep-alive')}\n\n`)
    }, 40000);
    req.on('close', () => {
        clearTimeout(interval)
    })
}
export default router