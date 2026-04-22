import { z } from "zod";
import type { groupFormSchema } from "./schemas";

// GroupForms

export type GroupFormSchema = z.infer<typeof groupFormSchema>


// GroupInfo

export type Comment = {
    _id: string,
    author: {
        _id: string,
        avatar: {
            publicId: string,
            version: number
        },
        username: string,
        fullName: string
    },
    comment: string,
    createdAt: string,
    updatedAt: string
}

export type Member = {
    _id: string,
    fullName: string,
    username: string,
    avatar: {
        publicId: string,
        version: number
    }
}

export type Group = {
    _id: string,
    requests: string[],
    member: Member[],
    travelDate: string,
    title: string,
    content: string,
    mode: string,
    intialLocation: string,
    incomingRequests: string[],
}