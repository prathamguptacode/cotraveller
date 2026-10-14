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
    room: {
        type: String,
        ref: "ChatRoom",
        required: true
    }
}, {
    timestamps: true
})

chatMessageSchema.index({ room: 1 })

export type ChatMessageModel = HydratedDocument<mongoose.InferSchemaType<typeof chatMessageSchema>>
export default mongoose.model<ChatMessageModel>('ChatMessage', chatMessageSchema, 'chat_messages')