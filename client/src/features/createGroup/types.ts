import type { Mode } from "@/types/constants.types"

export type Group = {
    _id: string,
    requests: string[],
    memberNumber: string,
    comments: Comment[],
    travelDate: string,
    title: string,
    content: string,
    mode: Mode,
    intialLocation: string
}