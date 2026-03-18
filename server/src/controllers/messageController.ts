import xss from "xss"
import Message from "../models/Message"
import Group from "../models/Group"
import User from "../models/User"
import { RequestHandler } from "express"
import ConversationRecord from "@/models/ConversationRecord"
import { Types } from "mongoose"


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
    if (!groupId) return res.fail(400, "BAD_REQUEST", "Group id waas missing")

    const group = await Group.findOne({ _id: groupId, member: user._id })
    if (!group) return res.fail(403, "NOT_FOUND", "The user is not associated to the group")

    let conversationRecord = await ConversationRecord.findOne({ memberId: user._id, roomId: groupId })
    if (!conversationRecord) conversationRecord = await ConversationRecord.create({ memberId: user._id, roomId: groupId, lastReadAt: new Date(Date.now()) })
    console.log(conversationRecord, typeof conversationRecord.lastReadAt)

    const data = await Group.aggregate<{
        _id: string,
        messages: {
            _id: string,
            author: {
                _id: string,
                fullName: string
            },
            text: string,
            createdAt: Date,
        }[],
        members: {
            _id: string,
            fullName: string
        }[],
        title: string,
        owner: Types.ObjectId

        unreadMessagesCount: number
    }>([
        {
            $match: { _id: group._id }
        },
        {
            $project: {
                title: 1,
                member: 1,
                messages: 1,
                owner: 1
            }
        },
        {
            $lookup: {
                from: 'users',
                let: { ids: '$member' },
                pipeline: [
                    {
                        $match: { $expr: { $in: ['$_id', '$$ids'] } }
                    },
                    {
                        $project: {
                            fullName: 1
                        }
                    }
                ],
                as: 'members'
            }
        },
        {
            $lookup: {
                from: 'messages',
                let: { ids: '$messages' },
                pipeline: [
                    {
                        $match: { $expr: { $in: ['$_id', '$$ids'] } }
                    },
                    {
                        $sort: { createdAt: 1 }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            let: { id: '$author' },
                            pipeline: [
                                {
                                    $match: { $expr: { $eq: ['$_id', '$$id'] } }
                                },
                                {
                                    $project: {
                                        fullName: 1,
                                    }
                                },
                            ],
                            as: 'author'
                        }
                    },
                    {
                        $unwind: '$author'
                    },
                    {
                        $project: {
                            author: 1,
                            text: 1,
                            createdAt: 1,
                        }
                    },

                ],
                as: 'messages'
            }
        },
        {
            $project: {
                member: 0
            }
        },
        {
            $facet: {
                unreadMessages: [
                    {
                        $unwind: '$messages'
                    },
                    {
                        $match: { 'messages.createdAt': { $gt: conversationRecord.lastReadAt } }
                    },
                    {
                        $count: 'unreadMessagesCount'
                    },

                ],
                details: []
            }
        },
        {
            $unwind: '$details'
        },
        {
            $unwind: {
                preserveNullAndEmptyArrays: true,
                path: '$unreadMessages'
                // ###REVIEW LATER FOR better understanding
            }
        },
        {
            $replaceWith: { $mergeObjects: ['$details', '$unreadMessages'] }
        },

    ])

    let conversationRecords = await ConversationRecord.find({ roomId: groupId })



    res.success(200, { group: data[0], conversationRecords })
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