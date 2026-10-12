import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        select: false
    }
}, {
    timestamps: true
})

export type UserModel = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof userSchema>>
export default mongoose.model<UserModel>('User', userSchema)