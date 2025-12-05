import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    text: {
        type: String,
        required: true
    },
    //groupId is the roomId
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    }
})

export default mongoose.model('Message', messageSchema)