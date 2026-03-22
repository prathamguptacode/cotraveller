import { Link } from 'react-router-dom'
import styles from './sidebar.module.css'
import { Home, Inbox, LogOut, MessageCircle, Search, Settings, Users } from 'lucide-react'
import { MdOutlineFeedback } from 'react-icons/md'
import { Suspense, type Dispatch, type JSX, type SetStateAction } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/api/axios'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import ThreeDotLoader from '@/components/Loaders/ThreeDotLoader'


type SidebarTab = 'Groups' | 'Chats' | 'Inbox' | 'Search'

type SidebarProps = {
    currentSidebarTab: SidebarTab,
    setCurrentSidebarTab: Dispatch<SetStateAction<SidebarTab>>,
    slot: JSX.Element,
    isHidden: boolean,
    setIsHidden: Dispatch<SetStateAction<boolean>>
}



const Sidebar = ({ currentSidebarTab, setCurrentSidebarTab, slot, isHidden, setIsHidden }: SidebarProps) => {
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
        <aside className={styles.sidebarsWrapper} style={{ width: isHidden ? '80px' : '' }}>
            <div className={styles.primarySidebar}>
                <div className={styles.primarySidebarList}>
                    <Link to={'/'}><Home /></Link>
                    {sidebarTabs.map(sidebarTab => {
                        return (
                            <button aria-label={sidebarTab.name} key={sidebarTab.name} onClick={() => {
                                setIsHidden(false)
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
                    {user ? <ErrorBoundary fallback={<div className={styles.fallbackWrapper}>Error Loading data</div>}>
                        <Suspense fallback={<div className={styles.fallbackWrapper}><ThreeDotLoader /></div>}>
                            {slot}
                        </Suspense>
                    </ErrorBoundary> :
                        <div className={styles.fallbackWrapper}>Login to view your shit</div>
                    }
                </div>
            </div>

        </aside>
    )
}

export default Sidebar
