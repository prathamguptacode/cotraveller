import { useRef, useState, type ReactNode } from 'react'
import type { Notifications, SidebarTab } from './types'
import { MainLayoutContext } from './useMainLayout'




const MainLayoutProvider = ({ children }: { children: ReactNode }) => {
    const hamburgerRef = useRef<HTMLButtonElement>(null)

    const [currentSidebarTab, setCurrentSidebarTab] = useState<SidebarTab>('Chats')
    const [sidebarIsHidden, setSidebarIsHidden] = useState(() => {
        if (window.matchMedia("(max-width:768px)").matches) return true
        return false
    })
    const [notifications, setNotifications] = useState<Notifications>({ Chats: false, Inbox: false })


    const value = { notifications, setNotifications, currentSidebarTab, setCurrentSidebarTab, setSidebarIsHidden, sidebarIsHidden, hamburgerRef }



    return (
        <MainLayoutContext.Provider value={value}>
            {children}
        </MainLayoutContext.Provider>
    )
}

export default MainLayoutProvider
