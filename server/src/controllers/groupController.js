import groupSchema from "../models/groupSchema.js";
import xss from 'xss'
import moment from "moment-timezone";
import User from "../models/User.js";
import mongoose from "mongoose";
import { accecptedNotification, memberLeftNotification, newMemberJoinedNotification, rejectedNotification, sendRequestNotification } from "../services/nodemailer.js";


export async function addGroup(req, res) {
    const title = xss(req.body?.title);
    const content = xss(req.body?.content);
    const owner = req.user._id;
    const memberNumber = xss(req.body?.memberNumber);
    const mode = xss(req.body?.mode);
    const travelDate = xss(req.body?.travelDate);
    const intialLocation = xss(req.body?.intialLocation);

    if (!title) return  res.fail(400, "INPUT_ERROR", "title not found")
    if (!content) return res.fail(400, "INPUT_ERROR", "content not found")
    if (!owner) return res.fail(400, "INPUT_ERROR", "owner not found")
    if (!memberNumber) return res.fail(400, "INPUT_ERROR", "memberNumber not found")
    if (!mode) return res.fail(400, "INPUT_ERROR", "mode not found")
    if (!travelDate) return res.fail(400, "INPUT_ERROR", "travelDate not found")
    if (!intialLocation) return res.fail(400, "INPUT_ERROR", "intialLocation not found")

    //telling mongo that date formate is ist
    const istDate = moment.tz(travelDate, "Asia/Kolkata").toDate();

    const group = new groupSchema({ title, content, owner, memberNumber, mode, travelDate: istDate, intialLocation, member: [owner] })
    const data = await group.save()
    await User.updateOne({ _id: owner }, { $push: { memberGroup: data._id } })
    res.success(201, "GROUP_CREATER", data)
}

export async function viewGroup(req, res) {
    const id = xss(req.query?.q);
    if (!id) {
        res.fail(400, "INVALID_INPUT")
    }
    try {
        const val = new mongoose.Types.ObjectId(id)
        const data = await groupSchema.where('_id').equals(val).populate({ path: 'member', select: 'fullName' }).populate({ path: 'comments', select: 'author comment' })
        res.success(200, data)
    } catch (error) {
        res.fail(400, "INVALID_ID")
    }
}

export async function editGroup(req, res) {
    const user = req.user._id;
    const group = req.query?.q;

    //checking user is owner?
    const tempGroup = await groupSchema.findById(group)
    if (!tempGroup) {
        return res.fail(400, "INVALID_GROUP")
    }
    const owner = tempGroup.owner;
    if (! owner.equals(user)) {
        return res.fail(403, "UNAUTHORIZED_USER")
    }

    const title = xss(req.body?.title);
    const content = xss(req.body?.content);
    const memberNumber = xss(req.body?.memberNumber);
    const mode = xss(req.body?.mode);
    const travelDate = xss(req.body?.travelDate);
    const intialLocation = xss(req.body?.intialLocation);

    if (!title) return res.fail(400, "INPUT_ERROR", "title not found")
    if (!content) return res.fail(400, "INPUT_ERROR", "content not found")
    if (!memberNumber) return res.fail(400, "INPUT_ERROR", "memberNumber not found")
    if (!mode) return res.fail(400, "INPUT_ERROR", "mode not found")
    if (!travelDate) return res.fail(400, "INPUT_ERROR", "travelDate not found")
    if (!intialLocation) return res.fail(400, "INPUT_ERROR", "intialLocation not found")

    //telling mongo that date formate is ist
    const istDate = moment.tz(travelDate, "Asia/Kolkata").toDate();

    await groupSchema.updateOne({_id: group},{ title, content, memberNumber, mode, travelDate: istDate, intialLocation,})
    res.success(200)
}

export async function viewGroupByFilter(req, res) {
    const lowerTime = xss(req.body?.lowerTime)
    const upperTime = xss(req.body?.upperTime)
    const mode = xss(req.body?.mode)
    const intialLocation = xss(req.body?.intialLocation)
    if (!lowerTime) {
        res.fail(400, "INPUT_ERROR", "time not found")
        return
    }
    if (!upperTime) {
        res.fail(400, "INPUT_ERROR", "time not found")
        return
    }
    if (!mode) {
        res.fail(400, "INPUT_ERROR", "mode not found")
        return
    }
    if (!intialLocation) {
        res.fail(400, "INPUT_ERROR", "intialLocation not found")
        return
    }
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
    res.success(200, data, "FILTER")
}

export const addRequest = async (req, res) => {
    const user = req.user
    const userID = user._id
    if (!userID) {
        return res.fail(400, "INPUT_ERROR", "userID not found")
    }
    const groupID = xss(req.body?.groupID)
    if (!groupID) {
        return res.fail(400, "INPUT_ERROR", "groupID not found")
    }
    const tempUser = await User.findById(userID)
    const Populatedgroup = await groupSchema.where('_id').equals(groupID).populate({ path: 'member', select: 'fullName email' })
    const tempGroup = Populatedgroup[0]
    if (!tempUser) {
        return res.fail(400, "INPUT_ERROR", "No such user")
    }
    if (!tempGroup) {
        return res.fail(400, "INPUT_ERROR", "No such group")
    }
    const requestArr = tempGroup.requests
    if (requestArr.includes(userID)) {
        return res.fail(400, "INPUT_ERROR", "user has already send a request")
    }
    const member = tempGroup.member
    const memberId = member.map((e) => {
        return e._id.toString()
    })
    if (memberId.includes(userID.toString())) {
        return res.fail(400, "INPUT_ERROR", "member cannot send the request")
    }
    const data = await groupSchema.updateOne({ _id: groupID }, { $push: { requests: userID } })
    await User.updateOne({ _id: userID }, { $push: { requests: groupID } })
    member.forEach((e) => {
        sendRequestNotification(e.email, tempUser.fullName, tempGroup.title)
    })
    res.success(201, "REQUEST_CREATED", data)
}

//for homepage hamburger request seeing so that they can accept
export const viewRequest = async (req, res) => {
    const userID = xss(req.body?.userID)
    if (!userID) {
        return res.fail(400, "INPUT_ERROR", "userID not found")
    }
    const tempUser = await User.findById(userID)
    if (!tempUser) {
        return res.fail(400, "INPUT_ERROR", "No such user")
    }
    const tempGroup = await groupSchema.find({ member: userID })
    res.success(200, tempGroup)
}

//adding to db requests acctually
// export const addDBrequests = async (req, res) => {
//     const userID = xss(req.body?.userID)
//     if (!userID) {
//         return res.fail(400, "INPUT_ERROR", "userID not found")
//     }
//     const tempUser = await User.findById(userID)
//     if (!tempUser) {
//         return res.fail(400, "INPUT_ERROR", "No such user")
//     }
//     const requestID = xss(req.body?.requestID)
//     if (!requestID) {
//         return res.fail(400, "INPUT_ERROR", "requestID not found")
//     }
//     const requserUser = await User.findById(requestID)
//     if (!requserUser) {
//         return res.fail(400, "INPUT_ERROR", "No such user")
//     }
//     const groupID = xss(req.body?.groupID)
//     if (!groupID) {
//         return res.fail(400, "INPUT_ERROR", "groupID not found")
//     }
//     const tempGroup = await groupSchema.findById(groupID)
//     if (!tempGroup) {
//         return res.fail(400, "INPUT_ERROR", "No such group")
//     }
//     const tempmember = tempGroup.member
//     const temprequest = tempGroup.requests
//     if (!tempmember.includes(userID)) {
//         return res.fail(400, "INPUT_ERROR", "You do not have permission")
//     }
//     if (!temprequest.includes(requestID)) {
//         return res.fail(400, "INPUT_ERROR", "userReq do not have permission")
//     }

//     const data = await groupSchema.updateOne({ _id: groupID }, { $pull: { requests: requestID }, $push: { dbrequests: requestID } })
//     await User.updateOne({ _id: requestID }, { $push: { dbrequests: groupID }, $pull: { requests: groupID } })
//     res.success(200, data)
// }

export const addMember = async (req, res) => {
    const ownerMember = req.user?._id;
    const userID = xss(req.body?.userID)
    if (!ownerMember) {
        return res.fail(400, "INPUT_ERROR", "member id not found")
    }
    if (!userID) {
        return res.fail(400, "INPUT_ERROR", "userID not found")
    }
    const tempUser = await User.findById(userID)
    if (!tempUser) {
        return res.fail(400, "INPUT_ERROR", "No such user")
    }
    const groupID = xss(req.body?.groupID)
    if (!groupID) {
        return res.fail(400, "INPUT_ERROR", "groupID not found")
    }
    const tempGroup = await groupSchema.findById(groupID)
    if (!tempGroup) {
        return res.fail(400, "INPUT_ERROR", "No such group")
    }
    if (!tempGroup.member.includes(ownerMember)) {
        return res.fail(404, "NOT ALLOWED")
    }
    if (tempGroup.member.includes(userID)) {
        return res.fail(403, "NOT_PERMITTED");
    }

    const data = await groupSchema.updateOne(
        { _id: groupID },
        { $push: { member: userID }, $pull: { requests: userID } }
    );
    await User.updateOne({ _id: userID }, { $push: { memberGroup: groupID }, $pull: { requests: groupID } })
    accecptedNotification(tempUser.email, tempUser.fullName, tempGroup.title)
    res.success(201, data)
}

//leaving group
export const leaveGroup = async (req, res) => {
    const { user: { _id: userID, fullName } } = req.user
    const groupID = xss(req.params?.groupId)
    if (!userID) {
        return res.fail(400, "INVALID_INPUT", "userID not found")
    }
    if (!groupID) {
        return res.fail(400, "INVALID_DATA", "groupID not found")
    }

    const tempUser = await User.findById(userID)
    const tempGroup = await groupSchema.findById(groupID)
    if (!tempUser) {
        return res.fail(400, "INPUT_ERROR", "No such user")
    }
    if (!tempGroup) {
        return res.fail(400, "INPUT_ERROR", "No such group")
    }
    if (!(tempGroup.member).includes(userID)) {
        return res.fail(400, "INPUT_ERROR", "user is not authorizated to do so")
    }
    const updatedGroup = await groupSchema.findOneAndUpdate({ _id: groupID }, { $pull: { member: userID } }, { returnDocument: 'after' })
    await User.updateOne({ _id: userID }, { $pull: { memberGroup: groupID } })

    const previousMemberEmails = updatedGroup.member.map(obj => obj.email)
    memberLeftNotification(previousMemberEmails, fullName, tempGroup.title, groupID)

    //204 status code cannot have anything with e.g. body or message
    res.sendStatus(204)
}

//to get member info i need this route
export const memberInfo = async (req, res) => {
    const id = req.query?.q;
    // if(!id) res.fail(400,"INVALID_INPUT")
    // const user=await User.findById(id)
    // if(!user) res.fail(400,"INVALID_USER")
    // res.success(200,user.fullName)
    res.success(200, "df")
}



export const acceptIncomingRequestController = async (req, res) => {
    const requestId = req.params.requestId
    const groupId = req.params.groupId

    const group = await groupSchema.findOne({ _id: groupId, requests: requestId }).populate({ path: 'member', select: 'email' }).select('member title')
    if (!group) return res.fail(404, "RESOURCE_NOT_FOUND", "The associated group or request does not exist")


    //Checking if member limit is available
    if (group.memberNumber === group.member.length) return res.fail(403, 'MEMBER_LIMIT', 'Group already has maximum possible members')

    await groupSchema.updateOne({ _id: groupId }, { $pull: { requests: requestId }, $push: { member: requestId } })
    const user = await User.findOneAndUpdate({ _id: requestId }, { $pull: { requests: groupId }, $push: { memberGroup: groupId } }, { returnDocument: 'after' })

    //Send notification to all members of the group about acceptance as well as to the user being accepted
    const previousMemberEmails = group.member.map(obj => obj.email)

    accecptedNotification(user.email, user.fullName, group.title, groupId)
    newMemberJoinedNotification(previousMemberEmails, user.fullName, group.title, groupId)

    res.success()


}

export const declineIncomingRequestController = async (req, res) => {
    const requestId = req.params.requestId
    const groupId = req.params.groupId

    const group = await groupSchema.findOne({ _id: groupId, requests: requestId })
    if (!group) return res.fail(404, "RESOURCE_NOT_FOUND", "The associated group or request does not exist")


    //Updating db for removed request
    await groupSchema.updateOne({ _id: groupId }, { $pull: { requests: requestId } })
    const user = await User.findOneAndUpdate({ _id: requestId }, { $pull: { requests: groupId } }, { returnDocument: 'after' })

    //Sending notification to requestee about declining
    rejectedNotification(user.email, user.fullName, group.title)

    res.sendStatus(204)
}


export const groupnumber = async (req, res) => {
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