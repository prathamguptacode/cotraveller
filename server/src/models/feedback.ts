import mongoose, { HydratedDocument, Schema } from "mongoose";
const feedbackSchema = new mongoose.Schema({
    suggestion: {
        type: String
    },
    bug: {
        type: String
    },
    story: {
        type: String
    }
})


export type FeedbackType = HydratedDocument<mongoose.InferSchemaType<typeof feedbackSchema>>

export default mongoose.model<FeedbackType>('Feedback', feedbackSchema)