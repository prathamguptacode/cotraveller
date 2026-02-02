import styles from '@/features/home/sidebar.module.css'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Cog, Info, LogOut } from 'lucide-react'
import { api } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import type { Dispatch, JSX } from 'react'
import type { SidebarTab } from './Navbar'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'



type SidebarProps = {
    isHidden: boolean,
    slot: JSX.Element,
    setCurrentTab: Dispatch<React.SetStateAction<SidebarTab>>,
    currentTab: SidebarTab
}


const Sidebar = ({ isHidden, slot, setCurrentTab, currentTab }: SidebarProps) => {

    const { user } = useAuth()


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
                <button aria-label='Groups' className={currentTab === "Groups" ? styles.activeTab : ""} onClick={() => setCurrentTab('Groups')}>Groups</button>
                <button aria-label='Inbox' className={currentTab === "Inbox" ? styles.activeTab : ""} onClick={() => setCurrentTab('Inbox')}>Inbox</button>
                <button aria-label='Sent' className={currentTab === "Outbox" ? styles.activeTab : ""} onClick={() => setCurrentTab('Outbox')}>Sent</button>
            </div>

            {slot}

            <div className={clsx(styles.list, styles.footerList)}>
                <Link to={''} className={styles.listItem}>
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
