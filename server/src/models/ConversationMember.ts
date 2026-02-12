import mongoose, { HydratedDocument } from "mongoose";

const conversationMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    lastReadAt: {
        type: Date,
        default: Date.now,
    },
})

conversationMemberSchema.index({ author: 1, roomId: 1 }, { unique: true })

export type ConversationMemberType = HydratedDocument<mongoose.InferSchemaType<typeof conversationMemberSchema>>

export default mongoose.model<ConversationMemberType>('ConversationMember', conversationMemberSchema)