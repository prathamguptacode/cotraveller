import style from "./style.module.css"
import { api } from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import type { tripDetailT } from "../Trips/TripsMainContent"
import { useAuth } from "@/hooks/useAuth"
import { useCookies } from 'react-cookie'

type resT = {
  tripId: string
}

function InviteInfo() {


  const params = useParams()
  const tripId = params.tripId as string
  const inviteToken = params.inviteToken as string

  const [cookies, setCookie] = useCookies(['inviteToken'])

  const { user } = useAuth()

  const navigate = useNavigate()

  const { data, isPending, isError } = useQuery({
    queryKey: ["inviteInfo", tripId, inviteToken],
    queryFn: () => api.get<tripDetailT>(`/trips/${tripId}`)
  })

  // ###no error handling
  const mutate = useMutation({
    mutationKey: ["invite", tripId, inviteToken],
    mutationFn: (e: { inviteToken: string }) => api.post<resT>("/trips/invite", e),
    onSuccess: (e) => navigate(`/${e.data.tripId}`)
  })

  if (isError) {
    return <div>Something went wrong</div>
  }

  if (isPending) {
    return <div>Loading...</div>
  }


  async function handleClick() {
    if (user) {
      mutate.mutate({ inviteToken })
    } else {
      // ###check that is this cookie set up securely
      setCookie("inviteToken", inviteToken, { maxAge: 300000 })
      navigate("/login")
    }
  }

  return (
    <div className={style.wrap}>
      <div className={style.infoBox}>
        <img src="/tripIcon.webp" alt="trip avatar" width="500px" height="300px" />
        <div className={style.message}>You are invited to join trip</div>
        <div className={style.tripName}>{data.data.trip.name}</div>
        <div className={style.memberBox}>
          {data.data.members.map(e => <div>{e.user.email}</div>)}
        </div>
        <button onClick={handleClick} className={style.joinBtn}>Join Now</button>
      </div>
    </div>
  )
}

export default InviteInfo
