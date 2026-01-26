import commentSchema from "../models/commentSchema.js";
import xss from "xss";
import groupSchema from "../models/groupSchema.js";

export async function addComment(req,res) {
    const comment=xss(req.body?.comment);
    const author=req.user.fullName;
    const targetGroup=xss(req.body?.targetGroup);
    if(!comment){
        return res.fail(400,"INPUT_ERROR","comment not found")
    }
    if(!author){
        return res.fail(400,"INPUT_ERROR","author not found")
    }
    if(!targetGroup){
        return res.fail(400,"INPUT_ERROR","comtargetGroupment not found")
    }

    const commentDB = new commentSchema({
        comment,
        author,
        targetGroup
    })
    const data=await commentDB.save()
    await groupSchema.updateOne({"_id": targetGroup},{$push:{"comments": data._id}})
    res.success(201,"COMMENT",data)
}

export async function viewComment(req,res) {
    const id=xss(req.query?.q)
    if(!id) return res.fail(400,"INVALID_INPUT","ID not found")
    const data=await commentSchema.find({targetGroup: id})
    res.success(201,"COMMENT",data)
}