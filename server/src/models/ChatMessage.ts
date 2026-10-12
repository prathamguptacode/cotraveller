import mongoose, { HydratedDocument } from 'mongoose'

const chatMessageSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true
    },

    roomId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export type ChatMessageModel = HydratedDocument<mongoose.InferSchemaType<typeof chatMessageSchema>>
export default mongoose.model<ChatMessageModel>('ChatMessage', chatMessageSchema, 'chat_messages')