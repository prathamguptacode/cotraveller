import GroupInfoHero from "@/features/groups/components/GroupInfoHero"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import styles from '@/features/groups/groupInfo.module.css'
import ThreeDotLoader from "@/components/Loaders/ThreeDotLoader"

const GroupInfo = () => {
  return (
    <ErrorBoundary fallback={<div className={styles.fallbackWrapper}>Some thing went wrong !</div>}>
      <Suspense fallback={<div className={styles.fallbackWrapper}><ThreeDotLoader /></div>}>
        <GroupInfoHero />
      </Suspense>
    </ErrorBoundary>
  )
}

export default GroupInfo
