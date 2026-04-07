import { Outlet } from 'react-router-dom'
import Navbar from '@/app/layouts/MainLayout/Navbar'
import styles from './main.module.css'
import Sidebar from './Sidebar'
import MainLayoutProvider from './MainLayoutProvider'
import BottomNavbar from './BottomNavbar'



const MainLayout = () => {
    

    return (
        <MainLayoutProvider>
            <div className={styles.wrapper}>
                <Sidebar />
                <BottomNavbar />
                <div className={styles.heroWrapper}>
                    <Navbar>
                        <Navbar.Hamburger />
                        <Navbar.Title />
                        <Navbar.ThemeButton />
                        <Navbar.LoginButton />
                        <Navbar.CreateGroupButton />
                        <Navbar.ProfileButton />
                    </Navbar>
                    <Outlet />
                </div>
            </div>
        </MainLayoutProvider>
    )
}

export default MainLayout
