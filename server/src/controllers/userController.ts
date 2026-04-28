import { RequestHandler } from "express"
import Group from "../models/Group"
import User from "../models/User"
import JoinRequest from "@/models/JoinRequest"
import ConversationRecord from "@/models/ConversationRecord"
import cloudinary from "@/config/cloudinary"
import env from "@/config/env"
import fs from 'fs/promises'

export const fetchJoinedGroupsController: RequestHandler = async (req, res) => {
    const user = req.user

    const groups = await User.aggregate<{ title: string, _id: string, lastMessage?: { author: string, text: string, createdAt: Date } }>([
        {
            $match: { _id: user._id }
        },
        {
            $project: {
                memberGroup: 1
            }
        },
        {
            $unwind: '$memberGroup'
        },
        {
            $lookup: {
                from: 'groups',
                localField: 'memberGroup',
                foreignField: '_id',
                as: 'memberGroup'
            }
        },
        {
            $project: {
                memberGroup: {
                    title: 1,
                    _id: 1,
                    messages: 1
                }
            }
        },
        {
            $unwind: '$memberGroup'
        },
        {
            $lookup: {
                from: 'conversation_records',
                let: { groupId: '$memberGroup._id', userId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $and: [{ $expr: { $eq: ['$memberId', '$$userId'] } }, { $expr: { $eq: ['$roomId', '$$groupId'] } }]
                        }
                    },
                ],
                as: 'conversationRecord'
            }
        },
        {
            $unwind: '$conversationRecord'
        },
        {
            $lookup: {
                from: 'messages',
                let: { roomId: '$memberGroup._id', lastReadAt: '$conversationRecord.lastReadAt' },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ['$roomId', '$$roomId'] } }
                    },
                    {
                        $facet: {
                            unreadMessages: [
                                {
                                    $match: { $expr: { $gt: ['$createdAt', '$$lastReadAt'] } },
                                },
                                {
                                    $count: 'unreadMessagesCount'
                                }
                            ],
                            lastMessage: [
                                {
                                    $sort: { createdAt: -1 }
                                },
                                {
                                    $limit: 1
                                },
                                {
                                    $lookup: {
                                        from: 'users',
                                        localField: 'author',
                                        foreignField: '_id',
                                        as: 'author'
                                    }
                                },
                                {
                                    $project: {
                                        author: '$author.fullName',
                                        text: 1,
                                        createdAt: 1,
                                        _id: 0
                                    }
                                },
                                {
                                    $unwind: '$author'
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
                        $unwind: {
                            path: '$lastMessage',
                            preserveNullAndEmptyArrays: true
                        }
                    }


                ],
                as: 'lastMessageAndStats'
            }
        },
        {
            $unwind: {
                path: '$lastMessageAndStats',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $replaceWith: { $mergeObjects: ['$memberGroup', '$lastMessageAndStats'] }
        },
        {
            $project: {
                unreadMessagesCount: { $ifNull: ['$unreadMessages.unreadMessagesCount', 0] },
                _id: 1,
                title: 1,
                lastMessage: 1
            }
        },
        {
            $sort: { 'lastMessage.createdAt': -1 }
        }
    ])
    res.success(200, { groups }, "GREAT SHIT NGL!")
}

export const fetchIncomingRequestsController: RequestHandler = async (req, res) => {
    const user = req.user

    const requests = await JoinRequest.aggregate([
        {
            $match: {
                groupId: { $in: user.groups }
            }
        },
        {
            $lookup: {
                from: 'users',
                let: { requesterId: '$requesterId' },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ['$_id', '$$requesterId'] } }
                    },
                    {
                        $project: {
                            fullName: 1,
                            avatar: 1,
                            email: 1,
                            createdAt: 1,
                            username: 1,
                            memberGroup: 1
                        }
                    }
                ],
                as: 'requester'
            }
        },
        {
            $lookup: {
                from: 'groups',
                let: { groupId: '$groupId' },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ['$_id', '$$groupId'] } }
                    },
                    {
                        $project: {
                            title: 1,
                            members: '$member',
                        }
                    }
                ],
                as: 'group'
            }
        },
        {
            $unwind: '$requester'
        },
        {
            $unwind: '$group'
        },
        {
            $sort: { createdAt: -1 }
        }
    ])
    res.success(200, { requests })

}

export const fetchInboxStatusController: RequestHandler = async (req, res) => {
    const user = req.user

    const groupJoinRequestsCount = await JoinRequest.countDocuments({ groupId: { $in: user.groups } })

    res.success(200, { groupJoinRequestsCount })
}


export const deleteOutgoingRequestController: RequestHandler = async (req, res) => {
    const user = req.user
    const requestId = req.params?.requestId
    if (!requestId) return res.fail(400, "BAD_REQUEST", "Request id was missing")

    if (!await User.findOne({ _id: user._id, requests: requestId })) return res.fail(400, "REQUEST_NOT_FOUND", "The request does not exist")

    await User.updateOne({ _id: user._id }, { $pull: { requests: requestId } })
    await Group.updateOne({ _id: requestId }, { $pull: { requests: user._id } })

    res.sendStatus(204)
}


export const uploadAvatarController: RequestHandler = async (req, res) => {
    const file = req.file
    const user = req.user
    if (!file) return res.fail(400, "BAD_REQUEST", "File is invalid/empty")

    let options: {} | {
        public_id: string,
        invalidate: true,
        overwrite: true
    } = {}

    if (user.avatar.publicId) options = {
        public_id: user.avatar.publicId,
        invalidate: true,
        overwrite: true
    }

    const { public_id: publicId, version } = await cloudinary.uploader.upload(file.path, {
        asset_folder: env.MODE,
        use_filename: true,
        unique_filename: true,
        resource_type: 'auto',
        ...options

    })

    await User.updateOne({ _id: user._id }, { $set: { avatar: { publicId, version } } })

    try {
        await fs.unlink(file.path)
    } catch (error) {
        console.error("File was not unlinked")
    }

    return res.success(201, { publicId, version }, "User Avatar upload successful")
}



export const removeAvatarController: RequestHandler = async (req, res) => {
    const { publicId } = req.user.avatar
    if (!publicId) return res.fail(404, "RESOURCE_NOT_FOUND", "You do not have an avatar")

    const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
    })

    await User.updateOne({ _id: req.user._id }, { $set: { avatar: { publicId: '', version: 0 } } })

    res.success(204, { result }, "Removal successful")
}
