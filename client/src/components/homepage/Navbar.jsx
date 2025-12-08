import { GiHamburgerMenu } from "react-icons/gi";
import mystyle from './homepage.module.css'
import ThemeButton from '../Buttons/ThemeButton';
import Sidebar from './Sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import Groups from "./Sidebar/Groups";
import Inbox from "./Sidebar/Inbox";
import Outbox from "./Sidebar/Outbox";
import { Birdhouse, Mail } from "lucide-react";
import { AiFillHome } from "react-icons/ai";
import { useAuth } from "../../hooks/useAuth";

function Navbar({ pageIsWide }) {
    const [isHidden, setisHidden] = useState(true)
    const [logged, setLogged] = useState(false)
    const menuRef = useRef()
    const inboxRef = useRef()
    const closeSidebar = () => {
        setisHidden(true)
    }
    const [currentTab, setCurrentTab] = useState('')
    const { user } = useAuth()
    useEffect(() => {
        if (user) {
            return setLogged(true)
        }
    }, [])

    // $$$please include profile picture feature

    return (
        <div className={mystyle.navbar}>
            {!pageIsWide &&
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
            }
            <Link className={mystyle.homeBtn} to={'/'}>
                <Birdhouse strokeWidth={1.4} size={26} />
                {/* <AiFillHome size="24px" /> */}
            </Link>
            <Link to={'/'} className={mystyle.logo}>Cotraveller</Link>

            <div className={mystyle.nobox}></div>
            <div className={mystyle.themebtn}><ThemeButton /></div>
            {!pageIsWide && <button onClick={() => {
                setisHidden(false)
                setCurrentTab('Inbox')
            }} onBlur={(e) => {
                if (menuRef.current.contains(e.relatedTarget)) return
                setisHidden(true)
            }} className={mystyle.mail}><Mail strokeWidth={1.4} size={26} /> </button>}
            {
                logged ? null : <Link to={'/signup'} className={mystyle.navbtn}>Sign up</Link>
            }
            {
                logged ? null : <Link to={'/login'} className={mystyle.navbtn}>Log in</Link>
            }
            <Link to={'/creategroup'} className={mystyle.navbtn}>Create group</Link>
        </div>
    )
}

export default Navbar
