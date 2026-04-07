import GroupInfoHero from "@/features/groups/components/GroupInfoHero"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import styles from '@/features/groups/groupInfo.module.css'
import FallbackWrapper from "@/components/Loaders/FallbackWrapper"

const GroupInfo = () => {
  return (
    <ErrorBoundary fallback={<FallbackWrapper className={styles.fallbackWrapper} sidebarType="overlay" children={"Something Went Wrong !"} />}>
      <Suspense fallback={<FallbackWrapper className={styles.fallbackWrapper} sidebarType="overlay" />}>
        <GroupInfoHero />
      </Suspense>
    </ErrorBoundary>
  )
}

export default GroupInfo
