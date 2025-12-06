import Group from "../models/groupSchema.js"
import User from "../models/User.js"

export const fetchJoinedGroupsController = async (req, res) => {
    const user = req.user
    const groups = await User.aggregate([
        {
            $match: { _id: user._id }
        },
        {
            $project: {
                _id: 0,
                memberGroup: 1
            }
        },
        {
            $unwind: '$memberGroup'
        },
        {
            $lookup: {
                from: 'groups',
                localField: 'memberGroup',
                foreignField: '_id',
                as: 'memberGroup'
            }
        },
        {
            $project: {
                memberGroup: {
                    title: 1,
                    _id: 1,
                    messages: 1
                }
            }
        },
        {
            $unwind: '$memberGroup'
        },
        {
            $lookup: {
                from: 'messages',
                let: { roomId: '$memberGroup._id' },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ['$roomId', '$$roomId'] } }
                    },

                    {
                        $sort: { createdAt: -1 }
                    },
                    {
                        $limit: 1
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author'
                        }
                    },
                    {
                        $project: {
                            author: '$author.username',
                            text: 1,
                            _id: 0
                        }
                    },
                    {
                        $unwind: '$author'
                    }

                ],
                as: 'lastMessage'
            }
        },
        {
            $unwind: {
                path:'$lastMessage',
                preserveNullAndEmptyArrays:true
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: ['$memberGroup', '$$ROOT'] } }
        },
        {
            $project: {
                memberGroup: 0,
                messages: 0,
            }
        },







    ])
    res.success(200, { groups }, "GREAT SHIT NGL!")
}

export const fetchIncomingRequestsController = async (req, res) => {
    const user = req.user
    const inbox = await User.aggregate([
        {
            $match: { _id: user._id }
        },

        {
            $project: {
                dbrequests: 1,
            }
        },
        {
            $lookup: {
                from: 'groups',
                let: { dbrequests: '$dbrequests' },
                pipeline: [
                    {
                        $match: { $expr: { $in: ['$_id', '$$dbrequests'] } }
                    },
                    {
                        $project: {
                            title: 1,
                            memberNumber: 1,
                        }
                    }
                ],
                as: 'groups'
            }
        },


    ])
    res.success(200, { groups: inbox[0].groups })

}

// ###CHANGE all necessary shit to ACID instead of one by one
export const fetchOutgoingRequestsController = async (req, res) => {
    const user = req.user
    const outbox = await User.aggregate([
        {
            $match: { _id: user._id }
        },
        {
            $project: {
                requests: 1
            }
        },
        {
            $lookup: {
                from: 'groups',
                let: { requests: '$requests' },
                pipeline: [
                    {
                        $match: { $expr: { $in: ['$_id', '$$requests'] } }
                    },
                    {
                        $project: {
                            title: 1,
                            memberNumber: 1,
                        }
                    }
                ],
                as: 'groups'
            }
        }
    ])

    res.success(200, { groups: outbox[0].groups })
}

export const deleteOutgoingRequestController = async (req, res) => {
    const user = req.user
    const requestId = req.params?.requestId
    if (!requestId) return res.fail(400, "BAD_REQUEST", "Request id was missing")

    if (!await User.findOne({ _id: user._id, requests: requestId })) return res.fail(400, "REQUEST_NOT_FOUND", "The request does not exist")

    await User.updateOne({ _id: user._id }, { $pull: { requests: requestId } })
    await Group.updateOne({ _id: requestId }, { $pull: { requests: user._id } })

    res.sendStatus(204)
}


export const deleteIncomingRequestController = async (req, res) => {
    const user = req.user
    const dbrequestId = req.params?.dbrequestId
    if (!dbrequestId) return res.fail(400, "BAD_REQUEST", "Dbrequest id was missing")

    if (!await User.findOne({ _id: user._id, dbrequests: dbrequestId })) return res.fail(400, "DBREQUEST_NOT_FOUND", "The dbrequest does not exist")

    await User.updateOne({ _id: user._id }, { $pull: { dbrequests: dbrequestId } })
    await Group.updateOne({ _id: dbrequestId }, { $pull: { dbrequests: user._id } })

    res.sendStatus(204)
}

export const acceptIncomingRequestController = async (req, res) => {
    const user = req.user
    const dbrequestId = req.params?.dbrequestId
    if (!dbrequestId) return res.fail(400, "BAD_REQUEST", "Dbrequest id was missing")

    if (!await User.findOne({ _id: user._id, dbrequests: dbrequestId })) return res.fail(400, "DBREQUEST_NOT_FOUND", "The dbrequest does not exist")

    await User.updateOne({ _id: user._id }, { $pull: { dbrequests: dbrequestId }, $push: { memberGroup: dbrequestId } })
    await Group.updateOne({ _id: dbrequestId }, { $pull: { dbrequests: user._id }, $push: { member: user._id }, $inc: { memberNumber: 1 } })

    res.success()
}


