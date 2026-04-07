import { useRef, useState, type ReactNode } from 'react'
import type { Notifications, SidebarTab } from './types'
import { MainLayoutContext } from './useMainLayout'




const MainLayoutProvider = ({ children }: { children: ReactNode }) => {
    const hamburgerRef = useRef<HTMLButtonElement>(null)

    const [currentSidebarTab, setCurrentSidebarTab] = useState<SidebarTab>('Chats')
    const [sidebarIsHidden, setSidebarIsHidden] = useState(false)
    const [notifications, setNotifications] = useState<Notifications>({ Chats: false, Inbox: false, Groups: false, Explore: false })

    const value = { notifications, setNotifications, currentSidebarTab, setCurrentSidebarTab, setSidebarIsHidden, sidebarIsHidden, hamburgerRef }

    return (
        <MainLayoutContext.Provider value={value}>
            {children}
        </MainLayoutContext.Provider>
    )
}

export default MainLayoutProvider
