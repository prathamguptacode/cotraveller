import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";

const tripMemberSchema = new mongoose.Schema({
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
  }
  
}, { timestamps: true })

tripMemberSchema.index({ user: 1, trip: 1 }, { unique: true })

export type TripMemberModel = HydratedDocument<InferSchemaType<typeof tripMemberSchema>>
export default mongoose.model<TripMemberModel>("TripMember", tripMemberSchema, 'trip_members')

