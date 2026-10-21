import mongoose from 'mongoose'


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
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullName: String,
    avatar: {
        type: {
            publicId: String,
            version: Number,
            _id: false
        },
        default: {
            publicId: '',
            version: 0
        },
    },
}, {
    timestamps: true
})

export type UserModel = mongoose.HydratedDocument<mongoose.InferSchemaType<typeof userSchema>>
export default mongoose.model<UserModel>('User', userSchema)
