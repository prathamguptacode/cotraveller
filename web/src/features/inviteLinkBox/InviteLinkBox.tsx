import { CopySimpleIcon } from "@phosphor-icons/react/dist/ssr"
import style from "./style.module.css"

function InviteLinkBox({ tripName, tripId, inviteToken, isLoading }: { tripName: string, tripId: string, inviteToken?: string, isLoading: boolean }) {

  if (isLoading) {
    return <div className={style.loadingWrap} id="linkBox" popover="auto">
      Loading...
    </div>
  }

  const url = `http://localhost:3000/invite/${tripId}/${inviteToken}`

  return (
    <div className={style.linkBox} id="linkBox" popover="auto">
      <img src="/tripIcon.webp" alt="trip avatar" width="500px" height="300px" />
      <div className={style.message}>This link will allow people to join your trip</div>
      <div className={style.tripName}>{tripName}</div>
      <div className={style.copyBox}>
        <div>{url}</div>
        <button onClick={() => navigator.clipboard.writeText(url)}><CopySimpleIcon size={20} /></button>
      </div>
    </div>
  )
}

export default InviteLinkBox
