import { useState, type ReactNode } from 'react'
import type { Notifications, SidebarTab } from './types'
import { MainLayoutContext } from './useMainLayout'




const MainLayoutProvider = ({ children }: { children: ReactNode }) => {
    const [currentSidebarTab, setCurrentSidebarTab] = useState<SidebarTab>('Chats')
    const [sidebarIsHidden, setSidebarIsHidden] = useState(false)
    const [notifications, setNotifications] = useState<Notifications>({ Chats: false, Inbox: false, Groups: false })

    const value = { notifications, setNotifications, currentSidebarTab, setCurrentSidebarTab, setSidebarIsHidden, sidebarIsHidden }

    return (
        <MainLayoutContext.Provider value={value}>
            {children}
        </MainLayoutContext.Provider>
    )
}

export default MainLayoutProvider
