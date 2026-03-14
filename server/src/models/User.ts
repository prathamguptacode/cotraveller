import mongoose, { HydratedDocument, mongo, Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        select: false,
    },
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },

    oAuthProviders: [{
        type: String
    }],

    memberGroup: {
        type: [Schema.Types.ObjectId],
        ref: 'Group',
        default: []
    },

    //Stores a ref to JoinRequest Schema
    outgoingRequests: {
        type: [Schema.Types.ObjectId],
        ref: 'JoinRequest',
        default: []
    },
    
    __v: {
        type: Number,
        select: false,
    },
}, {
    timestamps: true
})

export type UserType = HydratedDocument<mongoose.InferSchemaType<typeof userSchema>>

export default mongoose.model<UserType>("User", userSchema)