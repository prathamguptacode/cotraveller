import xss from "xss"
import Message from "../models/Message"
import Group from "../models/groupSchema"
import User from "../models/User"
import mongoose from "mongoose"
import { RequestHandler } from "express"


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


    const data = await Group.aggregate([
        {
            $match: { _id: group._id }
        },
        {
            $project: {
                title: 1,
                member: 1,
                messages: 1
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
                            author:1,
                            text:1,
                            createdAt:1,
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
        }

    ])

    res.success(200, { group: data[0] })
}
