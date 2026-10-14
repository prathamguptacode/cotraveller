import mongoose from "mongoose";


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
    type: Date
  },
  destination: {
    type: pointSchema,
    // required: true
  },
})


export default mongoose.model("ItineraryItem", itineraryItemSchema)
