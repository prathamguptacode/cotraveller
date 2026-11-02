import mongoose from 'mongoose'

const authLimitSessionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    attempts: {
        type: Number,
        default: 1
        // If session doesn't exist, attempts = 0, when created, it is the First Attempt , Therefore default = 1
        // Max - 5
    }
}, {
    timestamps: true
})

// Session is cleaned after 30 mins of creation
authLimitSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 60 })


export type AuthLimitSessionModel = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof authLimitSessionSchema>>
export default mongoose.model('AuthLimitSession', authLimitSessionSchema, 'auth_limit_sessions')