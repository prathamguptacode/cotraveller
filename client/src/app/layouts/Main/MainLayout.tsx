import { Outlet } from 'react-router-dom'
import Navbar from '@/app/layouts/Navbar/Navbar'
import styles from './main.module.css'
import Sidebar from '../Sidebar/Sidebar'
import SidebarChatsPreview from '@/features/chats/components/SidebarChatsPreview'
import SidebarInboxPreview from '@/features/inbox/components/SidebarInboxPreview'
import { useState } from 'react'


type SidebarTab = 'Groups' | 'Chats' | 'Inbox' | 'Search'


const MainLayout = () => {

    const [currentSidebarTab, setCurrentSidebarTab] = useState<SidebarTab>('Chats')
    const [isHidden, setIsHidden] = useState(false)

    return (
        <div className={styles.wrapper}>
            <Sidebar isHidden={isHidden} setIsHidden={setIsHidden} currentSidebarTab={currentSidebarTab} setCurrentSidebarTab={setCurrentSidebarTab} slot={currentSidebarTab == 'Chats' ? <SidebarChatsPreview /> : currentSidebarTab == 'Inbox' ? <SidebarInboxPreview /> : <div className={styles.fallbackWrapper}>Coming Soon !</div>} />
            <div className={styles.heroWrapper}>
                <Navbar setIsHidden={setIsHidden} currentSidebarTab={currentSidebarTab} setCurrentSidebarTab={setCurrentSidebarTab} >
                    <Navbar.Hamburger />
                    <Navbar.Title />
                    <Navbar.ThemeButton />
                    {/* <Navbar.Inbox /> */}
                    <Navbar.LoginButton />
                    <Navbar.CreateGroupButton />
                    <Navbar.ProfileButton />
                </Navbar>
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout
