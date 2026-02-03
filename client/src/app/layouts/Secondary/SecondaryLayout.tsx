import Navbar from '@/components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'

const SecondaryLayout = () => {
    return (
        <div style={{ marginTop: "65px" }}>
            <Navbar >
                <Navbar.Hamburger />
                <Navbar.Title />
                <Navbar.ThemeButton />
                <Navbar.Inbox />
                <Navbar.LoginButton />
                <Navbar.CreateGroupButton />
                <Navbar.ProfileButton />
            </Navbar>
            <Outlet />
        </div>
    )
}

export default SecondaryLayout
