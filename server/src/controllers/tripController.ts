import cloudinary from "@/config/cloudinary";
import Trip from "@/models/Trip";
import TripUserRel from "@/models/TripUserRel";
import Itinerary from "@/models/ItineraryItem"
import { Request, Response } from "express";
import z from "zod";
import fs from "fs/promises"
import { generateInviteToken, generateUint8Array } from "@/utils/generateAuthTokens";
import { jwtVerify } from "jose";
import env from "@/config/env";
import { JOSEError, JWTExpired } from "jose/errors";

const createTripValidator = z.object({
  name: z.string(),
  description: z.string().optional()
})
const createTripAvatarValidator = z.object({
  tripId: z.string()
})
const tripDetailsValidator = z.object({
  tripId: z.string()
})
const tripIternaryValidator = z.object({
  tripId: z.string(),
  name: z.string(),
  origin: z.array(z.number()).length(2),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime().optional(),
  destination: z.array(z.number()).length(2).default([]),
  isFullDay: z.boolean().default(true),
  searchVariables: z.object({ city: z.string(), state: z.string(), country: z.string() })
})
const editIternaryValidator = z.object({
  tripId: z.string(),
  iternaryId: z.string(),
  name: z.string(),
  origin: z.array(z.number()).length(2),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime().optional(),
  destination: z.array(z.number()).length(2).default([]),
  isFullDay: z.boolean().default(true),
  searchVariables: z.object({ city: z.string(), state: z.string(), country: z.string() })

})
const tripInviteValidator = z.object({
  inviteToken: z.string()
})

export async function createTrip(req: Request, res: Response) {
  const data = createTripValidator.safeParse(req.body)
  if (!data.success) {
    return res.fail(400, "INVALID BODY")
  }
  const newTrip = new Trip({
    name: data.data.name,
    description: data.data.description,
  })
  await newTrip.save()
  const userId = req.user._id
  const newTripUserRel = new TripUserRel({
    user: userId,
    trip: newTrip._id,
    role: "ADMIN"
  })
  await newTripUserRel.save()
  res.success(201, { tripId: newTrip._id })
}

export async function createTripAvatar(req: Request, res: Response) {
  if (!req.file) {
    return res.fail(400, "FILE NOT FOUND")
  }
  const data = createTripAvatarValidator.safeParse({ tripId: req.params.tripid })
  if (!data.success) {
    await fs.unlink(req.file.path)
    return res.fail(400, "INVALID BODY")
  }
  const userId = req.user._id
  const tripId = data.data.tripId
  const relation = await TripUserRel.findOne({ trip: tripId, user: userId })
  if (relation == null) {
    await fs.unlink(req.file.path)
    return res.fail(404, "NOT_FOUND")
  }
  if (relation.role !== "ADMIN") {
    await fs.unlink(req.file.path)
    return res.fail(403, "ONLY ADMIN")
  }
  try {
    const { public_id: publicId, version } = await cloudinary.uploader.upload(req.file.path, {
      asset_folder: "cotraveller26",
      use_filename: true,
      unique_filename: true,
      resource_type: 'auto',
    })
    await fs.unlink(req.file.path)
    await Trip.updateOne({ _id: tripId }, { avatar: { publicId, version } })
    return res.success(201, { publicId, version }, "Trip Avatar upload successful")
  } catch (error) {
    await fs.unlink(req.file.path)
    console.error("Error uploading group avatar to cloudinary", error)
    return res.fail()
  }
}

// need to sort trips according to messages
export async function viewTrips(req: Request, res: Response) {
  const userId = req.user._id
  const tripsRelArr = await TripUserRel.find({ user: userId }).select("trip")
  if (tripsRelArr == null || tripsRelArr.length <= 0) {
    return res.fail(404, "NO TRIP FOUND")
  }
  const tripsId = tripsRelArr.map(e => e.trip)
  const trips = await Trip.find({ _id: tripsId }).select("name avatar")
  res.success(200, { trips })
}

export async function tripDetails(req: Request, res: Response) {
  const data = tripDetailsValidator.safeParse({ tripId: req.params.tripid })
  if (!data.success) {
    return res.fail(400, "INVALID BODY")
  }
  const tripId = data.data.tripId
  const trip = await Trip.findById(tripId)
  res.success(200, { trip })
}

export async function addItineraryItem(req: Request, res: Response) {
  const userId = req.user._id
  const data = tripIternaryValidator.safeParse(req.body)
  if (!data.success) {
    return res.fail(400, "INVALID BODY")
  }
  const tripId = data.data.tripId
  const relation = await TripUserRel.findOne({ trip: tripId, user: userId })
  if (relation == null) {
    return res.fail(403, "NOT MEMBER")
  }
  const newIternaryItem = new Itinerary({
    name: data.data.name,
    origin: {
      type: "Point",
      coordinates: data.data.origin
    },
    startTime: data.data.startTime,
    endTime: data.data.endTime,
    destination: {
      type: "Point",
      coordinates: data.data.destination
    },
    isFullDay: data.data.isFullDay,
    searchVariables: data.data.searchVariables
  })
  await newIternaryItem.save()
  await Trip.updateOne({ _id: tripId }, { $push: { itineraryItems: newIternaryItem._id } })
  res.success(201, { iternary: newIternaryItem })
}

export async function editItineraryItems(req: Request, res: Response) {
  const userId = req.user._id
  const data = editIternaryValidator.safeParse(req.body)
  if (!data.success) {
    return res.fail(400, "INVALID BODY")
  }
  const tripId = data.data.tripId
  const relation = await TripUserRel.findOne({ trip: tripId, user: userId })
  if (relation == null) {
    return res.fail(403, "NOT MEMBER")
  }
  await Itinerary.updateOne({ _id: data.data.iternaryId }, {
    name: data.data.name,
    origin: {
      type: "Point",
      coordinates: data.data.origin
    },
    startTime: data.data.startTime,
    endTime: data.data.endTime,
    destination: {
      type: "Point",
      coordinates: data.data.destination
    },
    isFullDay: data.data.isFullDay,
    searchVariables: data.data.searchVariables
  })
  res.success()
}

export async function createTripInvite(req: Request, res: Response) {
  const userId = req.user._id
  const data = tripDetailsValidator.safeParse({ tripId: req.params.tripid })
  if (!data.success) {
    return res.fail(400, "INVALID BODY")
  }
  const tripId = data.data.tripId
  const relation = await TripUserRel.findOne({ trip: tripId, user: userId })
  if (relation == null || relation.role !== "ADMIN") {
    return res.fail(403, "NOT ADMIN")
  }
  const inviteToken = await generateInviteToken({ tripId })
  res.success(200, { tripId, inviteToken })
}


export async function tripInvite(req: Request, res: Response) {
  const userId = req.user._id
  const data = tripInviteValidator.safeParse(req.body)
  if (!data.success) {
    return res.fail(400, "INVALID BODY")
  }
  const inviteToken = data.data.inviteToken
  try {
    const { payload: { tripId } } = await jwtVerify<{ tripId: string }>(inviteToken, generateUint8Array(env.INVITE_TOKEN_SECRET))
    const relation = await TripUserRel.findOne({ trip: tripId, user: userId })
    if (relation) {
      return res.fail(403, "MEMBER")
    }
    const newTripUserRel = new TripUserRel({
      user: userId,
      trip: tripId,
    })
    await newTripUserRel.save()
    res.success(200, { tripId })
  } catch (error) {
    //Token expired
    if (error instanceof JWTExpired) {
      return res.fail(401, "INVITE TOKEN EXPIRED")
    }
    if (error instanceof JOSEError) {
      return res.fail(401, "INVALID_JWT")
    }
    return res.fail()
  }
}
