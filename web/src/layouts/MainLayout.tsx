import { Outlet } from 'react-router-dom'
import styles from './layouts.module.css'
import NavigationRail from './NavigationRail'
import BottomNavbar from './BottomNavbar'
import AddTrip from '@/features/addTrip/AddTrip'

const MainLayout = () => {
    return (
        <div className={styles.layout}>
            <NavigationRail />
            <AddTrip />
            <div className={styles.content}>
                <Outlet />
            </div>
            <BottomNavbar />
        </div>
    )
}

export default MainLayout
