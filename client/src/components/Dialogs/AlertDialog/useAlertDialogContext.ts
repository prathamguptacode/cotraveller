import { createContext, useContext, type RefObject } from "react"

type AlertDialogContextType = {
    dialogRef: RefObject<HTMLDialogElement | null>,
    toggleDialog: () => void
}

export const AlertDialogContext = createContext<AlertDialogContextType | null>(null)

export const useAlertDialogContext = () => {
    const ctx = useContext(AlertDialogContext)
    if (!ctx) throw new Error("Cannot access Alert dialog context outside provider")
    return ctx
}