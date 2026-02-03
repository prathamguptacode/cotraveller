import { GiHamburgerMenu } from "react-icons/gi";
import mystyle from './navbar.module.css'
import ThemeButton from '@/components/Buttons/ThemeButton';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { createContext, useContext, useRef, useState, type Dispatch, type ReactNode, type RefObject, type SetStateAction } from "react";
import Groups from "@/components/SidebarTabs/Groups";
import Inbox from "@/components/SidebarTabs/Inbox";
import Outbox from "@/components/SidebarTabs/Outbox";
import { Mail, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FaUser } from "react-icons/fa6";
import clsx from "clsx";


export type SidebarTab = 'Groups' | 'Inbox' | 'Outbox'

type NavbarContextType = {
    setCurrentTab: Dispatch<SetStateAction<SidebarTab>>,
    currentTab: SidebarTab,
    setIsHidden: Dispatch<SetStateAction<boolean>>,
    isHidden: boolean,
    menuRef: RefObject<HTMLDivElement | null>
}


const NavbarContext = createContext<NavbarContextType | null>(null)

const useNavbarContext = () => {
    const ctx = useContext(NavbarContext)
    if (!ctx) throw new Error("Cannot access outside context of navbar")
    return ctx
}
type NavbarProps = {
    children: ReactNode
}

function Navbar({ children }: NavbarProps) {
    const [isHidden, setIsHidden] = useState(true)
    const menuRef = useRef<HTMLDivElement>(null)
    const [currentTab, setCurrentTab] = useState<SidebarTab>('Groups')



    const value = { setCurrentTab, currentTab, setIsHidden, menuRef, isHidden }

    // $$$please include profile picture feature

    return (
        <div className={mystyle.navbar}>

            <NavbarContext.Provider value={value}>
                {children}
            </NavbarContext.Provider>
        </div>
    )
}

export default Navbar

Navbar.Hamburger = () => {
    const { currentTab, setCurrentTab, setIsHidden, menuRef, isHidden } = useNavbarContext()
    const { user } = useAuth()
    return user && <div ref={menuRef} role="button" tabIndex={0} onClick={() => {
        setIsHidden(prev => {
            prev && setCurrentTab('Groups')
            return !prev
        })

    }} onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return
        setIsHidden(true)
    }} className={mystyle.hamburger}>
        <GiHamburgerMenu size='20px' />

        <Sidebar currentTab={currentTab} slot={currentTab === "Inbox" ? <Inbox /> : currentTab === "Outbox" ? <Outbox /> : <Groups />} setCurrentTab={setCurrentTab} isHidden={isHidden} />
    </div>

}



Navbar.Title = () => <Link to={'/'} className={mystyle.logo}>Cotraveller</Link>

Navbar.ThemeButton = () => <div className={mystyle.themebtn}><ThemeButton /></div>


Navbar.Inbox = () => {
    const { setCurrentTab, setIsHidden, menuRef } = useNavbarContext()
    return (
        <button aria-label="Inbox" onClick={() => {
            setIsHidden(false)
            setCurrentTab('Inbox')
        }} onBlur={(e) => {
            if (menuRef.current?.contains(e.relatedTarget)) return
            setIsHidden(true)
        }} className={mystyle.mail}>
            <Mail strokeWidth={1.4} size={26} />
        </button>
    )
}

Navbar.LoginButton = () => {
    const { user } = useAuth()

    return !user && <Link to={'/login'} className={mystyle.navbtn}>Log in</Link>

}

Navbar.CreateGroupButton = () => {
    return (
        <>
            <Link to={'/groups/create'} className={clsx(mystyle.navbtn, mystyle.createGroupBtn)}>Create group</Link>
            <Link aria-label="Create Group" to={'/groups/create'} className={mystyle.plusBtn}><Plus /></Link>
        </>

    )
}
Navbar.ProfileButton = () => {
    const { user } = useAuth()
    return user && <Link className={mystyle.avatarWrapper} aria-label="Go to your profile page" to={`/`}>
        <FaUser />
    </Link>

}