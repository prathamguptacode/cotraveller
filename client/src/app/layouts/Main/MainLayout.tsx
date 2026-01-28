import { Outlet } from 'react-router-dom'
import Navbar from '@/components/homepage/Navbar'

const MainLayout = () => {

    return (
        <div style={{ marginTop: "65px" }}>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default MainLayout
