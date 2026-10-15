import ChatMessage from "@/models/ChatMessage";
import ConversationRecord from "@/models/ConversationRecord";
import { RequestHandler } from "express";
import mongoose from "mongoose";
import { z } from 'zod'

const MAX_LIMIT = 50
const MIN_LIMIT = 10

const FetchChatMessagesQuerySchema = z.object({
    roomId: z.string(),
    limit: z.coerce.number().catch(MIN_LIMIT).transform(e => {
        const temp = Math.round(e)
        return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, temp))
    }),
    cursor: z.string()
})

export const fetchChatMessages: RequestHandler = async (req, res) => {
    const parsedData = FetchChatMessagesQuerySchema.safeParse(req.query)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid params")

    const { limit, roomId } = parsedData.data

    // Check if user is part of room
    if (!await ConversationRecord.exists({ room: roomId, member: req.user._id })) return res.fail(403, "FORBIDDEN", "You cannot access this")

    // Refining cursor
    let cursor = parsedData.data.cursor as string | undefined
    if (parsedData.data.cursor === 'default') cursor = undefined
    else if (!mongoose.Types.ObjectId.isValid(parsedData.data.cursor)) return res.fail(400, "BAD_REQUEST", "Invalid params")


    const messages = await ChatMessage.aggregate([
        {
            $match: { room: new mongoose.Types.ObjectId(roomId), _id: { $lt: new mongoose.Types.ObjectId(cursor) } }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $limit: limit + 1
        },
        {
            $lookup: {
                from: 'users',
                let: { userId: '$author' },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ['$_id', '$$userId'] } }
                    },
                    {
                        $project: {
                            email: 1
                        }
                    }

                ],
                as: 'author'
            }
        },
        {
            $unwind: '$author'
        }
    ])

    const hasNextPage = messages.length > limit
    hasNextPage && messages.pop()
    messages.reverse()
    const nextCursor = messages.length > 0 ? messages[0]._id : ''

    res.success(200, { messages, pagination: { hasNextPage, nextCursor } })

}


const FetchConversationRecordsSchema = z.object({
    roomId: z.string()
})

export const fetchConversationRecords: RequestHandler = async (req, res) => {
    const parsedData = FetchConversationRecordsSchema.safeParse(req.query)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid params")

    const { roomId } = parsedData.data

    const conversationRecords = await ConversationRecord.find({ room: roomId })

    return res.success(200, { conversationRecords })
}