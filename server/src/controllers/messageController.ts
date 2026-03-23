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

    let conversationRecord = await ConversationRecord.findOne({ memberId: user._id, roomId: groupId })
    if (!conversationRecord) conversationRecord = await ConversationRecord.create({ memberId: user._id, roomId: groupId, lastReadAt: new Date(Date.now()) })


    // Pagination
    const MAX_LIMIT = 50
    const DEFAULT_LIMIT = 10

    // const DEFAULT_PAGE = 1

    const paginationParamsSchema = z.object({
        limit: z.coerce.number().catch(DEFAULT_LIMIT).transform(e => {
            const temp = Math.round(e)
            return Math.min(MAX_LIMIT, Math.max(DEFAULT_LIMIT, temp))
        }),
        // page: z.coerce.number().catch(DEFAULT_PAGE).transform(e => {
        //     const temp = Math.round(e)
        //     return Math.max(DEFAULT_PAGE, temp)
        // })
        cursor: z.string()
    })


    const parsedData = paginationParamsSchema.safeParse(req.query)


    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid params")

    let cursor = parsedData.data.cursor as string | undefined
    if (parsedData.data.cursor === 'default') cursor = undefined
    else if (!mongoose.Types.ObjectId.isValid(parsedData.data.cursor)) return res.fail(400, "BAD_REQUEST", "Invalid params")




    const { limit } = parsedData.data


    // const data = await Group.aggregate<{
    //     _id: string,
    //     messages: {
    //         _id: string,
    //         author: {
    //             _id: string,
    //             fullName: string
    //         },
    //         text: string,
    //         createdAt: Date,
    //     }[],
    //     members: {
    //         _id: string,
    //         fullName: string
    //     }[],
    //     title: string,
    //     owner: string

    //     unreadMessagesCount: number
    // }>([
    //     {
    //         $match: { _id: group._id }
    //     },
    //     {
    //         $project: {
    //             title: 1,
    //             member: 1,
    //             messages: 1,
    //             owner: 1
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: 'users',
    //             let: { ids: '$member' },
    //             pipeline: [
    //                 {
    //                     $match: { $expr: { $in: ['$_id', '$$ids'] } }
    //                 },
    //                 {
    //                     $project: {
    //                         fullName: 1
    //                     }
    //                 }
    //             ],
    //             as: 'members'
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: 'messages',
    //             let: { ids: '$messages' },
    //             pipeline: [
    //                 {
    //                     $match: { $expr: { $in: ['$_id', '$$ids'] } }
    //                 },
    //                 {
    //                     $sort: { createdAt: 1 }
    //                 },
    //                 {
    //                     $lookup: {
    //                         from: 'users',
    //                         let: { id: '$author' },
    //                         pipeline: [
    //                             {
    //                                 $match: { $expr: { $eq: ['$_id', '$$id'] } }
    //                             },
    //                             {
    //                                 $project: {
    //                                     fullName: 1,
    //                                 }
    //                             },
    //                         ],
    //                         as: 'author'
    //                     }
    //                 },
    //                 {
    //                     $unwind: '$author'
    //                 },
    //                 {
    //                     $project: {
    //                         author: 1,
    //                         text: 1,
    //                         createdAt: 1,
    //                     }
    //                 },

    //             ],
    //             as: 'messages'
    //         }
    //     },
    //     {
    //         $project: {
    //             member: 0
    //         }
    //     },
    //     {
    //         $facet: {
    //             unreadMessages: [
    //                 {
    //                     $unwind: '$messages'
    //                 },
    //                 {
    //                     $match: { 'messages.createdAt': { $gt: conversationRecord.lastReadAt } }
    //                 },
    //                 {
    //                     $count: 'unreadMessagesCount'
    //                 },

    //             ],
    //             details: []
    //         }
    //     },
    //     {
    //         $unwind: '$details'
    //     },
    //     {
    //         $unwind: {
    //             preserveNullAndEmptyArrays: true,
    //             path: '$unreadMessages'
    //             // ###REVIEW LATER FOR better understanding
    //         }
    //     },
    //     {
    //         $replaceWith: { $mergeObjects: ['$details', '$unreadMessages'] }
    //     },

    // ])

    const data = await Message.aggregate<{
        messages: {
            _id: string,
            author: {
                _id: string,
                fullName: string
            },
            text: string,
            createdAt: Date,
        }[],
        unreadMessagesCount: number
    }>([
        {
            $match: { roomId: group._id, _id: { $lt: new mongoose.Types.ObjectId(cursor) } }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $facet: {
                unreadMessages: [
                    {
                        $match: { createdAt: { $gt: conversationRecord.lastReadAt } }
                    },
                    {
                        $count: 'unreadMessagesCount'
                    }
                ],
                messages: [
                    {
                        $limit: limit + 1
                    }
                ]
            }
        },
        {
            $unwind: {
                path: '$unreadMessages',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                unreadMessagesCount: { $ifNull: ['$unreadMessages.unreadMessagesCount', 0] },
                messages: 1
            }
        }
    ])

    const conversationRecords = await ConversationRecord.find({ roomId: groupId })

    //data[0].messages can be [EMPTY] because cursor may be wrong or for any other weird reasons
    const hasNextPage = data[0].messages.length > limit
    data[0].messages.pop()
    const chat = data[0]
    const nextCursor = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1]._id : ''

    res.success(200, { pagination: { hasNextPage, nextCursor }, chat, conversationRecords })
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