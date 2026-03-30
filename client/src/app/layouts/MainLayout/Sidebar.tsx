import { Link } from 'react-router-dom'
import styles from './sidebar.module.css'
import { Home, Inbox, LogOut, MessageCircle, Search, Settings, Users } from 'lucide-react'
import { MdOutlineFeedback } from 'react-icons/md'
import { Suspense, type JSX } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/api/axios'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import ThreeDotLoader from '@/components/Loaders/ThreeDotLoader'
import { useMainLayoutContext } from './useMainLayout'
import SidebarChatsPreview from '@/features/chats/components/SidebarChatsPreview'
import SidebarInboxPreview from '@/features/inbox/components/SidebarInboxPreview'


type SidebarTab = 'Groups' | 'Chats' | 'Inbox' | 'Search'



const Sidebar = () => {
    const { currentSidebarTab, setCurrentSidebarTab, sidebarIsHidden, setSidebarIsHidden } = useMainLayoutContext()
    const { user } = useAuth()


    const sidebarTabs: { name: SidebarTab, icon: JSX.Element }[] = [
        { name: 'Chats', icon: <MessageCircle /> },
        { name: 'Groups', icon: <Users /> },
        { name: 'Inbox', icon: <Inbox /> },
        { name: 'Search', icon: <Search /> }
    ]

    const { mutate: logout } = useMutation({
        mutationFn: () => api.post('/auth/logout'),
        onSuccess: () => window.location.reload(),
        onError: () => toast.error("An error occurred", {
            description: "Something went wrong !"
        })
    })



    return (
        <aside className={styles.sidebarsWrapper} style={{ width: sidebarIsHidden ? '80px' : '' }}>
            <div className={styles.primarySidebar}>
                <div className={styles.primarySidebarList}>
                    <Link to={'/'}><Home /></Link>
                    {sidebarTabs.map(sidebarTab => {
                        return (
                            <button aria-label={sidebarTab.name} key={sidebarTab.name} onClick={() => {
                                setSidebarIsHidden(false)
                                setCurrentSidebarTab(sidebarTab.name)
                            }}>{sidebarTab.icon}</button>
                        )
                    })}
                </div>
                <div className={styles.primarySidebarList}>
                    <Link to={'#'}><Settings /></Link>
                    <Link to={'/feedback'}><MdOutlineFeedback /></Link>
                    {user && <button aria-label='Logout' onClick={() => logout()}><LogOut /></button>}
                </div>

            </div>
            <div className={styles.contextualSidebar}>
                <div className={styles.ctxSidebarHeader}>
                    <h2>{currentSidebarTab}</h2>
                </div>
                <div className={styles.ctxSidebarList}>
                    {user ? <ErrorBoundary fallback={<div className={styles.fallbackWrapper}>An Error Occurred</div>}>
                        <Suspense fallback={<div className={styles.fallbackWrapper}><ThreeDotLoader /></div>}>
                            {
                                currentSidebarTab == 'Chats' ? <SidebarChatsPreview /> :
                                    currentSidebarTab == 'Inbox' ? <SidebarInboxPreview /> :
                                        <div className={styles.fallbackWrapper}>Coming Soon !</div>
                            }
                        </Suspense>
                    </ErrorBoundary> :
                        <div className={styles.fallbackWrapper}>Login to view</div>
                    }
                </div>
            </div>

        </aside>
    )
}

export default Sidebar
