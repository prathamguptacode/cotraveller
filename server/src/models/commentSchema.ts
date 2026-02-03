import mongoose, { HydratedDocument, Schema } from "mongoose";
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    targetGroup: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    }
})

export type CommentType = HydratedDocument<mongoose.InferSchemaType<typeof commentSchema>>

export default mongoose.model<CommentType>('Comment', commentSchema)