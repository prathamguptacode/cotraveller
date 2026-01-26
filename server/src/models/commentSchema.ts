import mongoose, { Schema } from "mongoose";
const commentSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    targetGroup:{
        type:Schema.Types.ObjectId,
        ref: 'Group',
        required:true        
    }
})
export default mongoose.model('Comment',commentSchema)