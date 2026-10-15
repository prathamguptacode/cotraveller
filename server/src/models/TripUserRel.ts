import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";

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
  role: {
    type: String,
    enum: ["MEMBER", "ADMIN"],
    default: "MEMBER"
  },
  tags: {
    type: [String],
    default: []
  }
}, { timestamps: true })

tripUserRelSchema.index({ user: 1, trip: 1 }, { unique: true })
export type TripMemberModel = HydratedDocument<InferSchemaType<typeof tripUserRelSchema>>
export default mongoose.model("TripUserRel", tripUserRelSchema)
