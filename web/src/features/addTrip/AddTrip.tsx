import { Camera } from "@phosphor-icons/react"
import mystyle from "./style.module.css"
import { useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/axios"

type resT = {
  tripId: string
}

function AddTrip() {

  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationKey: ["addTrip"],
    mutationFn: (e: { name: string, description: string }) => api.post<resT>("/trips", e),
    onSuccess(data) {
      const tripId = data.data.tripId
      document.getElementById("addTrip")?.hidePopover()
      return navigate(`/${tripId}`)
    },
  })

  const handleClick = async () => {
    if (nameRef.current && descriptionRef.current) {
      const name = nameRef.current.value
      const description = descriptionRef.current.value
      mutation.mutate({ name, description })
    }
  }


  return (
    <div id="addTrip" popover="auto" className={mystyle.wrapper} >
      <div className={mystyle.heading}>Create Trip</div>
      <div className={mystyle.nameBox}>
        <div className={mystyle.iconWrapper}>
          <Camera size={22} />
        </div>
        <input placeholder="Trip Name" ref={nameRef} />
      </div>
      <div className={mystyle.descriptionBox}>
        <input placeholder="Description (optional)" ref={descriptionRef} />
      </div>
      <button className={mystyle.btn} onClick={handleClick}>Create Trip</button>
    </div>
  )
}

export default AddTrip
