import commentSchema from "../models/commentSchema";
import xss from "xss";
import groupSchema from "../models/groupSchema";
import { RequestHandler } from "express";

export const addComment: RequestHandler = async (req, res) => {
    const comment = xss(req.body?.comment);
    const author = req.user.fullName;
    const targetGroup = xss(req.body?.targetGroup);
    if (!comment) {
        return res.fail(400, "INPUT_ERROR", "comment not found")
    }
    if (!author) {
        return res.fail(400, "INPUT_ERROR", "author not found")
    }
    if (!targetGroup) {
        return res.fail(400, "INPUT_ERROR", "comtargetGroupment not found")
    }

    const commentDB = new commentSchema({
        comment,
        author,
        targetGroup
    })
    const data = await commentDB.save()
    await groupSchema.updateOne({ "_id": targetGroup }, { $push: { "comments": data._id } })
    res.success(201, data, "Comment added successfully")
}

export const viewComment: RequestHandler = async (req, res) => {
    const query = req.query.q
    if (!query || typeof query !== 'string') return res.fail(400, "INVALID_ID")
        
    const id = xss(query)
    if (!id) return res.fail(400, "INVALID_INPUT", "ID not found")
    const data = await commentSchema.find({ targetGroup: id })
    res.success(200, data)
}