import { Link, Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar/Navbar'
import styles from './main.module.css'
import { Home, Inbox, LogOut, MessageCircle, Search, Settings, Users } from 'lucide-react'
import { MdOutlineFeedback } from 'react-icons/md'

const MainLayout = () => {

    return (
        <div className={styles.wrapper}>
            <aside className={styles.sidebarsWrapper}>
                <div className={styles.primarySidebar}>
                    <div className={styles.primarySidebarList}>
                        <Link to={'/'}><Home /></Link>
                        <button><MessageCircle /></button>
                        <button><Users /></button>
                        <button><Inbox /></button>
                        <button><Search /></button>
                    </div>
                    <div className={styles.primarySidebarList}>
                        <Link to={'#'}><Settings /></Link>
                        <Link to={'/feedback'}><MdOutlineFeedback /></Link>
                        <button><LogOut /></button>
                    </div>

                </div>
                <div className={styles.contextualSidebar}>
                    <div className={styles.ctxSidebarHeader}>
                        <h2>Chats</h2>
                    </div>
                    <div className={styles.ctxSidebarList}>
                        <div></div>
                    </div>
                </div>

            </aside>
            <div className={styles.heroWrapper}>
                <Navbar >
                    <Navbar.Hamburger />
                    <Navbar.Title />
                    <Navbar.ThemeButton />
                    <Navbar.Inbox />
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
