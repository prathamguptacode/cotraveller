import mongoose, { Schema } from "mongoose";

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  avatar: {
    type: {
      publicId: {
        type: String,
      },
      version: {
        type: Number,
      },
      _id: false
    },
    default: {
      publicId: '',
      version: 0
    },
  },
  itineraryItems: {
    type: [Schema.Types.ObjectId],
    ref: "ItineraryItem"
  }
}, { timestamps: true })


export default mongoose.model("Trip", tripSchema)
