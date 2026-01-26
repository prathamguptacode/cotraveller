import mongoose, { Schema } from "mongoose";
const feedbackSchema=new mongoose.Schema({
    suggestion:{
        type:String
    },
    bug:{
        type:String
    },
    story:{
        type:String
    }
})
export default mongoose.model('Feedback',feedbackSchema)