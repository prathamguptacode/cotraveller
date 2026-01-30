import { Outlet } from 'react-router-dom'
import Navbar from '@/features/home/components/Navbar'

const MainLayout = () => {

    return (
        <div style={{ marginTop: "65px" }}>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default MainLayout
