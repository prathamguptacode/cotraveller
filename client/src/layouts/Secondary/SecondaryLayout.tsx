import Navbar from '@/components/homepage/Navbar'
import { Outlet } from 'react-router-dom'

const SecondaryLayout = () => {
    return (
        <div style={{ marginTop: "65px" }}>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default SecondaryLayout
