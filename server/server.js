import express from 'express'
import http from 'http'
import responseHandler from './utils/responseHandler.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import env from './config/env.js'
import hello from './routes/hello.js'
import {addGroupRoute} from './routes/groupRoutes.js'
import {viewGroupRoute} from './routes/groupRoutes.js'
import {viewGroupByFilterRoute} from './routes/groupRoutes.js'
import { addCommentRoute } from './routes/commentRoute.js'

const app = express()
const server = http.createServer(app)
app.use(cookieParser())
app.use(express.json())
app.use(responseHandler)

//Routes
app.use('/api',hello)
app.use('/api',addGroupRoute)
app.use('/api',viewGroupRoute)
app.use('/api',viewGroupByFilterRoute)
app.use('/api',addCommentRoute)



connectDB()

app.use(errorMiddleware)

server.listen(env.PORT || 3000, "0.0.0.0", () => {
    console.log("Listening on port", env.PORT || 3000)
})


