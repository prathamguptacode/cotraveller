import mongoose, { HydratedDocument, Schema } from "mongoose";


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
    },
    vehicleNumber: String,
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

    //###REMOVE Will be removed after migration is complete on production
    requests: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
        //should be unique
    },

    //Stores a ref to JoinRequest Schema
    incomingRequests: {
        type: [Schema.Types.ObjectId],
        ref: 'JoinRequest',
        default: []
    },

    // ###LATER remove messages field from GroupSchema

    messages: {
        type: [Schema.Types.ObjectId],
        ref: "Message",
        default: []
    },

    tags: {
        type: [String],
        required: false
    },
    avatar: {
        type: {
            publicId: String,
            version: Number
        },
        default: {
            publicId: '',
            version: 0
        }
    }
    // const toIST = (date) => moment(date).tz("Asia/Kolkata"); for timezone converstion
    // const istDate = moment.tz(req.body.travelDate, "Asia/Kolkata").toDate(); for telling backend it is ist
}, {
    timestamps: true
})

export type GroupType = HydratedDocument<mongoose.InferSchemaType<typeof groupSchema>>

export default mongoose.model<GroupType>('Group', groupSchema)