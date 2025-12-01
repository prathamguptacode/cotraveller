import mongoose from "mongoose";

const tempTokenSchema = new mongoose.Schema({
    otpUUID: {
        type: String,
        required: true,
        unique: true
    },
    otpHash: {
        type: String,
        required: true,
        //not unique:intentional and thoughtful
        //otpuuid is unique and that removes the need and makes it better if otp is not unique
    },


    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }

})
tempTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 20 * 60 })

export default mongoose.model('TempToken', tempTokenSchema)