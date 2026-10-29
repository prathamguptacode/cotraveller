import { CameraIcon, PlusIcon, XIcon } from "@phosphor-icons/react"
import mystyle from "./style.module.css"
import { useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/axios"
import Dialog from "@/components/dialog/Dialog"
import { useDialogContext } from "@/components/dialog/useDialogContext"

type resT = {
  tripId: string
}

function AddTrip() {


  return (
    <Dialog>
      <Dialog.Trigger>
        <span><PlusIcon /></span>
      </Dialog.Trigger>
      <Dialog.Backdrop className={mystyle.dialogBackdrop}>
        <Content />
      </Dialog.Backdrop>
    </Dialog>

  )
}

export default AddTrip


const Content = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { setIsOpen } = useDialogContext()

  const mutation = useMutation({
    mutationKey: ["addTrip"],
    mutationFn: (e: { name: string, description: string }) => api.post<resT>("/trips", e),
    onSuccess(data) {
      const tripId = data.data.tripId
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'trips'] })
      setIsOpen(false)
      return navigate(`/${tripId}`)
    },
  })

  const handleSubmit = () => {
    const name = nameRef.current?.value
    const description = descriptionRef.current?.value

    if (!name || !description) return

    mutation.mutate({ name, description })
  }

  return (
    <Dialog.Content asChild>
      <div className={mystyle.wrapper}>
        <header className={mystyle.header}>
          <span className={mystyle.heading}>Create trip</span>
          <Dialog.Close>
            <XIcon weight="bold" />
          </Dialog.Close>
        </header>
        <div className={mystyle.nameBox}>
          <div className={mystyle.iconWrapper}>
            <CameraIcon size={22} />
          </div>
          <input className={mystyle.name} placeholder="Trip Name" ref={nameRef} />
        </div>
        <div className={mystyle.descriptionBox}>
          <textarea name="description" className={mystyle.description} placeholder="Description (optional)" ref={descriptionRef} />
        </div>
        <button className={mystyle.btn} onClick={handleSubmit}>Create Trip</button>
      </div>
    </Dialog.Content>
  )
}