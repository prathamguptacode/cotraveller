import mongoose, { HydratedDocument } from 'mongoose'

const chatRoomSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["DM", "Trip"],
        required: true
    },
    dm: {
        type: {
            key: {
                type: String,
                unique: true,
                sparse: true
            },
            participants: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: "User"
            },
            _id: false,
        },

    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        unique: true,
        sparse: true
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatMessage"
    }
}, {
    timestamps: true
})

export type ChatRoomModel = HydratedDocument<mongoose.InferSchemaType<typeof chatRoomSchema>>
export default mongoose.model<ChatRoomModel>('chatRoom', chatRoomSchema, 'chat_rooms')
