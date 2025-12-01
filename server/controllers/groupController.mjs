import groupSchema from "../models/groupSchema.mjs";
import xss from 'xss'
export async function addGroup(req,res) {
    const title=xss(req.body?.title);
    const content=xss(req.body?.content);
    const owner=xss(req.body?.owner);
    const memberNumber=xss(req.body?.memberNumber);

    if(!title) res.fail(400,"INPUT_ERROR","title not found")
    if(!content) res.fail(400,"INPUT_ERROR","content not found")
    if(!owner) res.fail(400,"INPUT_ERROR","owner not found")
    if(!memberNumber) res.fail(400,"INPUT_ERROR","memberNumber not found")

    const group=new groupSchema({title,content,owner,memberNumber})
    const data=await group.save()
    res.success(201,"GROUP_CREATER",data)
}
