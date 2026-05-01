import { createContext, useContext } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { GroupFormSchema } from '../types'

export const GroupFormContext = createContext<UseFormReturn<GroupFormSchema> | null>(null)

export const useGroupForm = () => {
    const ctx = useContext(GroupFormContext)
    if (!ctx) throw new Error('Cannot access GroupForm context outside provider')
    return ctx
}