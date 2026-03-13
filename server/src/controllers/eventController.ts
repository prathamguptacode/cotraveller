import { sseRegistry } from "@/events/sseRegistry"
import { RequestHandler } from "express"

export const mainSSEController: RequestHandler = (req, res) => {
    const userId = req.user._id.toString()
    console.log('Hello user', req.user)

    const prev = sseRegistry.get(userId)
    if (prev) sseRegistry.set(userId, new Set(prev).add(res))
    else sseRegistry.set(userId, new Set([res]))

    req.on('close', () => {
        console.log(req.user)
        sseRegistry.get(userId)?.delete(res)
        console.log('Bye Bye user sseRegistry entry')
    })
}