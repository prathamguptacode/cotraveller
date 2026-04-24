import { Link, useLocation } from 'react-router-dom'
import styles from './sidebar.module.css'
import { Compass, Home, Inbox, MessageCircle, Search, Settings, Users } from 'lucide-react'
import { MdOutlineFeedback } from 'react-icons/md'
import { Suspense, useEffect, useRef, type JSX } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useAuth } from '@/hooks/useAuth'
import { useMainLayoutContext } from './useMainLayout'
import SidebarChatsPreview from '@/features/chats/components/SidebarChatsPreview'
import SidebarInboxPreview from '@/features/inbox/components/SidebarInboxPreview'
import LogOutButton from '@/components/Buttons/LogOutButton'
import type { SidebarTab } from './types'
import clsx from 'clsx'
import FallbackWrapper from '@/components/Loaders/FallbackWrapper'


const sidebarTabs: { name: SidebarTab, icon: JSX.Element }[] = [
    { name: 'Chats', icon: <MessageCircle /> },
    { name: 'Groups', icon: <Users /> },
    { name: 'Inbox', icon: <Inbox /> },
    { name: 'Explore', icon: <Compass /> },
    { name: 'Search', icon: <Search /> },
]




const Sidebar = () => {
    const sidebarsRef = useRef<HTMLDivElement>(null)

    const { currentSidebarTab, setCurrentSidebarTab, sidebarIsHidden, setSidebarIsHidden, hamburgerRef } = useMainLayoutContext()
    const { user } = useAuth()



    const location = useLocation()

    useEffect(() => {

        const sidebarsDiv = sidebarsRef.current
        const hamburgerMenu = hamburgerRef.current

        if (!sidebarsDiv?.parentElement || !hamburgerMenu || sidebarsDiv.parentElement.children[2].children[1].getAttribute('data-sidebar-type') !== 'overlay' || window.matchMedia("(max-width:768px)").matches) return

        const eventHandler = (e: PointerEvent) => {
            const target = e.target
            function checker(target: EventTarget | null): asserts target is Node {
                try {
                    if (!target || !('nodeType' in target)) {
                        throw new Error("Not a Node")
                    }
                } catch (e) {
                    console.log(e)
                    return
                }

            }
            checker(target)

            if (!sidebarsDiv.contains(target) && !hamburgerMenu.contains(target) && !window.matchMedia("(max-width:768px)").matches) setSidebarIsHidden(true)

        }

        window.addEventListener('click', eventHandler)

        return () => window.removeEventListener('click', eventHandler)
    }, [location.pathname])


    return (
        <div ref={sidebarsRef} className={clsx(styles.sidebarsWrapper, !sidebarIsHidden && styles.visibleCtxSidebar)} >
            <div className={styles.primarySidebar}>
                <div className={styles.primarySidebarList}>
                    <Link to={'/'}><Home /></Link>
                    {sidebarTabs.map(sidebarTab => {
                        return (
                            <button aria-label={sidebarTab.name} key={sidebarTab.name} onClick={() => {
                                setSidebarIsHidden(false)
                                setCurrentSidebarTab(sidebarTab.name)
                            }}>{sidebarTab.icon}</button>
                        )
                    })}
                </div>
                <div className={styles.primarySidebarList}>
                    <Link to={'#'}><Settings /></Link>
                    <Link to={'/feedback'}><MdOutlineFeedback /></Link>
                    <LogOutButton />
                </div>

            </div>
            <div className={styles.contextualSidebar}>
                <div className={styles.ctxSidebarHeader}>
                    <h2>{currentSidebarTab}</h2>
                </div>
                <div className={styles.ctxSidebarList}>
                    {user ? <ErrorBoundary fallback={<FallbackWrapper children={'Something went wrong !'} />}>
                        <Suspense fallback={<FallbackWrapper />}>
                            {
                                currentSidebarTab == 'Chats' ? <SidebarChatsPreview /> :
                                    currentSidebarTab == 'Inbox' ? <SidebarInboxPreview /> :
                                        <FallbackWrapper>Coming Soon !</FallbackWrapper>
                            }

                        </Suspense>
                    </ErrorBoundary> :
                        <FallbackWrapper>Login to view</FallbackWrapper>
                    }
                </div>
            </div>

        </div>
    )
}

export default Sidebar
