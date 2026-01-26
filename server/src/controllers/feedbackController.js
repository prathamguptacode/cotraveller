import xss from "xss";
import feedback from "../models/feedback.js";

export async function feedbackController(req,res){
    const suggestion=xss(req.body?.suggestion)
    const bug=xss(req.body?.bug)
    const story=xss(req.body?.story)
    const feedbackData=new feedback({
        suggestion,
        bug,
        story
    })
    const data=await feedbackData.save()
    res.success(201,data)
}