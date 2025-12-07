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
                            author: '$author.fullName',
                            text: 1,
                            createdAt: 1,
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
                path: '$lastMessage',
                preserveNullAndEmptyArrays: true
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
        {
            $sort: { 'lastMessage.createdAt': -1 }
        }







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
                _id: 0,
                memberGroup: 1,
            }
        },
        {
            $lookup: {
                from: 'groups',
                let: { ids: '$memberGroup' },
                pipeline: [
                    {
                        $match: { $expr: { $in: ['$_id', '$$ids'] } }
                    },
                    {
                        $project: {
                            title: 1,
                            requests: 1,
                            createdAt: 1,
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            let: { ids: '$requests' },
                            pipeline: [
                                {
                                    $match: { $expr: { $in: ['$_id', '$$ids'] } }
                                },
                                {
                                    $project: {
                                        fullName: 1,
                                    }
                                }
                            ],
                            as: 'requestee'
                        }
                    },
                    {
                        $unwind: '$requestee'
                    },
                    {
                        $sort: { _id: 1, createdAt: -1 }
                    },
                    {
                        $project: {
                            createdAt: 0,
                            requests: 0,
                        }
                    }
                ],
                as: 'groups'
            }
        },
        {
            $project: {
                groups: 1,
            }
        }





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




