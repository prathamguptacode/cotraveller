import { Response } from "express"

export const sseRegistry = new Map<string, Set<Response>>()