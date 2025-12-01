import mongoose, { Schema } from "mongoose";
import { type } from "os";

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
    },
    mode:{
        type:String,
        lowercase:true,
        required:true
    },
    travelDate:{
        type:Date,
        required:true
    }
    // const toIST = (date) => moment(date).tz("Asia/Kolkata"); for timezone converstion
    // const istDate = moment.tz(req.body.travelDate, "Asia/Kolkata").toDate(); for telling backend it is ist
})

export default mongoose.model('Group',groupSchema)