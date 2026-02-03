import groupSchema, { GroupType } from "../models/groupSchema";
import xss from 'xss'
import moment from "moment-timezone";
import User, { UserType } from "../models/User";
import mongoose from "mongoose";
import { accecptedNotification, newMemberJoinedNotification, rejectedNotification, sendRequestNotification } from "../services/nodemailer";
import { RequestHandler } from "express";
import * as z from "zod";
import { fetchOutgoingRequestsController } from "./userController";
import commentSchema from "@/models/commentSchema";

const GroupSchema = z.object({
    title: z.string(),
    content: z.string(),
    owner: z.string(),
    memberNumber: z.string(),
    mode: z.string(),
    travelDate: z.string(),
    intialLocation: z.string(),
})

export const addGroup: RequestHandler = async (req, res) => {
    const parsedData = GroupSchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "INPUT_ERROR", "Invalid input data")

    const { title, content, owner, memberNumber, mode, travelDate, intialLocation } = parsedData.data

    //telling mongo that date formate is ist
    const istDate = moment.tz(travelDate, "Asia/Kolkata").toDate();

    const group = new groupSchema({ title, content, owner, memberNumber, mode, travelDate: istDate, intialLocation, member: [owner] })
    const data = await group.save()
    await User.updateOne({ _id: owner }, { $push: { memberGroup: data._id } })
    res.success(201, data, "Group Created Successfully")
}

export const viewGroup: RequestHandler = async (req, res) => {
    const { groupId } = req.params

    const group = await groupSchema.findById(groupId).populate({ path: 'member', select: 'fullName' }).populate({ path: 'comments', select: 'author comment' })
    res.success(200, { group })

}

export const editGroup: RequestHandler = async (req, res) => {
    const userId = req.user._id;
    const { groupId } = req.params
    //checking user is owner?
    const group = await groupSchema.findById(groupId)
    if (!group) return res.fail(404, "GROUP_NOT_FOUND", "The requested group does not exist")
    if (!group.owner.equals(userId)) return res.fail(403, "UNAUTHORIZED_USER", "Permission denied")


    const parsedData = GroupSchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "INPUT_ERROR", "Invalid input data")

    const { title, content, memberNumber, mode, travelDate, intialLocation } = parsedData.data

    //telling mongo that date formate is ist
    const istDate = moment.tz(travelDate, "Asia/Kolkata").toDate();

    await groupSchema.updateOne({ _id: group }, { title, content, memberNumber, mode, travelDate: istDate, intialLocation, })
    res.success(200)
}

export const viewGroupByFilter: RequestHandler = async (req, res) => {
    const FilterSchema = z.object({
        mode: z.string(),
        intialLocation: z.string(),
        lowerTime: z.string(),
        upperTime: z.string(),
    })
    const parsedData = FilterSchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "INPUT_ERROR", "Invalid input data")

    const lowerTime = xss(parsedData.data.lowerTime)
    const upperTime = xss(parsedData.data.upperTime)
    const mode = xss(parsedData.data.mode)
    const intialLocation = xss(parsedData.data.intialLocation)

    // const utcTime = moment.tz(istTime, "Asia/Kolkata").utc().format();for converting time
    const utcLowerTime = moment.tz(lowerTime, "Asia/Kolkata").utc().toDate()
    const utcUpperTime = moment.tz(upperTime, "Asia/Kolkata").utc().toDate()
    const data = await groupSchema.aggregate([
        {
            $match: {
                mode: mode,
                intialLocation: intialLocation,
                travelDate: { $gte: utcLowerTime, $lte: utcUpperTime },

                //if membernumber is reached
                $expr: {
                    $lt: [
                        { $size: "$member" },
                        "$memberNumber"
                    ]
                }

            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: "ownerPop"
            }
        },
        {
            $unwind: "$ownerPop"
        },
        {
            $project: {
                ownerPop: {
                    fullName: 1
                },
                title: 1,
                _id: 1,
                content: 1,
                travelDate: 1,
                requests: 1,
                comments: 1,
            }
        }

    ])
    res.success(200, { groups: data })
}

export const addRequest: RequestHandler = async (req, res) => {
    const user = req.user
    const userId = user._id
    const { groupId } = req.params

    const group = await groupSchema.findById<Omit<GroupType, 'member'> & { member: UserType[] }>(groupId).populate({ path: 'member', select: 'fullName email' })
    if (!group) return res.fail(404, "GROUP_NOT_FOUND", "The group does not exist")

    const { requests, member } = group
    if (requests.includes(userId)) return res.fail(409, "REQUEST_ALREADY_SENT", "You have already sent a request to the group")

    const memberIds = member.map((e) => e._id.toString())

    if (memberIds.includes(userId.toString())) return res.fail(409, "ALREADY_A_MEMBER", "You are already a member of the group")

    const updatedGroup = await groupSchema.updateOne({ _id: groupId }, { $push: { requests: userId } })
    await User.updateOne({ _id: userId }, { $push: { requests: groupId } })

    const memberEmails = group.member.map(obj => obj.email)
    sendRequestNotification(memberEmails, user.fullName, group.title)
    res.success(201, { group: updatedGroup }, "Request Sent Successfully")
}

//for homepage hamburger request seeing so that they can accept
export const viewRequest: RequestHandler = async (req, res) => {
    const userID = xss(req.body?.userID)
    if (!userID) {
        return res.fail(400, "INPUT_ERROR", "userID not found")
    }
    const tempUser = await User.findById(userID)
    if (!tempUser) {
        return res.fail(400, "INPUT_ERROR", "No such user")
    }
    const group = await groupSchema.find({ member: userID })
    res.success(200, group)
}



export const acceptIncomingRequestController: RequestHandler = async (req, res) => {
    const requestId = req.params.requestId
    const groupId = req.params.groupId
    if (typeof groupId !== 'string' || typeof requestId !== 'string') return res.fail(400, "INVALID_REQUEST_PARAMS", "Group ID and Request ID must be strings")


    const group = await groupSchema.findOne<Omit<GroupType, 'member'> & { member: UserType[] }>({ _id: groupId, requests: requestId }).populate({ path: 'member', select: 'email' }).select('member title')
    if (!group) return res.fail(404, "RESOURCE_NOT_FOUND", "The associated group or request does not exist")


    //Checking if member limit is available
    if (group.memberNumber === group.member.length) return res.fail(403, 'MEMBER_LIMIT', 'Group already has maximum possible members')

    await groupSchema.updateOne({ _id: groupId }, { $pull: { requests: requestId }, $push: { member: requestId } })
    const user = await User.findOneAndUpdate({ _id: requestId }, { $pull: { requests: groupId }, $push: { memberGroup: groupId } }, { returnDocument: 'after' })

    if (!user) return res.fail(400, "USER_NOT_FOUND", "User no longer exists");
    //Send notification to all members of the group about acceptance as well as to the user being accepted
    const previousMemberEmails = group.member.map(obj => obj.email)

    accecptedNotification(user.email, user.fullName, group.title, groupId)
    newMemberJoinedNotification(previousMemberEmails, user.fullName, group.title, groupId)

    res.success()


}

export const declineIncomingRequestController: RequestHandler = async (req, res) => {
    const requestId = req.params.requestId
    const groupId = req.params.groupId
    if (typeof groupId !== 'string' || typeof requestId !== 'string') return res.fail(400, "INVALID_REQUEST_PARAMS", "Group ID and Request ID must be strings")

    const group = await groupSchema.findOne({ _id: groupId, requests: requestId })
    if (!group) return res.fail(404, "RESOURCE_NOT_FOUND", "The associated group or request does not exist")


    //Updating db for removed request
    await groupSchema.updateOne({ _id: groupId }, { $pull: { requests: requestId } })
    const user = await User.findOneAndUpdate({ _id: requestId }, { $pull: { requests: groupId } }, { returnDocument: 'after' })
    if (!user) return res.fail(400, "USER_NOT_FOUND", "User no longer exists");

    //Sending notification to requestee about declining
    rejectedNotification(user.email, user.fullName, group.title)

    res.sendStatus(204)
}


export const groupnumber: RequestHandler = async (req, res) => {
    const val = await groupSchema.aggregate([
        {
            $group: {
                _id: "$mode",
                count: { $sum: 1 }
            }
        }
    ])
    res.success(200, val)
}

export const addComment: RequestHandler = async (req, res) => {
    const userId = req.user._id
    const { groupId } = req.params
    const parsedData = z.object({ comment: z.string({ error: "Invalid Comment" }).min(1, { error: "Comment cannot be empty" }) }).safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "INPUT_ERROR", parsedData.error.issues[0].message)
    const commentText = xss(parsedData.data.comment)

    const comment = await commentSchema.create({ comment: commentText, author: userId, targetGroup: groupId })
    await groupSchema.updateOne({ _id: groupId }, { $push: { comments: comment._id } })
    res.success(201, { comment }, "Comment added successfully")
}