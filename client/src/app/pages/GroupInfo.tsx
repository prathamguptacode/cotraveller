import GroupInfoHero from "@/features/groups/components/GroupInfoHero"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

const GroupInfo = () => {
  return (
    <ErrorBoundary fallback={<div>Error happened here</div>}>
      <Suspense fallback={<div>Loading something over here</div>}>
        <GroupInfoHero />
      </Suspense>
    </ErrorBoundary>
  )
}

export default GroupInfo
