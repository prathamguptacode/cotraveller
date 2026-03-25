import { z } from "zod";


export const groupForm1Schema = z.object({
    title: z.string().min(5, 'minimum 5 characters required*'),
    content: z.string().min(8, 'minimum 8 characters are required*'),
})

export const groupForm2Schema = z.object({
    travelDate: z.string().min(1, 'Travel date is required'),
    travelTime: z.string().min(1, 'Travel time is required'),
    mode: z.string().min(1, 'Transport is required'),
    intialLocation: z.string().min(1, 'Initial location is required'),
    memberNumber: z.coerce.number().min(1, 'Number of people is required'),
})

export const groupFormSchema = z.object({ ...groupForm1Schema.shape, ...groupForm2Schema.shape })
