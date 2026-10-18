import cloudinary from "@/config/cloudinary";
import Trip from "@/models/Trip";
import TripUserRel, { TripMemberModel } from "@/models/TripMember";
import ItineraryItem from "@/models/ItineraryItem"
import { Request, Response } from "express";
import z from "zod";
import fs from "fs/promises"
import { generateInviteToken, generateUint8Array } from "@/utils/generateJWTs";
import { jwtVerify } from "jose";
import env from "@/config/env";
import { JOSEError, JWTExpired } from "jose/errors";
import { UserModel } from "@/models/User";

const CreateTripValidator = z.object({
  name: z.string(),
  description: z.string().optional()
})

const CreateTripAvatarValidator = z.object({
  tripId: z.string()
})

const TripDetailsValidator = z.object({
  tripId: z.string()
})

const TripItineraryValidator = z.object({
  tripId: z.string(),
  name: z.string(),
  origin: z.array(z.number()).length(2),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime().optional(),
  destination: z.array(z.number()).length(2).default([]),
  isFullDay: z.boolean().default(true),
  searchVariables: z.object({ city: z.string(), state: z.string(), country: z.string() })
})

const EditItineraryValidator = z.object({
  ...TripItineraryValidator.shape,
  itineraryId: z.string()
})

const TripInviteValidator = z.object({
  inviteToken: z.string()
})

export async function createTrip(req: Request, res: Response) {
  const data = CreateTripValidator.safeParse(req.body)
  if (!data.success) return res.fail(400, "INVALID_BODY")

  const newTrip = new Trip({
    ...data.data
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
  if (!req.file) return res.fail(400, "FILE_NOT_FOUND")

  const data = CreateTripAvatarValidator.safeParse(req.params)
  if (!data.success) {
    await fs.unlink(req.file.path)
    return res.fail(400, "INVALID_BODY")
  }
  const userId = req.user._id
  const tripId = data.data.tripId

  const relation = await TripUserRel.findOne<Omit<TripMemberModel, 'user'> & { user: UserModel }>({ trip: tripId, user: userId }).populate('user')

  if (!relation) {
    await fs.unlink(req.file.path)
    return res.fail(404, "NOT_FOUND")
  }
  if (relation.role !== "ADMIN") {
    await fs.unlink(req.file.path)
    return res.fail(403, "ONLY_ADMIN")
  }

  const { user } = relation

  let options: {} | {
    public_id: string,
    invalidate: true,
    overwrite: true
  } = {}

  if (user.avatar.publicId) options = {
    public_id: user.avatar.publicId,
    invalidate: true,
    overwrite: true
  }

  try {
    const { public_id: publicId, version } = await cloudinary.uploader.upload(req.file.path, {
      asset_folder: "cotraveller26",
      use_filename: true,
      unique_filename: true,
      resource_type: 'auto',
      ...options
    })

    await Promise.all([fs.unlink(req.file.path), Trip.updateOne({ _id: tripId }, { avatar: { publicId, version } })])

    return res.success(201, { publicId, version }, "Trip Avatar upload successful")
  } catch (error) {
    await fs.unlink(req.file.path)
    console.error("Error uploading trip avatar to cloudinary", error)
    return res.fail()
  }
}


export async function tripDetails(req: Request, res: Response) {
  const data = TripDetailsValidator.safeParse(req.params)
  if (!data.success) return res.fail(400, "INVALID_BODY")

  const tripId = data.data.tripId
  const trip = await Trip.findById(tripId)

  const members = await TripUserRel.find({ trip: tripId }).populate("user", "email").select("user")

  res.success(200, { trip, members })
}

export async function addItineraryItem(req: Request, res: Response) {
  const userId = req.user._id
  const data = TripItineraryValidator.safeParse({
    ...req.params,
    ...req.body
  })
  if (!data.success) {
    return res.fail(400, "INVALID_BODY")
  }

  const { tripId, name, origin, destination, isFullDay, startTime, endTime, searchVariables } = data.data

  const relation = await TripUserRel.findOne({ trip: tripId, user: userId })
  if (!relation) return res.fail(403, "NOT_MEMBER")

  const newItineraryItem = new ItineraryItem({
    tripId,
    name,
    origin: {
      type: "Point",
      coordinates: origin
    },
    startTime,
    endTime,
    destination: {
      type: "Point",
      coordinates: destination
    },
    isFullDay,
    searchVariables
  })

  await Promise.all([
    newItineraryItem.save(),
    Trip.updateOne({ _id: tripId }, { $push: { itineraryItems: newItineraryItem._id } })
  ])


  res.success(201, { newItineraryItem })
}

export async function editItineraryItems(req: Request, res: Response) {
  const userId = req.user._id
  const data = EditItineraryValidator.safeParse({
    ...req.params,
    ...req.body
  })
  if (!data.success) return res.fail(400, "INVALID_BODY")

  const { tripId, name, origin, destination, isFullDay, startTime, endTime, searchVariables } = data.data

  const relation = await TripUserRel.findOne({ trip: tripId, user: userId })
  if (!relation) return res.fail(403, "NOT_MEMBER")

  await ItineraryItem.updateOne({ _id: data.data.itineraryId }, {
    name,
    origin: {
      type: "Point",
      coordinates: origin
    },
    startTime,
    endTime,
    destination: {
      type: "Point",
      coordinates: destination
    },
    isFullDay,
    searchVariables
  })
  res.success()
}

export async function createTripInvite(req: Request, res: Response) {
  const userId = req.user._id
  const data = TripDetailsValidator.safeParse(req.params)
  if (!data.success) return res.fail(400, "INVALID_BODY")

  const tripId = data.data.tripId

  const relation = await TripUserRel.findOne({ trip: tripId, user: userId })
  if (relation?.role !== "ADMIN") return res.fail(403, "NOT_ADMIN")

  const inviteToken = await generateInviteToken({ tripId })
  res.success(200, { tripId, inviteToken })
}


export async function tripInvite(req: Request, res: Response) {
  const userId = req.user._id
  const data = TripInviteValidator.safeParse(req.body)
  if (!data.success) return res.fail(400, "INVALID_BODY")

  const { inviteToken } = data.data

  try {
    const { payload: { tripId } } = await jwtVerify<{ tripId: string }>(inviteToken, generateUint8Array(env.INVITE_TOKEN_SECRET))
    const relation = await TripUserRel.findOne({ trip: tripId, user: userId })
    if (relation) return res.fail(403, "MEMBER")

    const newTripUserRel = new TripUserRel({
      user: userId,
      trip: tripId,
    })
    await newTripUserRel.save()
    res.success(200, { tripId })
  } catch (error) {
    //Token expired
    if (error instanceof JWTExpired) {
      return res.fail(410, "INVITE_LINK_EXPIRED", "The invitation link is no longer valid")
    }
    if (error instanceof JOSEError) {
      return res.fail(401, "INVALID_JWT")
    }
    return res.fail()
  }
}


const SearchTripsSchema = z.object({
  query: z.string()
})

export async function searchTrips(req: Request, res: Response) {
  const data = SearchTripsSchema.safeParse(req.query)
  if (!data.success) return res.fail(400, "INVALID")

  const query = data.data.query

  // ###LATER make sure to create an index on the search query field
  const trips = await ItineraryItem.aggregate([
    { $match: { "searchVariables.city": query } },
    {
      $group: {
        _id: "$tripId",
        searchScoreMatch: { $sum: 1 },
      }
    },
    {
      $sort: {
        searchScoreMatch: -1,
      }
    },
    {
      $lookup: {
        from: "trips",
        localField: "_id",
        foreignField: "_id",
        pipeline: [
          { $project: { name: 1 } }
        ],
        as: "trip"
      }
    },
    {
      $unwind: "$trip"
    },
  ])
  res.success(200, trips)
}

