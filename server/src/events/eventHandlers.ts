import { RequestHandler } from "express"
import { eventBus } from "./eventBus"
import { sseRegistry } from "./sseRegistry"


const eventListeners: RequestHandler = (req, res, next) => {
    eventBus.removeAllListeners()
    eventBus.on('request_to_join_group:added', (memberIds: string[]) => {
        console.log(eventBus.listenerCount('request_to_join_group:added'))
        memberIds.forEach(id => {
            console.log('eventBusHandler has triggered for', id)
            const responseArray = sseRegistry.get(id)
            if (!responseArray) return
            responseArray.forEach(res => {
                res.write(`data: ${JSON.stringify({ event: "request_to_join_group:added", for: "Inbox" })} \n\n`)
            })
        });
    })
    next()
}
export default eventListeners

