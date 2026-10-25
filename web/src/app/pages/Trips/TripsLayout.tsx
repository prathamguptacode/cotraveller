import { Outlet, useNavigate } from "react-router-dom"
import mystyle from "./Trips.module.css"
import TripsList from "@/features/trips/components/TripsList"
import { useCookies } from "react-cookie"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { useEffect } from "react"

type resT = {
  tripId: string
}

function TripsLayout() {

  // ###checking invite token
  const navigate = useNavigate()
  const [cookies, setCookie, removeCookie] = useCookies(['inviteToken'])

  // ###no error handling
  const mutate = useMutation({
    mutationKey: ["invite", "home"],
    mutationFn: (e: { inviteToken: string }) => api.post<resT>("/trips/invite", e),
    onSuccess: (e) => {
      removeCookie("inviteToken")
      navigate(`/${e.data.tripId}`)
    }
  })


  useEffect(() => {
    if (cookies.inviteToken) {
      mutate.mutate({ inviteToken: cookies.inviteToken })
      return
    }
  }, [])



  return (
    <div className={mystyle.layout}>
      <aside className={mystyle.sidebar}>
        <TripsList />
      </aside>
      <div className={mystyle.mainWrapper}>
        <Outlet />
      </div>
    </div>
  )
}

export default TripsLayout
