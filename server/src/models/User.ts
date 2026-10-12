import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";


const userSchema = new Schema({
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

export type UserModel = HydratedDocument<InferSchemaType<typeof userSchema>>
export default model<UserModel>('User', userSchema)