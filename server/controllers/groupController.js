import groupSchema from "../models/groupSchema.js";
import xss from 'xss'
import moment from "moment-timezone";


export async function addGroup(req,res) {
    const title=xss(req.body?.title);
    const content=xss(req.body?.content);
    const owner=xss(req.body?.owner);
    const memberNumber=xss(req.body?.memberNumber);
    const mode=xss(req.body?.mode);
    const travelDate=xss(req.body?.travelDate);
    const intialLocation=xss(req.body?.travelDate);

    if(!title) res.fail(400,"INPUT_ERROR","title not found")
    if(!content) res.fail(400,"INPUT_ERROR","content not found")
    if(!owner) res.fail(400,"INPUT_ERROR","owner not found")
    if(!memberNumber) res.fail(400,"INPUT_ERROR","memberNumber not found")
    if(!mode) res.fail(400,"INPUT_ERROR","mode not found")
    if(!travelDate) res.fail(400,"INPUT_ERROR","travelDate not found")
    if(!intialLocation) res.fail(400,"INPUT_ERROR","intialLocation not found")
    
    //telling mongo that date formate is ist
    const istDate = moment.tz(travelDate, "Asia/Kolkata").toDate();

    const group=new groupSchema({title,content,owner,memberNumber,mode,travelDate:istDate,intialLocation})
    const data=await group.save()
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
    res.success(200,"FILTER",data)
}