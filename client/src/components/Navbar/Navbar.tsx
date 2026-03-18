import mystyle from './navbar.module.css'
import ThemeButton from '@/components/Buttons/ThemeButton';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, type ReactNode } from "react";
import Groups from "@/components/SidebarTabs/Groups";
import Inbox from "@/components/SidebarTabs/Inbox";
import { Camera, Edit, Inbox as InboxLogo, Plus, TextAlignJustify, User2Icon, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import clsx from "clsx";
import { useEventSource } from "@/hooks/useEventSource";
import { toast } from 'sonner';
import type { Notifications, SidebarTab } from './types';
import { NavbarContext, useNavbarContext } from './useNavbarContext';
import { getImgURL } from '@/lib/cloudinary';



type EventType = {
    event: string,
    for: string,
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
            eventSource.removeEventListener('message', eventListener)
        }
    }, [])



    const value = { setCurrentTab, currentTab, setIsHidden, menuRef, isHidden, notifications, setNotifications }

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
    const { currentTab, setCurrentTab, setIsHidden, menuRef, notifications } = useNavbarContext()
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
        <Sidebar currentTab={currentTab} slot={currentTab === "Inbox" ? <Inbox /> : <Groups />} />
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
    const dialogRef = useRef<HTMLDialogElement>(null)

    const url = user?.avatar.publicId && getImgURL(user.avatar.publicId, user.avatar.version, 400)
    const firstLetter = user?.fullName.charAt(0)

    const openDialog = () => {
        const dialog = dialogRef.current
        if (!dialog) return
        dialog.showModal()
    }

    const closeDialog = () => {
        const dialog = dialogRef.current
        if (!dialog) return
        dialog.close()
    }

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        const eventHandler = (e: PointerEvent) => {
            const dialogDimensions = dialog.getBoundingClientRect()
            if (e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right || e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom) dialog.close()
        }
        dialog.addEventListener('click', eventHandler)

        return () => {
            dialog.removeEventListener('click', eventHandler)
        }
    }, [])

    const formattedDate = user && new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(new Date(user.createdAt))

    return user &&
        <>
            <button onClick={openDialog} className={mystyle.avatarWrapper} aria-label="View your profile">
                {url ? <img src={url} alt="user-avatar" /> : firstLetter}
            </button>
            <dialog ref={dialogRef} className={mystyle.profileDialog}>
                <button className={mystyle.closeDialog} onClick={closeDialog}><X strokeWidth={1.5} size={20} /></button>
                <div className={mystyle.profileArea}>
                    <div className={mystyle.profileHeader}>
                        <div className={mystyle.avatarWrapper}>
                            {url ? <img src={url} alt="user-avatar" /> : firstLetter}
                        </div>
                        <div className={mystyle.profileHeaderDetails}>
                            <h2>{user.username}</h2>
                            <span>{user.fullName}</span>
                        </div>
                    </div>
                    <div className={mystyle.profileMainArea}>
                        <div>
                            <h3>Email</h3>
                            <span>{user.email}</span>
                        </div>
                        <div>
                            <h3>Member Since</h3>
                            <span>
                                {formattedDate}
                            </span>
                        </div>
                        <div>
                            <h3>Associated Groups</h3>
                            <span>{user.memberGroup.length}</span>
                        </div>
                    </div>
                    <div className={mystyle.profileFooter}>
                        <Link to={'#'} >
                            <Edit size={20} /> Edit Profile
                        </Link>
                        <button>
                            <Camera size={20} /> Change Photo
                        </button>
                    </div>
                </div>

            </dialog>
        </>
}

Navbar.ProfileButton = NavbarProfileButton