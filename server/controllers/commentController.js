import commentSchema from "../models/commentSchema.js";
import xss from "xss";
export async function addComment(req,res) {
    const comment=xss(req.body?.comment);
    const aurthor=xss(req.body?.aurthor);
    const targetGroup=xss(req.body?.targetGroup);
    if(!comment){
        return res.fail(400,"INPUT_ERROR","comment not found")
    }
    if(!aurthor){
        return res.fail(400,"INPUT_ERROR","aurthor not found")
    }
    if(!targetGroup){
        return res.fail(400,"INPUT_ERROR","comtargetGroupment not found")
    }

    const commentDB = new commentSchema({
        comment,
        aurthor,
        targetGroup
    })

    const data=await commentDB.save()
    res.success(201,"COMMENT",data)
}

export async function viewComment(req,res) {
    const id=xss(req.query?.q)
    if(!id) return res.fail(400,"INVALID_INPUT","ID not found")
    const data=await commentSchema.find({targetGroup: id})
    res.success(201,"COMMENT",data)
}