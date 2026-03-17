import mongoose, { HydratedDocument } from "mongoose"

const joinRequestSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },

    //Requester is the user asking to join the group
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    readBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }
}, {
    timestamps: true
})

joinRequestSchema.index({ requesterId: 1, groupId: 1 }, { unique: true })

export type JoinRequestType = HydratedDocument<mongoose.InferSchemaType<typeof joinRequestSchema>>

export default mongoose.model<JoinRequestType>('JoinRequest', joinRequestSchema, 'join_requests')