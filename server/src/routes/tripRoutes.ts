import { addItineraryItem, createTrip, createTripAvatar, createTripInvite, editItineraryItems, tripDetails, tripInvite, searchTrips } from "@/controllers/tripController"
import authMiddleware from "@/middlewares/authMiddleware"
import express from "express"
import upload from "@/middlewares/multerUpload"
import asyncHandler from "@/middlewares/asyncHandler"

const router = express.Router()

router.get('/:tripId', tripDetails)
router.get('/search', searchTrips)

router.use(authMiddleware)

router.route('/')
    .post(asyncHandler(createTrip))

router.patch("/:tripId/avatar",
    upload.single("avatar"),
    asyncHandler(createTripAvatar))

router.route('/:tripId/itinerary')
    .post(asyncHandler(addItineraryItem))
    .patch(asyncHandler(editItineraryItems))

router.post('/invite', asyncHandler(tripInvite))
router.get('/:tripId/invite', asyncHandler(createTripInvite))



export default router
