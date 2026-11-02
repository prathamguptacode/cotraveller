import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";

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
    ref: "ItineraryItem",
    default: []
  }
}, { timestamps: true })

export type TripModel = HydratedDocument<InferSchemaType<typeof tripSchema>>
export default mongoose.model<TripModel>("Trip", tripSchema)
