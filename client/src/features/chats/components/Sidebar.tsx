import styles from '../chats.module.css'
import { Cog, Info, LogOut, Mail, MessagesSquare, SendHorizontal } from 'lucide-react'
import { ToolTip } from './ToolTip'
import clsx from 'clsx'
import { callAuthApi } from '@/api/axios'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Groups from '@/components/SidebarTabs/Groups'
import Outbox from '@/components/SidebarTabs/Outbox'
import Inbox from '@/components/SidebarTabs/Inbox'


const Sidebar = () => {
    const [isHidden, setIsHidden] = useState(false)
    const [currentTab, setCurrentTab] = useState('Chats')


    const handleLogout = async () => {
        const { status } = await callAuthApi('post', '/auth/logout')
        if (status == 204) window.location.href = '/'
        else console.error('SOMETHING WENT WRONG')
    }

    return (
        <>
            <div className={styles.sidebarWrapper}>

                <div className={styles.list}>
                    <button aria-label='Chats' onClick={() => setCurrentTab('Chats')} className={styles.listItem}>
                        <MessagesSquare size={28} />
                        <ToolTip text={'Chats'} />
                    </button>
                    <button aria-label='Inbox' onClick={() => setCurrentTab('Inbox')} className={styles.listItem}>
                        <Mail size={26} />
                        <ToolTip text={'Inbox'} />

                    </button>
                    <button aria-label='Sent' onClick={() => setCurrentTab('Sent')} className={styles.listItem}>
                        <SendHorizontal size={26} />
                        <ToolTip text={'Sent'} />
                    </button>
                </div>

                <div className={clsx(styles.list, styles.footerList)}>
                    <button aria-label='Settings' className={styles.listItem}>
                        <Cog size={28} />
                        <ToolTip text={'Settings'} />
                    </button>
                    <Link aria-label='Feedback' to={'/feedback'} className={styles.listItem}>
                        <Info size={26} />
                        <ToolTip text={'Feedback'} />
                    </Link>
                    <button aria-label='Logout' onClick={handleLogout} className={styles.listItem}>
                        <LogOut size={26} />
                        <ToolTip text={'Logout'} />
                    </button>
                </div>

            </div>
            <div className={styles.sidebarExpansionWrapper}>
                <div className={styles.expansionHeader}>
                    <h2>{currentTab}</h2>
                </div>
                {currentTab === "Chats" ? <Groups setIsHidden={setIsHidden} /> : currentTab === "Inbox" ? <Inbox setIsHidden={setIsHidden} /> : <Outbox setIsHidden={setIsHidden} />}
            </div>
        </>
    )
}

export default Sidebar
