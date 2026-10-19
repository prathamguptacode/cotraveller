import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";


const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  },
});



const itineraryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  origin: {
    type: pointSchema,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
  },
  destination: {
    type: pointSchema
  },
  isFullDay: {
    type: Boolean,
    default: true
  },
  searchVariables: {
    type: {
      city: String,
      country: String,
      _id: false
    },
    required: true
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },
  placeId: {
    type: String,
    required: true
  }
})

export type ItineraryItemModel = HydratedDocument<InferSchemaType<typeof itineraryItemSchema>>
export default mongoose.model<ItineraryItemModel>("ItineraryItem", itineraryItemSchema, 'itinerary_items')
