import mongoose, { HydratedDocument } from 'mongoose'

const conversationRecordSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    room: {
        type: String,
        ref: "ChatRoom",
        required: true
    },
    lastReadAt: {
        type: Date,
        default: new Date(0),
    },
}, {
    timestamps: true
})

conversationRecordSchema.index({ room: 1, member: 1 }, { unique: true })

export type ConversationRecordModel = HydratedDocument<mongoose.InferSchemaType<typeof conversationRecordSchema>>
export default mongoose.model<ConversationRecordModel>('conversationRecord', conversationRecordSchema, 'conversation_records')