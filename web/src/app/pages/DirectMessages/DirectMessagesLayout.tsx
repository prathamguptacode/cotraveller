import DirectMessagesList from "@/features/chat/components/DirectMessages/DirectMessagesList"
import styles from './styles.module.css'
import { Outlet } from "react-router-dom"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

const DirectMessagesLayout = () => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <ErrorBoundary fallback={<>Something went wrong !</>}>
          <Suspense fallback={<>Loading...</>}>
            <DirectMessagesList />
          </Suspense>
        </ErrorBoundary>
      </aside>
      <div className={styles.mainWrapper}>
        <Outlet />
      </div>
    </div>
  )
}

export default DirectMessagesLayout
