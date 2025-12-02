import mongoose from "mongoose";

const otpSessionSchema = new mongoose.Schema({
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
    attempts: {
        type: Number,
        default: 0,
        required: true,
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
otpSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 * 60 })

export default mongoose.model("OtpSession", otpSessionSchema,'otp_sessions')