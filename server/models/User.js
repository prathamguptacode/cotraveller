import mongoose, { Schema } from 'mongoose'

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
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    __v: {
        type: Number,
        select: false,
    },
    oAuthProviders: [{
        type: String
    }],

    memberGroup:{
        type: [Schema.Types.ObjectId],
        ref: 'Group',
        default: []
    },
    requests:{
        type: [Schema.Types.ObjectId],
        ref: 'Group',
        default: []
    },
    dbrequests:{
        type: [Schema.Types.ObjectId],
        ref: 'Group',
        default: []
    }
})

export default mongoose.model("User", userSchema)