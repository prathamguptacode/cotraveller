import { GiHamburgerMenu } from "react-icons/gi";
import mystyle from './homepage.module.css'
import ThemeButton from '../Buttons/ThemeButton';
import Sidebar from './Sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { useRef, useState } from "react";
import Groups from "./Sidebar/Groups";
import Inbox from "./Sidebar/Inbox";
import Outbox from "./Sidebar/Outbox";
import { Mail, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { FaUser } from "react-icons/fa6";
import clsx from "clsx";

function Navbar() {
    const [isHidden, setisHidden] = useState(true)
    const menuRef = useRef()
    const inboxRef = useRef()
    const closeSidebar = () => {
        setisHidden(true)
    }
    const [currentTab, setCurrentTab] = useState('')
    const { user } = useAuth()


    // $$$please include profile picture feature

    return (
        <div className={mystyle.navbar}>

            <div ref={menuRef} role="button" tabIndex={0} onClick={() => {
                setisHidden(prev => {
                    prev && setCurrentTab('Groups')
                    return !prev
                })

            }} onBlur={(e) => {
                if (e.currentTarget.contains(e.relatedTarget) || e.relatedTarget === inboxRef.current) return
                setisHidden(true)
            }} className={mystyle.hamburger}>
                <GiHamburgerMenu size='20px' />

                <Sidebar currentTab={currentTab} slot={currentTab === "Inbox" ? <Inbox /> : currentTab === "Outbox" ? <Outbox /> : <Groups />} setCurrentTab={setCurrentTab} isHidden={isHidden} closeSidebar={closeSidebar} />
            </div>
            <Link to={'/'} className={mystyle.logo}>Cotraveller</Link>

            <div className={mystyle.themebtn}><ThemeButton /></div>
            <button onClick={() => {
                setisHidden(false)
                setCurrentTab('Inbox')
            }} onBlur={(e) => {
                if (menuRef.current.contains(e.relatedTarget)) return
                setisHidden(true)
            }} className={mystyle.mail}><Mail strokeWidth={1.4} size={26} /></button>
            {
                !user && <Link to={'/login'} className={mystyle.navbtn}>Log in</Link>
            }
            <Link to={'/creategroup'} className={clsx(mystyle.navbtn, mystyle.createGroupBtn)}>Create group</Link>
            <Link to={'/creategroup'} className={mystyle.plusBtn}><Plus /></Link>

            {/* pratham changed this to prevent error page */}
            {user && <Link className={mystyle.avatarWrapper} to={`/`}>
                {user.avatar?.publicUrl ? <img src="" alt="avatar" /> : <FaUser />
                }
            </Link>}
        </div>
    )
}

export default Navbar
