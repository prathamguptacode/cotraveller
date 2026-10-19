import { NavLink } from 'react-router-dom'
import styles from './layouts.module.css'
import { ChatTeardropIcon, MagnifyingGlassIcon, PlusIcon, UsersThreeIcon } from '@phosphor-icons/react'
import clsx from 'clsx'
import avatar from '@/assets/leon.jpeg'

const BottomNavbar = () => {
    return (
        <nav className={styles.bottomNavbar}>
            <NavLink className={({ isActive }) => {
                return clsx(isActive && styles.bottomNavActiveLink, styles.bottomNavItem)
            }} to={'/trips'}>
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

            <NavLink className={({ isActive }) => {
                return clsx(isActive && styles.bottomNavActiveLink, styles.bottomNavItem)
            }} to={'/trips/create'}>
                <span>
                    <PlusIcon />
                </span>
                <span>
                    Create
                </span>
            </NavLink>

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

            <NavLink className={({ isActive }) => {
                return clsx(isActive && styles.bottomNavActiveLink, styles.bottomNavItem)
            }} to={'/me'}>
                <span className={styles.imageWrapper}>
                    <img src={avatar} alt="display-picture" />
                </span>
                <span>You</span>
            </NavLink>

        </nav >
    )
}

export default BottomNavbar
