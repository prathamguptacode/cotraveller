import Group, { GroupType } from "../models/Group";
import xss from 'xss'
import moment from "moment-timezone";
import User, { UserType } from "../models/User";
import { accecptedNotification, newMemberJoinedNotification, rejectedNotification, sendRequestNotification } from "../services/nodemailer";
import { RequestHandler } from "express";
import * as z from "zod";
import commentSchema, { CommentType } from "@/models/Comment";
import { eventBus } from "@/events/eventBus";
import JoinRequest from "@/models/JoinRequest";
import ConversationRecord from "@/models/ConversationRecord";
import Comment from "@/models/Comment";
import { Types } from "mongoose";

const allowedTags = ["Alcohol free", "Boys only", "Girls only", "Backpacking"] as const
const allowedMode = ["Train", "Flight", "Taxi", "Car", "Bike", "Others"] as const

const GroupSchema = z.object({
    title: z.string(),
    content: z.string(),
    owner: z.string(),
    memberNumber: z.number(),
    mode: z.enum(allowedMode),
    travelDate: z.string(),
    intialLocation: z.string(),
    tags: z.array(z.enum(allowedTags)).max(4).optional(),
})

// ### we send  create grp --> ind time

export const addGroup: RequestHandler = async (req, res) => {
    if (!req.body) return res.fail(400, "INPUT_ERROR", "Invalid input data");
    req.body.owner = req.user._id.toString();
    const parsedData = GroupSchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "INPUT_ERROR", "Invalid input data")
    const { title, content, owner, memberNumber, mode, travelDate, intialLocation, tags } = parsedData.data

    const checkDate = moment(travelDate, moment.ISO_8601, true).isValid();
    if (!checkDate) {
        return res.fail(400, "INPUT_ERROR", "Invalid input date")
    }

    //telling mongo that date formate is ist
    const istDate = moment.tz(travelDate, "Asia/Kolkata").toDate();

    const group = new Group({ title, content, owner, memberNumber, mode, travelDate: istDate, intialLocation, member: [owner], tags })
    const data = await group.save()
    await User.updateOne({ _id: owner }, { $push: { memberGroup: data._id } })
    await ConversationRecord.create({ roomId: group._id, memberId: owner })
    res.success(201, data, "Group Created Successfully")
}

export const viewGroup: RequestHandler = async (req, res) => {
    const { groupId } = req.params
    if (typeof groupId !== 'string' || !groupId) return res.fail(400, "BAD_REQUEST")

    const conversationRecords = await ConversationRecord.find({ roomId: groupId })

    const group = await Group.findById(groupId).populate({ path: 'member', select: 'fullName avatar username' })

    res.success(200, { group, conversationRecords })

}

export const editGroup: RequestHandler = async (req, res) => {
    const userId = req.user._id;
    if (!req.body) return res.fail(400, "INPUT_ERROR", "Invalid input data");
    req.body.owner = req.user._id.toString();
    const { groupId } = req.params
    //checking user is owner?
    const group = await Group.findById(groupId)
    if (!group) return res.fail(404, "GROUP_NOT_FOUND", "The requested group does not exist")
    if (!group.owner.equals(userId)) return res.fail(403, "UNAUTHORIZED_USER", "Permission denied")


    const parsedData = GroupSchema.safeParse(req.body)
    if (!parsedData.success) return res.fail(400, "INPUT_ERROR", "Invalid input data")

    const { title, content, memberNumber, mode, travelDate, intialLocation } = parsedData.data

    //telling mongo that date formate is ist
    const istDate = moment.tz(travelDate, "Asia/Kolkata").toDate();

    await Group.updateOne({ _id: group }, { title, content, memberNumber, mode, travelDate: istDate, intialLocation, })
    res.success(200)
}

export const viewGroupByFilter: RequestHandler = async (req, res) => {
    const filterSchema = z.object({
        title: z.string().optional(),
        memberNumber: z.coerce.number().optional(),
        mode: z.enum(allowedMode).optional(),
        travelDate: z.string().optional(),
        travelTime: z.string().optional(),
        intialLocation: z.string().optional(),
        tags: z.array(z.enum(allowedTags)).max(4).optional(),
    })
    const validateData = filterSchema.safeParse(req.query);
    if (!validateData.success) return res.fail(400, "INPUT_ERROR", "Invalid input data");
    const { title, memberNumber, mode, travelDate, travelTime, intialLocation, tags } = validateData.data;
    if (travelDate && travelTime) {
        const dateCheck = `${travelDate}T${travelTime}`;
        const dateResult = moment(dateCheck, moment.ISO_8601, true).isValid();
        if (!dateResult) {
            return res.fail(400, "INPUT_ERROR", "Invalid input date or invalid time")
        }
    }
    if (travelDate) {
        const dateResult = moment(travelDate, moment.ISO_8601, true).isValid();
        if (!dateResult) {
            return res.fail(400, "INPUT_ERROR", "Invalid input date")
        }
    }
    let filter: z.infer<typeof filterSchema> = {};
    if (title) {
        filter.title = title;
    }
    if (mode) {
        filter.mode = mode;
    }
    if (intialLocation) {
        filter.intialLocation = intialLocation;
    }
    if (memberNumber) {
        filter.memberNumber = memberNumber;
    }
    const pipeline = [];
    pipeline.push({
        $match: {
            $expr: {
                $lt: [
                    { $size: "$member" },
                    "$memberNumber"
                ]
            }
        }
    })
    pipeline.push({ $match: filter });
    if (tags && tags.length > 0) {
        console.log(tags)
        pipeline.push({
            $match: {
                tags: { $in: tags }
            }
        })
    };
    if (travelDate) {
        let flag = 0;
        if (travelTime) {
            flag = 1;
            console.log(travelTime)
            const dateString = `${travelDate}T${travelTime}`;
            const date = new Date(dateString);
            date.setHours(date.getHours() - 2);
            const lowerTime = new Date(date);
            date.setHours(date.getHours() + 4);
            const upperTime = new Date(date);
            pipeline.push({
                $match: {
                    travelDate: { $gte: lowerTime, $lte: upperTime }
                }
            })
        }
        if (!flag) {
            const lowerTimeString = `${travelDate}T00:00`;
            const lowerTime = new Date(lowerTimeString);
            const upperTimeString = `${travelDate}T23:59`;
            const upperTime = new Date(upperTimeString);
            pipeline.push({
                $match: {
                    travelDate: { $gte: lowerTime, $lte: upperTime }
                }
            })
        }
    }
    pipeline.push({
        $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: '_id',
            as: "ownerPop"
        }
    })
    pipeline.push({
        $unwind: "$ownerPop"
    })
    pipeline.push(
        {
            $project: {
                ownerPop: {
                    fullName: 1
                },
                title: 1,
                _id: 1,
                content: 1,
                travelDate: 1,
                incomingRequests: 1,
                memberNumber: 1,
            }
        }
    )
    const groupData = await Group.aggregate(pipeline)
    res.success(200, { groups: groupData });

}

export const addRequest: RequestHandler = async (req, res) => {
    const user = req.user
    const userId = user._id
    const { groupId } = req.params

    const group = await Group.findById<Omit<GroupType, 'member'> & { member: UserType[] }>(groupId).populate({ path: 'member', select: 'fullName email' })
    if (!group) return res.fail(404, "GROUP_NOT_FOUND", "The group does not exist")

    const memberIds = group.member.map((e) => e._id.toString())
    const isAlreadyAMember = memberIds.includes(userId.toString())
    if (isAlreadyAMember) return res.fail(409, "ALREADY_A_MEMBER", "You are already a member of the group")

    const hasAlreadyRequested = await JoinRequest.exists({ requesterId: userId, groupId })
    if (hasAlreadyRequested) return res.fail(409, "REQUEST_ALREADY_SENT", "You have already sent a request to this group")

    const joinRequest = await JoinRequest.create({ groupId, requesterId: userId })
    const updatedGroup = await Group.updateOne({ _id: groupId }, { $push: { incomingRequests: joinRequest._id } })
    await User.updateOne({ _id: userId }, { $push: { outgoingRequests: joinRequest._id } })


    const memberEmails = group.member.map(obj => obj.email)
    sendRequestNotification(memberEmails, user.fullName, group.title)

    eventBus.emit('request_to_join_group:added', memberIds)

    res.success(201, { group: updatedGroup }, "Request Sent Successfully")
}

export const acceptIncomingRequestController: RequestHandler = async (req, res) => {
    const requestId = req.params.requestId
    const groupId = req.params.groupId
    if (typeof groupId !== 'string' || typeof requestId !== 'string') return res.fail(400, "INVALID_REQUEST_PARAMS", "Group ID and Request ID must be strings")


    const group = await Group.findOne<Omit<GroupType, 'member'> & { member: UserType[] }>({ _id: groupId, incomingRequests: requestId }).populate({ path: 'member', select: 'email' }).select('member title')
    if (!group) return res.fail(404, "RESOURCE_NOT_FOUND", "The associated group or request does not exist")

    const joinRequest = await JoinRequest.findById(requestId)
    if (!joinRequest) return res.fail(404, "RESOURCE_NOT_FOUND", "The associated group or request does not exist")

    //Checking if group-sizeLimit allows more members
    if (group.memberNumber >= group.member.length) return res.fail(403, 'MEMBER_LIMIT', 'Group already has maximum possible members')

    const user = await User.findOneAndUpdate({ _id: joinRequest.requesterId }, { $pull: { outgoingRequests: requestId }, $push: { memberGroup: groupId } }, { returnDocument: 'after' })
    if (!user) {
        await Group.updateOne({ _id: groupId }, { $pull: { incomingRequests: requestId } })
        await JoinRequest.deleteMany({ requesterId: joinRequest.requesterId })
        return res.fail(400, "USER_NOT_FOUND", "User no longer exists")
    }

    await Group.updateOne({ _id: groupId }, { $pull: { incomingRequests: requestId }, $push: { member: joinRequest.requesterId } })
    await JoinRequest.deleteOne({ _id: joinRequest._id })

    await ConversationRecord.create({ memberId: joinRequest.requesterId, roomId: groupId })

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

    const group = await Group.findOne({ _id: groupId, incomingRequests: requestId })
    if (!group) return res.fail(404, "RESOURCE_NOT_FOUND", "The associated group or request does not exist")

    const joinRequest = await JoinRequest.findById(requestId)
    if (!joinRequest) return res.fail(404, "RESOURCE_NOT_FOUND", "The associated group or request does not exist")


    //Updating db for removed request
    await Group.updateOne({ _id: groupId }, { $pull: { incomingRequests: requestId } })
    await JoinRequest.deleteOne({ _id: requestId })
    const user = await User.findOneAndUpdate({ _id: joinRequest.requesterId }, { $pull: { outgoingRequests: requestId } }, { returnDocument: 'after' })
    if (!user) return res.fail(400, "USER_NOT_FOUND", "User no longer exists")

    //Sending notification to requestee about declining
    rejectedNotification(user.email, user.fullName, group.title)

    res.sendStatus(204)
}

export const groupnumber: RequestHandler = async (req, res) => {
    const val = await Group.aggregate([
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

    const comment = await commentSchema.create({ comment: commentText, author: userId, group: groupId })
    res.success(201, { comment }, "Comment added successfully")
}

export const fetchGroupComments: RequestHandler = async (req, res) => {
    const { groupId } = req.params
    if (typeof groupId !== 'string' || !groupId) return res.fail(400, "BAD_REQUEST")
    const comments = await Comment.find({ group: groupId }).sort({ createdAt: -1 }).populate({ path: 'author', select: 'avatar fullName username' })

    return res.success(200, { comments })
}

export const deleteGroupComment: RequestHandler = async (req, res) => {
    const { commentId } = req.params
    const user = req.user

    const comment = await Comment.findById<Omit<CommentType, 'group'> & { group: { owner: Types.ObjectId } }>(commentId).populate({ path: 'group', select: 'owner' })
    if (!comment) return res.fail(404, "NOT_FOUND", "Comment does not exist")
    console.log(comment.author == user._id)
    if (!user._id.equals(comment.author) && !user._id.equals(comment.group.owner)) return res.fail(403, "FORBIDDEN", "An error occurred")

    await Comment.deleteOne({ _id: commentId })

    return res.sendStatus(204)
}

export const toggleLikeOnGroupComment: RequestHandler = async (req, res) => {
    const { commentId } = req.params
    const user = req.user

    const comment = await Comment.findById(commentId)
    if (!comment) return res.fail(404, "NOT_FOUND", "Comment does not exist")

    if (comment.likes.includes(user._id)) await Comment.updateOne({ _id: commentId }, { $pull: { likes: user._id } })
    else {
        comment.likes.push(user._id)
        await comment.save()
        console.log(comment)
    }

    return res.success()
}