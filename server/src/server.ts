import express from "express"
import env from "./config/env"
import cors from "cors"
import cookieParser from "cookie-parser"

import connectToMongoDB from "./config/mongoDB"
import errorHandler from "./middlewares/errorHandler"
import responseHandler from "./middlewares/responseHandler"

import helloRoutes from '@/routes/helloRoutes'
import authRoutes from '@/routes/authRoutes'
import tripRoutes from "@/routes/tripRoutes"

await connectToMongoDB()

const app = express();

app.use(express.json())
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}))
app.use(cookieParser())
app.use(responseHandler)



app.use('/api', helloRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/trip', tripRoutes)



app.use(errorHandler)


app.listen(env.PORT, () => {
  console.log(`just cotraveller server listening on port ${env.PORT}`);
});
