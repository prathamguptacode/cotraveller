import styles from './sidebar.module.css'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Cog, Info, LogOut } from 'lucide-react'
import { callAuthApi } from '../../../api/axios'
import { useAuth } from '../../../hooks/useAuth'


const Sidebar = ({ isHidden, slot, setCurrentTab, currentTab }) => {

    const { user } = useAuth()

    const handleLogout = async () => {
        const { status } = await callAuthApi('post', '/auth/logout')

        if (status == 204) window.location.href = '/'
        else console.error('SOMETHING WENT WRONG')
    }





    return (
        //Stopped event bubbling to prevent trigger of isHidden Toggle due to onClick on Hamburger
        <div onScroll={(e)=>{
            e.stopPropagation()
            e.preventDefault()
        }} onClick={(e) => e.stopPropagation()} className={clsx(styles.wrapper, !isHidden && styles.showSidebar)}>
            <div className={styles.header}>
                <button className={currentTab === "Groups" ? styles.activeTab : ""} onClick={() => setCurrentTab('Groups')}>Groups</button>
                <button className={currentTab === "Inbox" ? styles.activeTab : ""} onClick={() => setCurrentTab('Inbox')}>Inbox</button>
                <button className={currentTab === "Outbox" ? styles.activeTab : ""} onClick={() => setCurrentTab('Outbox')}>Sent</button>

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
                <Link to={''} className={styles.listItem}>
                    <div className={styles.avatarWrapper} >
                        <Info />
                    </div>
                    <p className={styles.detailsWrapper}>
                        Help
                    </p>
                </Link>
                {user && <button onClick={handleLogout} className={styles.listItem}>
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
