import mongoose, { Schema } from "mongoose";
const commentSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    aurthor:{
        type: String,
        // type:Schema.Types.ObjectId,
        // ref: 'User',
        require:true
    },
    targetGroup:{
        type:Schema.Types.ObjectId,
        ref: 'Group',
        require:true        
    }
})
export default mongoose.model('Comment',commentSchema)