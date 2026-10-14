import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";


const userSchema = new Schema({
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
        // required: true,
        // unique: true
    },
    fullName: {
        type: String,
        // required: true,
    }
}, {
    timestamps: true
})

export type UserModel = HydratedDocument<InferSchemaType<typeof userSchema>>
export default model<UserModel>('User', userSchema)
