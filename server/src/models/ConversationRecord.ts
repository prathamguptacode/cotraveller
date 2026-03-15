import mongoose from "mongoose";

const conversationRecordSchema = new mongoose.Schema({
    memberId: {
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
        default: new Date(0),
    },
})

conversationRecordSchema.index({ memberId: 1, roomId: 1 }, { unique: true })

export type ConversationRecordType = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof conversationRecordSchema>>

export default mongoose.model<ConversationRecordType>('ConversationRecord', conversationRecordSchema, 'conversation_records')