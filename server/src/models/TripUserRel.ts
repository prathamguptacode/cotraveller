import mongoose, { Schema } from "mongoose";

const tripUserRelSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  trip: {
    type: Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },
  tags: {
    type: [String]
  }
}, { timestamps: true })


export default mongoose.model("TripUserRel", tripUserRelSchema)

