import env from "@/config/env";
import Group from "@/models/Group";
import JoinRequest from "@/models/JoinRequest";
import MigrationScript from "@/models/MigrationScript";
import User from "@/models/User";


// DANGER! BEWARE! , May result in breaking, unreversable changes
//Right now, we manually call these in development by removing guards and 

const migrateRequests = async () => {
    if (env.MODE === 'development') return

    const migrationName = "Requests_Migration_To_JoinRequestSchema_Script_14_March_2026"
    const description = "This is to migrate requests from User and Group Schemas refrencing each other to instead reference a common requestId which contains neccessary info related to seen/unseen state for every group Member and inter-relation between Group and User"
    
    if (await MigrationScript.exists({ name: migrationName })) return

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

    console.log("Requests_Migration_To_JoinRequestSchema_Script_14_March_2026 has successfully completed running")

    await MigrationScript.create({ name: migrationName, description })
    console.log(`Successfully saved ${migrationName} migration details to db`)
}


