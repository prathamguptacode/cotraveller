import mongoose, { Schema } from "mongoose";


const groupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    memberNumber: {
        type: Number,
        required: true
    },
    member: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        //should be unique
        //add owner to it at first place
    },
    vehicleNumber: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updateAt: {
        type: Date,
    },
    mode: {
        type: String,
        required: true
    },
    travelDate: {
        type: Date,
        required: true
    },
    intialLocation: {
        type: String,
        require: true
    },
    requests: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
        //should be unique
    },
    dbrequests:{
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    messages:{
        type:[Schema.Types.ObjectId],
        ref:"Message",
        default:[]
    },
    comments:{
        type:[Schema.Types.ObjectId],
        ref:"Comment",
        default: []
    }
    // const toIST = (date) => moment(date).tz("Asia/Kolkata"); for timezone converstion
    // const istDate = moment.tz(req.body.travelDate, "Asia/Kolkata").toDate(); for telling backend it is ist
})

export default mongoose.model('Group', groupSchema)