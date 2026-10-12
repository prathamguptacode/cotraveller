import mongoose from "mongoose";
import env from "./env";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI)
        console.log("Connected to MongoDB!")
    } catch (error) {
        console.error("ERROR:Could not connect to MongoDB", error)
    }
}

export default connectToMongoDB
