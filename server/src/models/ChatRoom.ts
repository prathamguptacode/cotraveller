import mongoose, { HydratedDocument } from 'mongoose'

const chatRoomSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["DM", "Trip"],
        required: true
    },
    dmKey: {
        type: String,
        unique: true,
        sparse: true
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
})

export type ChatRoomModel = HydratedDocument<mongoose.InferSchemaType<typeof chatRoomSchema>>
export default mongoose.model<ChatRoomModel>('conversationRecord', chatRoomSchema, 'chat_rooms')
