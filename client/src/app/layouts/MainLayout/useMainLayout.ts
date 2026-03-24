import { createContext, useContext } from "react"
import type { Dispatch, SetStateAction } from "react"
import type { Notifications, SidebarTab } from "./types"

type MainLayoutContextType = {
    notifications: Notifications,
    setNotifications: Dispatch<SetStateAction<Notifications>>,
    currentSidebarTab: SidebarTab,
    setCurrentSidebarTab: Dispatch<SetStateAction<SidebarTab>>,
    sidebarIsHidden: boolean,
    setSidebarIsHidden: Dispatch<SetStateAction<boolean>>
}

export const MainLayoutContext = createContext<MainLayoutContextType | null>(null)

export const useMainLayoutContext = () => {
    const ctx = useContext(MainLayoutContext)
    if (!ctx) throw new Error('Cannot access MainLayoutContext outside provider')
    return ctx
}