import { Outlet } from 'react-router-dom'
import styles from './layouts.module.css'
import NavigationRail from './NavigationRail'

const MainLayout = () => {
    return (
        <div className={styles.layout}>
            <NavigationRail />
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout
