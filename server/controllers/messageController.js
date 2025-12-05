import xss from "xss"
import Message from "../models/Message.js"
import Group from "../models/groupSchema.js"


export const postMessageController = async (req, res) => {
    const user = req.user
    let text = req.body?.text
    let roomId = req.body?.roomId
    if (!text) return res.fail(400, "EMPTY_MESSAGE", "Message cannot be empty")
    if (!roomId) return res.fail(400, "INVALID_ROOM_ID", "Roomid cannot be empty")
    text = xss(text)
    roomId = xss(roomId)

    const group = await Group.findOne({ _id: roomId })
    if (!group) return res.fail(404, "GROUP_NOT_FOUND", "Group/chatRoom does not exist")


    const message = await Message.create({ text, roomId, author: user._id })
    group.messages.push(message._id)
    await group.save()

    return res.success(201, { message }, "Message posted successfully")
}
