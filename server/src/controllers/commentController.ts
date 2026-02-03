import commentSchema from "../models/commentSchema";
import xss from "xss";
import groupSchema from "../models/groupSchema";
import { RequestHandler } from "express";



// export const viewComment: RequestHandler = async (req, res) => {
//     const query = req.query.q
//     if (!query || typeof query !== 'string') return res.fail(400, "INVALID_ID")
        
//     const id = xss(query)
//     if (!id) return res.fail(400, "INVALID_INPUT", "ID not found")
//     const data = await commentSchema.find({ targetGroup: id })
//     res.success(200, data)
// }