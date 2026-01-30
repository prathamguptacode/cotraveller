import { GiHamburgerMenu } from "react-icons/gi";
import mystyle from '../home.module.css'
import ThemeButton from '@/components/Buttons/ThemeButton';
import Sidebar from '@/features/home/components/Sidebar';
import { Link } from 'react-router-dom';
import { useRef, useState } from "react";
import Groups from "@/components/SidebarTabs/Groups";
import Inbox from "@/components/SidebarTabs/Inbox";
import Outbox from "@/components/SidebarTabs/Outbox";
import { Mail, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FaUser } from "react-icons/fa6";
import clsx from "clsx";


export type SidebarTab = 'Groups' | 'Inbox' | 'Outbox'


function Navbar() {
    const [isHidden, setIsHidden] = useState(true)
    const menuRef = useRef<HTMLDivElement>(null)

    const [currentTab, setCurrentTab] = useState<SidebarTab>('Groups')
    const { user } = useAuth()


    // $$$please include profile picture feature

    return (
        <div className={mystyle.navbar}>

            <div ref={menuRef} role="button" tabIndex={0} onClick={() => {
                setIsHidden(prev => {
                    prev && setCurrentTab('Groups')
                    return !prev
                })

            }} onBlur={(e) => {
                if (e.currentTarget.contains(e.relatedTarget)) return
                setIsHidden(true)
            }} className={mystyle.hamburger}>
                <GiHamburgerMenu size='20px' />

                <Sidebar currentTab={currentTab} slot={currentTab === "Inbox" ? <Inbox setIsHidden={setIsHidden} /> : currentTab === "Outbox" ? <Outbox setIsHidden={setIsHidden} /> : <Groups setIsHidden={setIsHidden} />} setCurrentTab={setCurrentTab} isHidden={isHidden} />
            </div>
            <Link to={'/'} className={mystyle.logo}>Cotraveller</Link>

            <div className={mystyle.themebtn}><ThemeButton /></div>
            <button aria-label="Menu" onClick={() => {
                setIsHidden(false)
                setCurrentTab('Inbox')
            }} onBlur={(e) => {
                if (menuRef.current?.contains(e.relatedTarget)) return
                setIsHidden(true)
            }} className={mystyle.mail}><Mail strokeWidth={1.4} size={26} /></button>
            {
                !user && <Link to={'/login'} className={mystyle.navbtn}>Log in</Link>
            }
            <Link to={'/creategroup'} className={clsx(mystyle.navbtn, mystyle.createGroupBtn)}>Create group</Link>
            <Link aria-label="Create Group" to={'/creategroup'} className={mystyle.plusBtn}><Plus /></Link>

            {/* pratham changed this to prevent error page */}
            {user && <Link className={mystyle.avatarWrapper} aria-label="Go to your profile page" to={`/`}>
                <FaUser />
            </Link>}
        </div>
    )
}

export default Navbar
