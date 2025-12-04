import React from 'react'
import styles from './sidebar.module.css'
import clsx from 'clsx'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { Cog, Info, LogOut } from 'lucide-react'
import { callAuthApi } from '../../../api/axios'
import { useAuth } from '../../../hooks/useAuth'

const Sidebar = ({ isHidden, closeSidebar }) => {

    const { user } = useAuth()

    const handleLogout = async () => {

        const { status, data } = await callAuthApi('post', '/auth/logout')

        if (status == 204) window.location.href = '/'
        else console.error('SOMETHING WENT WRONG')
    }




    return (
        <div className={clsx(styles.wrapper, !isHidden && styles.showSidebar)}>
            <div className={styles.header}>
                <NavLink to={'/groups'} className={({ isActive }) =>
                    isActive ? styles.activeTab : ''
                }>Groups</NavLink>
                <NavLink to={'/inbox'} className={({ isActive }) =>
                    isActive ? styles.activeTab : ''
                }>Inbox</NavLink>

            </div>

            <Outlet context={{ closeSidebar }} />

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
