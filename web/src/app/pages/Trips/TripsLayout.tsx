import { Outlet } from "react-router-dom"
import mystyle from "./Trips.module.css"
import TripsSidebar from "./TripsSidebar"

function TripsLayout() {
  return (
    <div className={mystyle.tripsLayout}>
      <div className={mystyle.tripsSidebar}>
        <TripsSidebar />
      </div>
      <div className={mystyle.tripsMainContent}>
        <Outlet />
      </div>
    </div>
  )
}

export default TripsLayout
