import xss from "xss"
import Message from "../models/Message"
import Group from "../models/Group"
import User from "../models/User"
import { RequestHandler } from "express"
import ConversationRecord from "@/models/ConversationRecord"
import mongoose, { Types } from "mongoose"
import { z } from "zod"


export const postMessageController: RequestHandler = async (req, res) => {
    const user = req.user
    let text = req.body?.text
    let roomId = req.body?.roomId
    if (!text) return res.fail(400, "EMPTY_MESSAGE", "Message cannot be empty")
    if (!roomId) return res.fail(400, "INVALID_ROOM_ID", "Roomid cannot be empty")
    text = xss(text)
    roomId = xss(roomId)


    const group = await Group.findOne({ _id: roomId })
    if (!group) return res.fail(404, "GROUP_NOT_FOUND", "Group/chatRoom does not exist")

    if (!await User.findOne({ _id: user._id, memberGroup: roomId })) return res.fail(403, "UNAUTHORIZED", "You cannot message in a group you are not a part of")


    const message = await Message.create({ text, roomId, author: user._id })
    group.messages.push(message._id)
    await group.save()

    return res.success(201, { message }, "Message posted successfully")
}

export const fetchGroupChatController: RequestHandler = async (req, res) => {
    const user = req.user
    const groupId = req.params?.groupId
    if (!groupId) return res.fail(400, "BAD_REQUEST", "Group id was missing")

    const group = await Group.findOne({ _id: groupId, member: user._id })
    if (!group) return res.fail(403, "FORBIDDEN", "The user is not associated to the group")


    // Pagination
    const MAX_LIMIT = 50
    const DEFAULT_LIMIT = 10

    const paginationParamsSchema = z.object({
        limit: z.coerce.number().catch(DEFAULT_LIMIT).transform(e => {
            const temp = Math.round(e)
            return Math.min(MAX_LIMIT, Math.max(DEFAULT_LIMIT, temp))
        }),
        cursor: z.string()
    })


    const parsedData = paginationParamsSchema.safeParse(req.query)


    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid params")

    let cursor = parsedData.data.cursor as string | undefined
    if (parsedData.data.cursor === 'default') cursor = undefined
    else if (!mongoose.Types.ObjectId.isValid(parsedData.data.cursor)) return res.fail(400, "BAD_REQUEST", "Invalid params")


    const { limit } = parsedData.data

    const messages = await Message.find({ roomId: groupId }).sort({ createdAt: -1 }).limit(limit + 1).populate({path:'author',select:'fullName'})

    const hasNextPage = messages.length > limit
    messages.pop()
    messages.reverse()
    const nextCursor = messages.length > 0 ? messages[0]._id : ''

    res.success(200, { messages, pagination: { hasNextPage, nextCursor } })
}

export const updateLastReadAtController: RequestHandler = async (req, res) => {
    const user = req.user
    const { groupId } = req.params
    if (typeof groupId != 'string' || !groupId) return res.fail(400, "BAD_REQUEST", "Invalid groupId")
    // ###LATER probably change this to instead directly get converstaionId from the frontend or somewhere, so that it doesnt have to queried again and again
    let conversationRecord = await ConversationRecord.findOne({ memberId: user._id, roomId: groupId })
    if (!conversationRecord) conversationRecord = await ConversationRecord.create({ memberId: user._id, roomId: groupId })

    conversationRecord.lastReadAt = new Date(Date.now())
    await conversationRecord.save()


    return res.success(200, { conversationRecord })
}