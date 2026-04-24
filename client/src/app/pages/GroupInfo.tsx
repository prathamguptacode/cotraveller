import GroupInfoHero from "@/features/groups/components/GroupInfoHero"
import { Suspense, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import styles from '@/features/groups/groupInfo.module.css'
import FallbackWrapper from "@/components/Loaders/FallbackWrapper"
import { useMainLayoutContext } from "../layouts/MainLayout/useMainLayout"

const GroupInfo = () => {
  const { setSidebarIsHidden } = useMainLayoutContext()
  
  useEffect(() => {
    setSidebarIsHidden(true)
  }, [])

  return (
    <ErrorBoundary fallback={<FallbackWrapper className={styles.fallbackWrapper} sidebarType="overlay" children={"Something Went Wrong !"} />}>
      <Suspense fallback={<FallbackWrapper className={styles.fallbackWrapper} sidebarType="overlay" />}>
        <GroupInfoHero />
      </Suspense>
    </ErrorBoundary>
  )
}

export default GroupInfo
