import Navbar from '@/components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'

const SecondaryLayout = () => {
    return (
        <div style={{ marginTop: "65px" }}>
            <Navbar >
                <Navbar.Title />
                <Navbar.ThemeButton />
                <Navbar.LoginButton />
                <Navbar.CreateGroupButton />
                <Navbar.ProfileButton />
            </Navbar>
            <Outlet />
        </div>
    )
}

export default SecondaryLayout
