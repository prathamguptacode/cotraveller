import { Outlet } from "react-router-dom"
import mystyle from "./Trips.module.css"
import TripsList from "@/features/trips/components/TripsList"

function TripsLayout() {
  return (
    <div className={mystyle.tripsLayout}>
      <aside className={mystyle.tripsSidebar}>
        <TripsList />
      </aside>
      <div className={mystyle.tripsMainContent}>
        <Outlet />
      </div>
    </div>
  )
}

export default TripsLayout
