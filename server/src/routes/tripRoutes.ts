import { addItineraryItem, createTrip, createTripAvatar, createTripInvite, editItineraryItems, tripDetails, tripInvite, viewTrips, searchTrip } from "@/controllers/tripController"
import authMiddleware from "@/middlewares/authMiddleware"
import express from "express"
import upload from "@/middlewares/multerUpload"

const router = express.Router()

router.get('/info/:tripid', tripDetails)
router.get('/search/:query', searchTrip)
router.use(authMiddleware)
router.post("/", createTrip)
router.get("/", viewTrips)
router.patch("/avatar/:tripid", upload.single("avatar"), createTripAvatar)
router.post('/iternary', addItineraryItem)
router.patch('/iternary', editItineraryItems)
router.patch('/invite', tripInvite)
router.get('/invite/:tripid', createTripInvite)



export default router
