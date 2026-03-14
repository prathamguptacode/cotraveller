import Group from "@/models/Group";
import JoinRequest from "@/models/JoinRequest";
import User from "@/models/User";


// DANGER! BEWARE! , May result in breaking, unreversable changes

const migrateRequests = async (isAllowedToRun: boolean) => {
    if (!isAllowedToRun) return
    
    const groups = await Group.find({})
    for (const group of groups) {
        const requesterIds = group.requests
        if (!requesterIds || !requesterIds.length)
            for (const requesterId of requesterIds) {
                const joinRequest = await JoinRequest.create({ groupId: group._id, requesterId })
                await User.updateOne({ _id: requesterId }, { $push: { outgoingRequests: joinRequest._id } })
                await Group.updateOne({ _id: group._id }, { $push: { incomingRequests: joinRequest._id } })
            }
    }

    await User.updateMany({}, { $unset: { requests: 1 } })
    await Group.updateMany({}, { $unset: { requests: 1 } })
    console.log("ALL SET")
}


