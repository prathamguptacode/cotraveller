import ChatRoom from "@/models/ChatRoom";
import ConversationRecord from "@/models/ConversationRecord";
import User from "@/models/User";
import { RequestHandler } from "express";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import { z } from 'zod'

// There will definetly be more conversation-records as compared to chat-rooms, so lets go..
export const fetchDMChats: RequestHandler = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    const chats = await ConversationRecord.aggregate([
        {
            $match: { member: userId }
        },
        {
            $lookup: {
                from: 'chat_rooms',
                localField: 'room',
                foreignField: '_id',
                let: { userId },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ['$type', "DM"] } }
                    },
                    // Fetch the last message and unwind
                    {
                        $lookup: {
                            from: 'chat_messages',
                            localField: 'lastMessage',
                            foreignField: '_id',
                            pipeline: [
                                {
                                    $lookup: {
                                        from: 'users',
                                        localField: 'author',
                                        foreignField: '_id',
                                        pipeline: [
                                            {
                                                $project: {
                                                    email: 1,
                                                    avatar: 1
                                                }
                                            }
                                        ],
                                        as: 'author'
                                    }
                                },
                                {
                                    $unwind: '$author'
                                }
                            ],
                            as: 'lastMessage'
                        }
                    },
                    {
                        $unwind: {
                            path: '$lastMessage',
                            preserveNullAndEmptyArrays: true
                        }
                    },

                    // Fetch the receiver's data
                    {
                        $lookup: {
                            from: 'users',
                            let: { participantIds: '$dm.participants', userId: '$$userId' },
                            pipeline: [
                                // Match the receiver and exclude the user
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $ne: ['$_id', '$$userId'] },
                                                { $in: ['$_id', '$$participantIds'] }
                                            ]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        email: 1,
                                        avatar: 1
                                    }
                                }
                            ],
                            as: 'receiver'
                        }
                    },
                    {
                        $unwind: '$receiver'
                    },
                    // Project
                    {
                        $project: {
                            receiver: 1,
                            lastMessage: 1,
                        }
                    }
                ],
                as: 'room'
            }
        },
        {
            $unwind: '$room'
        },
        {
            $replaceWith: { $mergeObjects: ['$$ROOT', '$room'] }
        },
        {
            $project: {
                room: 0,
                member: 0,
                updatedAt: 0
            }
        }
    ])

    return res.success(200, { chats })
}


export const fetchUserTrips: RequestHandler = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    const trips = await ConversationRecord.aggregate([
        // Get all conversationRecords of user
        {
            $match: { member: userId }
        },
        // Populate rooms that are not DMs i.e. rooms with type = TRIP
        {
            $lookup: {
                from: 'chat_rooms',
                localField: 'room',
                foreignField: '_id',
                pipeline: [
                    {
                        $match: { $expr: { $eq: ['$type', "TRIP"] } }
                    },
                    // Populate trip data, unwind
                    {
                        $lookup: {
                            from: 'trips',
                            localField: 'trip',
                            foreignField: '_id',
                            as: 'trip'
                        },

                    },
                    {
                        $unwind: '$trip'
                    },
                    // Fetch the last message and unwind
                    {
                        $lookup: {
                            from: 'chat_messages',
                            localField: 'lastMessage',
                            foreignField: '_id',
                            pipeline: [
                                {
                                    $lookup: {
                                        from: 'users',
                                        localField: 'author',
                                        foreignField: '_id',
                                        pipeline: [
                                            {
                                                $project: {
                                                    email: 1,
                                                    avatar: 1
                                                }
                                            }
                                        ],
                                        as: 'author'
                                    }
                                },
                                {
                                    $unwind: '$author'
                                }
                            ],
                            as: 'lastMessage'
                        }
                    },
                    {
                        $unwind: {
                            path: '$lastMessage',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            lastMessage: 1,
                            trip: {
                                _id: '$trip._id',
                                name: '$trip.name',
                                avatar: '$trip.avatar'
                            }
                        }
                    }
                ],
                as: 'room'
            }
        },
        {
            $unwind: '$room'
        },
        {
            $project: {
                trip: '$room.trip',
                lastMessage: '$room.lastMessage',
                lastReadAt: 1
            }
        },
        {
            $replaceWith: { $mergeObjects: ['$$ROOT', '$trip'] }
        },
        {
            $project: {
                trip: 0
            }
        }

    ])

    return res.success(200, { trips })
}

const FetchChatRoomSchema = z.object({
    userId: z.string().refine(id => isObjectIdOrHexString(id))
})

export const fetchChatRoom: RequestHandler = async (req, res) => {
    const currentUserId = req.user._id

    const parsedData = FetchChatRoomSchema.safeParse(req.params)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid params")

    const user = await User.findById(parsedData.data.userId)
    if (!user) return res.fail(404, "USER_NOT_FOUND", "User does not exist")

    const participants = [currentUserId, user.id]
    const dmKey = participants.sort().join('|')

    const chatRoom = await ChatRoom.findOne({ type: 'DM', 'dm.key': dmKey })
    if (!chatRoom) return res.fail(404, "CHAT_NOT_FOUND", "Chat does not exist")

    return res.success(200, { chatRoom, user })

}

const CreateChatRoomSchema = z.object({
    userId: z.string().refine(id => isObjectIdOrHexString(id))
})

export const createChatRoom: RequestHandler = async (req, res) => {
    console.log(req.params.userId)
    const currentUserId = req.user._id

    const parsedData = CreateChatRoomSchema.safeParse(req.params)
    if (!parsedData.success) return res.fail(400, "BAD_REQUEST", "Invalid params")

    const user = await User.findById(parsedData.data.userId)
    if (!user) return res.fail(404, "USER_NOT_FOUND", "User does not exist")

    const participants = [currentUserId, user.id]
    const dmKey = participants.sort().join('|')

    const chatRoom = await ChatRoom.create({ type: 'DM', dm: { participants, key: dmKey } })

    await Promise.all(participants.map(member => {
        return ConversationRecord.create({ room: chatRoom._id, member })
    }))


    return res.success(201, { chatRoom, user })
}