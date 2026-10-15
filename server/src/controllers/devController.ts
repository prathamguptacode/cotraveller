import ChatRoom from "@/models/ChatRoom";
import ConversationRecord from "@/models/ConversationRecord";
import Trip from "@/models/Trip";
import { RequestHandler } from "express";

// ###TEMP DEV ONLY ROUTES

export const createChatRoom: RequestHandler = async (req, res) => {
    const { userId } = req.body as { userId: string }
    const { userId: receiverId } = req.params as { userId: string }

    const participants = [receiverId, userId]

    const chatRoom = await ChatRoom.create({
        type: "DM",
        dm: {
            participants,
            key: participants.sort().join('|')
        }
    })

    return res.success(201, { chatRoom })
}

export const createTrip: RequestHandler = async (req, res) => {
    const { userId, name, description } = req.body as { userId: string, name: string, description?: string }

    const trip = await Trip.create({
        name,
        description,
        admin: userId,
        members: [userId]
    })

    const chatRoom = await ChatRoom.create({
        type: "TRIP",
        trip: trip._id,
    })

    const conversationRecord = await ConversationRecord.create({
        member: userId,
        room: chatRoom._id,
    })

    return res.success(201, { trip, chatRoom, conversationRecord })
}

