import mongoose, { Schema } from "mongoose";

const groupSchema=new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    owner:{
        // type: Schema.Types.ObjectId,
        // ref: 'User',
        type:String,
        required: true
    },
    memberNumber:{
        type: Number,
        required: true
    },
    member:{
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    vehicleNumber:String,
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    updateAt:{
        type:Date,
    }
})

export default mongoose.model('Group',groupSchema)