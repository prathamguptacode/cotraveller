import { Suspense, useEffect, useRef, type JSX } from 'react'
import styles from './sidebar.module.css'
import type { SidebarTab } from './types'
import { Home, Inbox, MessageCircle, Search, Users } from 'lucide-react'
import { useMainLayoutContext } from './useMainLayout'
import { Link, useLocation } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import FallbackWrapper from '@/components/Loaders/FallbackWrapper'
import { useAuth } from '@/hooks/useAuth'
import SidebarChatsPreview from '@/features/chats/components/SidebarChatsPreview'
import SidebarInboxPreview from '@/features/inbox/components/SidebarInboxPreview'
import clsx from 'clsx'


const bottomNavbarTabs: { name: SidebarTab, icon: JSX.Element }[] = [
  { name: 'Chats', icon: <MessageCircle /> },
  { name: 'Groups', icon: <Users /> },
  { name: 'Inbox', icon: <Inbox /> },
  { name: 'Search', icon: <Search /> },
]

const BottomNavbar = () => {
  const { setSidebarIsHidden, setCurrentSidebarTab, currentSidebarTab, sidebarIsHidden, hamburgerRef, notifications } = useMainLayoutContext()
  const { user } = useAuth()
  const location = useLocation()

  const navRef = useRef<HTMLElement>(null)


  useEffect(() => {
    const navbar = navRef.current
    const hamburgerMenu = hamburgerRef.current

    if (!navbar || !hamburgerMenu || !window.matchMedia("(max-width:768px)").matches) return

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

      if (!navbar.contains(target) && !hamburgerMenu.contains(target) || !window.matchMedia("(max-width:768px)").matches) setSidebarIsHidden(true)
    }

    window.addEventListener('click', eventHandler)

    return () => window.removeEventListener('click', eventHandler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!window.matchMedia("(max-width:768px)").matches) return
    setSidebarIsHidden(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])



  return (
    <nav ref={navRef} className={styles.bottomNavbar}>
      <Link to={'/'}><Home /></Link>
      {bottomNavbarTabs.map(tab => {
        const hasNotifications = (tab.name == 'Chats' || tab.name == 'Inbox') && notifications[tab.name]
        return (
          <button className={clsx(hasNotifications && styles.hasNotifications)} aria-label={tab.name} key={tab.name} onClick={() => {
            setSidebarIsHidden(false)
            setCurrentSidebarTab(tab.name)
          }}>{tab.icon}</button>
        )
      })}


      <div className={clsx(styles.mobileNavigationPanel, !sidebarIsHidden && styles.visibleMobileNavPanel)}>
        {/* Rest classNames are same as contextual Sidebar's cuz all styling is same */}
        <div className={styles.ctxSidebarHeader}>
          <h2>{currentSidebarTab}</h2>
        </div>
        <div className={styles.ctxSidebarList}>
          {user ? <ErrorBoundary resetKeys={[currentSidebarTab, sidebarIsHidden]} fallback={<FallbackWrapper children={'Something went wrong !'} />}>
            <Suspense key={currentSidebarTab} fallback={<FallbackWrapper />}>
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
    </nav>
  )
}

export default BottomNavbar
