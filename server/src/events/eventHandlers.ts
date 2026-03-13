import { eventBus } from "./eventBus"
import { sseRegistry } from "./sseRegistry"

eventBus.on('request_to_join_group:added', (memberIds: string[]) => {
    memberIds.forEach(id => {
        const responseArray = sseRegistry.get(id)
        if (!responseArray) return
        responseArray.forEach(res => {
            res.write(`data: ${JSON.stringify({ event: "request_to_join_group:added", for: "Inbox" })} \n\n`)
        })
    });
})

