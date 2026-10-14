import ChatRoom from "@/models/ChatRoom";
import ConversationRecord from "@/models/ConversationRecord";
import { RequestHandler } from "express";
import mongoose from "mongoose";

// There will definetly be more conversation-records as compared to chat-rooms, so lets go..
export const fetchDMChats: RequestHandler = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.body.userId)

    const chats = await ChatRoom.aggregate([
        // Get all DM ChatRooms with user as participant
        {
            $match: {
                type: "DM",
                'dm.participants': userId
            }
        },

        // Fetch the last message and unwind
        {
            $lookup: {
                from: 'chat_messages',
                localField: 'lastMessage',
                foreignField: '_id',
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
                let: { participantIds: '$dm.participants', userId },
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
                lastMessage: 1
            }
        }
    ])

    return res.success(200, { chats })
}


export const fetchTripChats: RequestHandler = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.body.userId)

    const chats = await ConversationRecord.aggregate([
        // Get all conversationRecords of user
        {
            $match: { member: userId }
        },
        // Populate rooms that are not DMs i.e. rooms with type = TRIP
        {
            $lookup: {
                from: 'chat_rooms',
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
            }
        }

    ])

    return res.success(200, { chats })
}