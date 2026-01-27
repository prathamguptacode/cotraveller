import mongoose, { HydratedDocument } from 'mongoose'

const otpRequestLimitSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    requests: {
        type: Number,
        default: 1,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

//Resets after 10 mins
otpRequestLimitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 * 60 })

export type OtpRequestLimitType = HydratedDocument<mongoose.InferSchemaType<typeof otpRequestLimitSchema>>

export default mongoose.model<OtpRequestLimitType>('OtpRequestLimit', otpRequestLimitSchema, 'otp_request_limits')