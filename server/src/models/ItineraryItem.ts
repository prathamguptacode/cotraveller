import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";


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
  time: {
    type: Date,
    required: true
  },
  destination: {
    type: pointSchema
  },
})

export type ItineraryItemModel = HydratedDocument<InferSchemaType<typeof itineraryItemSchema>>
export default mongoose.model<ItineraryItemModel>("ItineraryItem", itineraryItemSchema, 'itinerary_items')
