import groupSchema from "../models/groupSchema.js";
import xss from 'xss'
import moment from "moment-timezone";
import User from "../models/User.js";


export async function addGroup(req,res) {
    const title=xss(req.body?.title);
    const content=xss(req.body?.content);
    const owner=xss(req.body?.owner);
    const memberNumber=xss(req.body?.memberNumber);
    const mode=xss(req.body?.mode);
    const travelDate=xss(req.body?.travelDate);
    const intialLocation=xss(req.body?.intialLocation);

    if(!title) res.fail(400,"INPUT_ERROR","title not found")
    if(!content) res.fail(400,"INPUT_ERROR","content not found")
    if(!owner) res.fail(400,"INPUT_ERROR","owner not found")
    if(!memberNumber) res.fail(400,"INPUT_ERROR","memberNumber not found")
    if(!mode) res.fail(400,"INPUT_ERROR","mode not found")
    if(!travelDate) res.fail(400,"INPUT_ERROR","travelDate not found")
    if(!intialLocation) res.fail(400,"INPUT_ERROR","intialLocation not found")
    
    //telling mongo that date formate is ist
    const istDate = moment.tz(travelDate, "Asia/Kolkata").toDate();

    const group=new groupSchema({title,content,owner,memberNumber,mode,travelDate:istDate,intialLocation,member:[owner]})
    const data=await group.save()
    await User.updateOne({_id:owner},{$push:{memberGroup:data._id}})
    res.success(201,"GROUP_CREATER",data)
}

export async function viewGroup(req,res) {
    const data=await groupSchema.find()
    res.success(200,"GROUPS",data)
}

export async function viewGroupByFilter(req,res){
    const lowerTime=xss(req.body?.lowerTime)
    const upperTime=xss(req.body?.upperTime)
    const mode=xss(req.body?.mode)
    const intialLocation=xss(req.body?.intialLocation)
    if(!lowerTime){
        res.fail(400,"INPUT_ERROR","time not found")
        return
    }
    if(!upperTime){
        res.fail(400,"INPUT_ERROR","time not found")
        return
    }
    if(!mode){
        res.fail(400,"INPUT_ERROR","mode not found")
        return
    }
    if(!intialLocation){
        res.fail(400,"INPUT_ERROR","intialLocation not found")
        return
    }
    // const utcTime = moment.tz(istTime, "Asia/Kolkata").utc().format();for converting time
    const utcLowerTime=moment.tz(lowerTime,"Asia/Kolkata").utc().toDate()
    const utcUpperTime=moment.tz(upperTime,"Asia/Kolkata").utc().toDate()
    const data=await groupSchema.aggregate([
        {
            $match:{
                mode:mode,
                intialLocation:intialLocation,
                travelDate: {$gte: utcLowerTime, $lte: utcUpperTime}
            }
        }
    ])
    res.success(200,data,"FILTER")
}

export const addRequest=async (req,res)=>{
    const userID=xss(req.body?.userID)
    const groupID=xss(req.body?.groupID)
    if(!userID){
        return res.fail(400,"INPUT_ERROR","userID not found")
    }
    if(!groupID){
        return res.fail(400,"INPUT_ERROR","groupID not found")
    }
    const tempUser=await User.findById(userID)
    const tempGroup=await groupSchema.findById(groupID)
    if(!tempUser){
        return res.fail(400,"INPUT_ERROR","No such user")
    }
    if(!tempGroup){
        return res.fail(400,"INPUT_ERROR","No such group")
    }
    const requestArr=tempGroup.requests
    if(requestArr.includes(userID)){
        return res.fail(400,"INPUT_ERROR","user has already send a request")
    }
    const owner=tempGroup.owner
    if(owner.equals(userID)){
        return res.fail(400,"INPUT_ERROR","owner cannot send the request")
    }
    const data=await groupSchema.updateOne({_id:groupID},{$push:{requests:userID}})
    await User.updateOne({_id:userID},{$push:{requests:groupID}})
    res.success(201,"REQUEST_CREATED",data)
}

//for homepage hamburger request seeing so that they can accept
export const viewRequest=async (req,res)=>{
    const userID=xss(req.body?.userID)
    if(!userID){
        return res.fail(400,"INPUT_ERROR","userID not found")
    }
    const tempUser=await User.findById(userID)
    if(!tempUser){
        return res.fail(400,"INPUT_ERROR","No such user")
    }
    const tempGroup=await groupSchema.find({member: userID})
    res.success(200,tempGroup)
}

//adding to db requests acctually
export const addDBrequests=async (req,res)=>{
    const userID=xss(req.body?.userID)
    if(!userID){
        return res.fail(400,"INPUT_ERROR","userID not found")
    }
    const tempUser=await User.findById(userID)
    if(!tempUser){
        return res.fail(400,"INPUT_ERROR","No such user")
    }
    const requestID=xss(req.body?.requestID)
    if(!requestID){
        return res.fail(400,"INPUT_ERROR","requestID not found")
    }
    const requserUser=await User.findById(requestID)
    if(!requserUser){
        return res.fail(400,"INPUT_ERROR","No such user")
    }
    const groupID=xss(req.body?.groupID)
    if(!groupID){
        return res.fail(400,"INPUT_ERROR","groupID not found")
    }
    const tempGroup=await groupSchema.findById(groupID)
    if(!tempGroup){
        return res.fail(400,"INPUT_ERROR","No such group")
    }
    const tempmember=tempGroup.member
    const temprequest=tempGroup.requests
    if(! tempmember.includes(userID)){
        return res.fail(400,"INPUT_ERROR","You do not have permission")
    }
    if(! temprequest.includes(requestID)){
        return res.fail(400,"INPUT_ERROR","userReq do not have permission")
    }

    const data=await groupSchema.updateOne({_id:groupID},{$pull:{requests: requestID}, $push:{dbrequests: requestID} })
    await User.updateOne({_id:requestID},{$push:{dbrequests:groupID}, $pull:{requests:groupID}})
    res.success(200,data)
}

export const addMember=async (req,res)=>{
    const userID=xss(req.body?.userID)
    if(!userID){
        return res.fail(400,"INPUT_ERROR","userID not found")
    }
    const tempUser=await User.findById(userID)
    if(!tempUser){
        return res.fail(400,"INPUT_ERROR","No such user")
    }
    const groupID=xss(req.body?.groupID)
    if(!groupID){
        return res.fail(400,"INPUT_ERROR","groupID not found")
    }
    const tempGroup=await groupSchema.findById(groupID)
    if(!tempGroup){
        return res.fail(400,"INPUT_ERROR","No such group")
    }
    if(! (tempGroup.dbrequests).includes(userID)){
        return res.fail(403,"NOT_PERMITTED");
    }

    const data = await groupSchema.updateOne(
        { _id: groupID },
        { $push: { member: userID }, $pull: { dbrequests: userID } }
    );
    await User.updateOne({_id:userID},{$push:{memberGroup:groupID},$pull:{dbrequests:groupID}})
    res.success(201,data)
}

//leaving group
export const leaveGroup=async (req,res)=>{
    const userID=xss(req.body?.userID)
    const groupID=xss(req.body?.groupID)
    if(!userID){
        return res.fail(400,"INVALID_INPUT","userID not found")
    }
    if(!groupID){
        return res.fail(400,"INVALID_DATA","groupID not found")
    }

    const tempUser=await User.findById(userID)
    const tempGroup=await groupSchema.findById(groupID)
    if(!tempUser){
        return res.fail(400,"INPUT_ERROR","No such user")
    }
    if(!tempGroup){
        return res.fail(400,"INPUT_ERROR","No such group")
    }
    if(! (tempGroup.member).includes(userID)){
        return res.fail(400,"INPUT_ERROR","user is not authorizated to do so")
    }
    await groupSchema.updateOne({_id:groupID},{$pull:{member:userID}})
    res.success(204,"USER_DELETED","user leaft the group")
}

//to get member info i need this route
export const memberInfo=async (req,res)=>{
    const id=req.query?.q;
    if(!id) res.fail(400,"INVALID_INPUT")
    const user=await User.findById(id)
    if(!user) res.fail(400,"INVALID_USER")
    res.success(200,user.fullName)
}