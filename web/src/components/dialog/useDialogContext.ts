import { createContext, useContext, type Dispatch, type SetStateAction } from "react"

export type DialogContext = {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const DialogContext = createContext<DialogContext | null>(null)

export const useDialogContext = () => {
    const ctx = useContext(DialogContext)
    if (!ctx) throw new Error("Cannot access context outside provider")
    return ctx
}