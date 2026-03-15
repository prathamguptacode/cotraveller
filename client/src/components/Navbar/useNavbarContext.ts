import { createContext, useContext, type Dispatch, type RefObject, type SetStateAction } from "react"
import type { Notifications, SidebarTab } from "./types"

type NavbarContextType = {
    setCurrentTab: Dispatch<SetStateAction<SidebarTab>>,
    currentTab: SidebarTab,
    setIsHidden: Dispatch<SetStateAction<boolean>>,
    isHidden: boolean,
    menuRef: RefObject<HTMLDivElement | null>,
    notifications: Notifications,
    setNotifications: Dispatch<SetStateAction<Notifications>>
}


export const NavbarContext = createContext<NavbarContextType | null>(null)

export const useNavbarContext = () => {
    const ctx = useContext(NavbarContext)
    if (!ctx) throw new Error("Cannot access context outside of navbar")
    return ctx
}