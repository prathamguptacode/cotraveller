import mongoose, { HydratedDocument } from 'mongoose'

const messageSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    text: {
        type: String,
        required: true
    },
    //groupId is the roomId
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    }
})

export type MessageType = HydratedDocument<mongoose.InferSchemaType<typeof messageSchema>>
export default mongoose.model<MessageType>('Message', messageSchema)