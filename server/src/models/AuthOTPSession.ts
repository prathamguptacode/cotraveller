import mongoose from 'mongoose'

// Different from authLimitSession and contains the payload required to create account upon successful OTP verification
// It contains the currentOTPHash which changes when new otp is requested

const authOTPSession = new mongoose.Schema({
    otpHash: {
        type: String,
        required: true
    },
    payload: {
        type: {
            email: {
                type: String,
                required: true
            },
            passwordHash: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            },
            fullName: String,
        },
        required: true
    },
    incorrectAttempts: {
        type: Number,
        default: 0
        // Max - 3
    },
    resendRequests: {
        type: Number,
        default: 0
        // Max - 3
    },
    lastSentAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})


// This window for entering the correct otp or requesting new ones and entering them closes after 15 mins of creation
authOTPSession.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 60 })

export type AuthOTPSessionModel = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof authOTPSession>>
export default mongoose.model('AuthOTPSession', authOTPSession, 'auth_otp_sessions')