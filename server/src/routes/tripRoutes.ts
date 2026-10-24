import { addItineraryItem, createTrip, createTripAvatar, createTripInvite, editItineraryItems, tripDetails, tripInvite, searchTrips, fetchChatRoom } from "@/controllers/tripController"
import authMiddleware from "@/middlewares/authMiddleware"
import express from "express"
import upload from "@/middlewares/multerUpload"
import asyncHandler from "@/middlewares/asyncHandler"

const router = express.Router()

router.get('/search', asyncHandler(searchTrips))
router.get('/:tripId', asyncHandler(tripDetails))

router.use(authMiddleware)

router.get('/:tripId/chats', asyncHandler(fetchChatRoom))

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
