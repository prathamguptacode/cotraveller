import mystyle from './navbar.module.css'
import ThemeButton from '@/components/Buttons/ThemeButton';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type RefObject, type SetStateAction } from "react";
import Groups from "@/components/SidebarTabs/Groups";
import Inbox from "@/components/SidebarTabs/Inbox";
import { Inbox as InboxLogo, Plus, TextAlignJustify } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FaUser } from "react-icons/fa6";
import clsx from "clsx";
import { useEventSource } from "@/hooks/useEventSource";
import { toast } from 'sonner';


export type SidebarTab = 'Groups' | 'Inbox'

type EventType = {
    event: string,
    for: string,
}
type Notifications = {
    groups: boolean,
    inbox: boolean
}

type NavbarContextType = {
    setCurrentTab: Dispatch<SetStateAction<SidebarTab>>,
    currentTab: SidebarTab,
    setIsHidden: Dispatch<SetStateAction<boolean>>,
    isHidden: boolean,
    menuRef: RefObject<HTMLDivElement | null>,
    notifications: Notifications
}


const NavbarContext = createContext<NavbarContextType | null>(null)

const useNavbarContext = () => {
    const ctx = useContext(NavbarContext)
    if (!ctx) throw new Error("Cannot access context outside of navbar")
    return ctx
}
type NavbarProps = {
    children: ReactNode
}

function Navbar({ children }: NavbarProps) {
    const [isHidden, setIsHidden] = useState(true)
    const menuRef = useRef<HTMLDivElement>(null)
    const [currentTab, setCurrentTab] = useState<SidebarTab>('Groups')

    const [notifications, setNotifications] = useState<Notifications>({ groups: false, inbox: false })

    const eventSource = useEventSource()
    useEffect(() => {
        const eventListener = (message: { data: string }) => {
            const data = JSON.parse(message.data) as unknown

            const isEvent = (data: unknown): data is EventType => {
                if (typeof data === 'object' && !Array.isArray(data)) return true
                return false
            }

            if (!isEvent(data)) return
            if (data.for === 'Inbox' && data.event === 'request_to_join_group:added') {
                console.log(data, 'at', Date.now())
                toast.info('Request Alert', {
                    description: "Someone wants to join your group"
                })
                setNotifications(prev => ({ ...prev, inbox: true }))
            }
        }
        eventSource.addEventListener('message', eventListener)

        return () => {
            console.log('removing listener for events')
            eventSource.removeEventListener('message', eventListener)
        }
    }, [])



    const value = { setCurrentTab, currentTab, setIsHidden, menuRef, isHidden, notifications }

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

const NavbarHamburger = () => {
    const { currentTab, setCurrentTab, setIsHidden, menuRef, isHidden, notifications } = useNavbarContext()
    const { user } = useAuth()

    return user && <div ref={menuRef} role="button" tabIndex={0} onClick={() => {
        setIsHidden(prev => {
            if (prev) setCurrentTab('Groups')
            return !prev
        })

    }} onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return
        setIsHidden(true)
    }} className={clsx(mystyle.hamburger, Object.values(notifications).some(e => e) && mystyle.notification)}>
        <TextAlignJustify strokeWidth={2.5} size={20} />
        <Sidebar currentTab={currentTab} slot={currentTab === "Inbox" ? <Inbox /> : <Groups />} setCurrentTab={setCurrentTab} isHidden={isHidden} />
    </div>

}
Navbar.Hamburger = NavbarHamburger



const NavbarTitle = () => <Link to={'/'} className={mystyle.logo}>Cotraveller</Link>
Navbar.Title = NavbarTitle

const NavbarThemeButton = () => <div className={mystyle.themebtn}><ThemeButton /></div>
Navbar.ThemeButton = NavbarThemeButton

const NavbarInbox = () => {
    const { setCurrentTab, setIsHidden, menuRef, notifications } = useNavbarContext()
    return (
        <button aria-label="Inbox" onClick={() => {
            setIsHidden(false)
            setCurrentTab('Inbox')
        }} onBlur={(e) => {
            if (menuRef.current?.contains(e.relatedTarget)) return
            setIsHidden(true)
        }} className={clsx(mystyle.inbox, notifications.inbox && mystyle.notification)}>
            <InboxLogo strokeWidth={1.4} size={20} />
        </button>
    )
}
Navbar.Inbox = NavbarInbox


const NavbarLoginButton = () => {
    const { user } = useAuth()

    return !user && <Link to={'/login'} className={mystyle.navbtn}>Log in</Link>

}
Navbar.LoginButton = NavbarLoginButton

const NavbarCreateGroupButton = () => {
    return (
        <>
            <Link to={'/groups/create'} className={clsx(mystyle.navbtn, mystyle.createGroupBtn)}>Create group</Link>
            <Link aria-label="Create Group" to={'/groups/create'} className={mystyle.plusBtn}><Plus size={20} /></Link>
        </>

    )
}
Navbar.CreateGroupButton = NavbarCreateGroupButton


const NavbarProfileButton = () => {
    const { user } = useAuth()
    return user && <Link className={mystyle.avatarWrapper} aria-label="Go to your profile page" to={`/`}>
        <FaUser />
    </Link>

}

Navbar.ProfileButton = NavbarProfileButton