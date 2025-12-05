import { GiHamburgerMenu } from "react-icons/gi";
import mystyle from './homepage.module.css'
import ThemeButton from '../Buttons/ThemeButton';
import { IoIosMail } from "react-icons/io";
import Sidebar from './Sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { useRef, useState } from "react";
import Groups from "./Sidebar/Groups";
import Inbox from "./Sidebar/Inbox";
import Outbox from "./Sidebar/Outbox";

function Navbar() {
    const [isHidden, setisHidden] = useState(true)
    const menuRef = useRef()
    const inboxRef = useRef()
    const closeSidebar = () => {
        setisHidden(true)
    }
    const [currentTab, setCurrentTab] = useState('')

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


            <div className={mystyle.logo}><Link to='/'>Cotraveller</Link></div>

            <div className={mystyle.nobox}></div>
            <div className={mystyle.themebtn}><ThemeButton /></div>
            <button onClick={() => {
                setisHidden(false)
                setCurrentTab('Inbox')
            }} onBlur={(e) => {
                if (menuRef.current.contains(e.relatedTarget)) return
                setisHidden(true)
            }} className={mystyle.mail}><IoIosMail size={28} /> </button>
            <Link to={'/signup'} className={mystyle.navbtn}>Sign up</Link>
            <Link to={'/login'} className={mystyle.navbtn}>Log in</Link>
            <Link to={'/creategroup'} className={mystyle.navbtn}>Create group</Link>
        </div>
    )
}

export default Navbar
