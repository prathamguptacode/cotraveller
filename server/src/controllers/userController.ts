import ChatRoom from "@/models/ChatRoom";
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
                receiver: 1
            }
        }
    ])

    return res.success(200, { chats })
}