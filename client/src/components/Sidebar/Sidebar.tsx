import styles from './sidebar.module.css'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Cog, Inbox as InboxLogo, Info, LogOut, MessagesSquare } from 'lucide-react'
import { api } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { Suspense, type JSX } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ErrorBoundary } from 'react-error-boundary'
import { useNavbarContext } from '../../app/layouts/Navbar/useNavbarContext'
import type { SidebarTab } from '../../app/layouts/Navbar/types'
import ThreeDotLoader from '../Loaders/ThreeDotLoader'



type SidebarProps = {
    slot: JSX.Element,
    currentTab: SidebarTab
}


const Sidebar = ({ slot, currentTab }: SidebarProps) => {

    const { user } = useAuth()
    const { setCurrentTab, isHidden } = useNavbarContext()


    const { mutate: logout } = useMutation({
        mutationFn: () => api.post('/auth/logout'),
        onSuccess: () => window.location.reload(),
        onError: () => toast.error("An error occurred", {
            description: "Something went wrong !"
        })
    })






    return (
        //Stopped event bubbling to prevent trigger of isHidden Toggle due to onClick on Hamburger
        <div onScroll={(e) => {
            e.stopPropagation()
            e.preventDefault()
        }} onClick={(e) => e.stopPropagation()} className={clsx(styles.wrapper, !isHidden && styles.showSidebar)}>
            <div className={styles.header}>
                <button aria-label='Groups' className={currentTab === "Groups" ? styles.activeTab : ""} onClick={() => setCurrentTab('Groups')}>
                    <MessagesSquare size={20} />
                    Chats
                </button>
                <button aria-label='Inbox' className={currentTab === "Inbox" ? styles.activeTab : ""} onClick={() => setCurrentTab('Inbox')}>
                    <InboxLogo size={20} />
                    Inbox
                </button>
            </div>
            <ErrorBoundary fallback={<p>Nothing here</p>}>
                <Suspense fallback={<div className={styles.fallbackWrapper}><ThreeDotLoader /></div>}>
                    {slot}
                </Suspense>
            </ErrorBoundary>


            <div className={clsx(styles.list, styles.footerList)}>
                <Link to={'#'} className={styles.listItem}>
                    <div className={clsx(styles.iconWrapper, styles.avatarWrapper)} >
                        <Cog />
                    </div>
                    <p className={styles.detailsWrapper}>
                        Settings
                    </p>
                </Link>
                <Link to={'/feedback'} className={styles.listItem}>
                    <div className={styles.avatarWrapper} >
                        <Info />
                    </div>
                    <p className={styles.detailsWrapper}>
                        Feedback
                    </p>
                </Link>
                {user && <button aria-label='Logout' onClick={() => logout()} className={styles.listItem}>
                    <div className={clsx(styles.iconWrapper, styles.avatarWrapper)} >
                        <LogOut />
                    </div>
                    <p className={styles.detailsWrapper}>
                        Logout
                    </p>
                </button>}

            </div>
        </div >
    )
}

export default Sidebar
