import { NavLink } from 'react-router-dom'
import styles from './layouts.module.css'
import { ChatTeardropIcon, IslandIcon, MagnifyingGlassIcon, UsersThreeIcon } from '@phosphor-icons/react'
import avatar from '@/assets/leon.jpeg'
import clsx from 'clsx'
import AddTrip from '@/features/addTrip/AddTrip'

const NavigationRail = () => {
    return (
        <nav className={styles.navRail}>
            <div className={styles.railItems}>
                <NavLink data-item='logo' className={styles.railItem} to={'/'}>
                    <span>
                        <IslandIcon />
                    </span>
                </NavLink>

            </div>

            <div className={styles.railItems}>
                <div className={styles.railItem}>
                    <NavLink className={({ isActive }) => {
                        return clsx(isActive && styles.activeLink)
                    }} to={'/'}>
                        <span>
                            <UsersThreeIcon />
                        </span>
                    </NavLink>
                </div>
                <div className={styles.railItem}>
                    <NavLink className={({ isActive }) => {
                        return clsx(isActive && styles.activeLink)
                    }} to={'/search'}>
                        <span>
                            <MagnifyingGlassIcon />
                        </span>
                    </NavLink>
                </div>
                <div className={styles.railItem}>
                    <AddTrip />
                </div>
                <div className={styles.railItem}>
                    <NavLink className={({ isActive }) => {
                        return clsx(isActive && styles.activeLink)
                    }} to={'/direct'}>
                        <span>
                            <ChatTeardropIcon />
                        </span>
                    </NavLink>
                </div>
                <div className={styles.railItem}>
                    <NavLink className={({ isActive }) => {
                        return clsx(isActive && styles.activeLink)
                    }} to={'/me'}>
                        <span className={styles.imageWrapper}>
                            <img src={avatar} alt="display-picture" />
                        </span>
                    </NavLink>
                </div>

            </div>
        </nav >
    )
}

export default NavigationRail
