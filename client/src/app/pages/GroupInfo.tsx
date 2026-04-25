import GroupInfoHero from "@/features/groups/components/GroupInfoHero"
import { Suspense, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import styles from '@/features/groups/groupInfo.module.css'
import FallbackWrapper from "@/components/Loaders/FallbackWrapper"
import { useMainLayoutContext } from "../layouts/MainLayout/useMainLayout"
import { useParams } from "react-router-dom"

const GroupInfo = () => {
  const { setSidebarIsHidden } = useMainLayoutContext()
  const { groupId } = useParams() as { groupId: string }

  useEffect(() => {
    setSidebarIsHidden(true)
  }, [])

  return (
    <ErrorBoundary resetKeys={[groupId]} fallback={<FallbackWrapper className={styles.fallbackWrapper} sidebarType="overlay" children={"Something Went Wrong !"} />}>
      <Suspense key={groupId} fallback={<FallbackWrapper className={styles.fallbackWrapper} sidebarType="overlay" />}>
        <GroupInfoHero />
      </Suspense>
    </ErrorBoundary>
  )
}

export default GroupInfo
