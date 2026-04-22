import mongoose, { HydratedDocument, Schema } from "mongoose";
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    }
}, {
    timestamps: true
})

export type CommentType = HydratedDocument<mongoose.InferSchemaType<typeof commentSchema>>

export default mongoose.model<CommentType>('Comment', commentSchema)