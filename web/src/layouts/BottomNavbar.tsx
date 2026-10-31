import { NavLink } from 'react-router-dom'
import styles from './layouts.module.css'
import { ChatTeardropIcon, MagnifyingGlassIcon, UsersThreeIcon } from '@phosphor-icons/react'
import clsx from 'clsx'
import avatar from '@/assets/leon.jpeg'
import AddTrip from '@/features/addTrip/AddTrip'

const BottomNavbar = () => {
    return (
        <nav data-mobile-nav className={styles.bottomNavbar}>
            <NavLink className={({ isActive }) => {
                return clsx(isActive && styles.bottomNavActiveLink, styles.bottomNavItem)
            }} to={'/'}>
                <span>
                    <UsersThreeIcon />
                </span>
                <span>
                    Trips
                </span>
            </NavLink>

            <NavLink className={({ isActive }) => {
                return clsx(isActive && styles.bottomNavActiveLink, styles.bottomNavItem)
            }} to={'/search'}>
                <span>
                    <MagnifyingGlassIcon />
                </span>
                <span>
                    Search
                </span>
            </NavLink>

            <div className={styles.bottomNavItem} >
                <AddTrip />
                <span>Create</span>
            </div>

            <NavLink className={({ isActive }) => {
                return clsx(isActive && styles.bottomNavActiveLink, styles.bottomNavItem)
            }} to={'/direct'}>
                <span>
                    <ChatTeardropIcon />
                </span>
                <span>
                    Chats
                </span>
            </NavLink>

            {/* <NavLink className={({ isActive }) => {
                return clsx(isActive && styles.bottomNavActiveLink, styles.bottomNavItem)
            }} to={'/me'}>
                <span className={styles.imageWrapper}>
                    <img src={avatar} alt="display-picture" />
                </span>
                <span>You</span>
            </NavLink> */}

        </nav >
    )
}

export default BottomNavbar
