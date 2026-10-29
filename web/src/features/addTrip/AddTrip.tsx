import { CameraIcon, PlusIcon, XIcon } from "@phosphor-icons/react"
import mystyle from "./style.module.css"
import { useEffect, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/axios"
import Dialog from "@/components/dialog/Dialog"
import { useDialogContext } from "@/components/dialog/useDialogContext"
import { toast } from "sonner"
import clsx from "clsx"

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

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { setIsOpen, isOpen } = useDialogContext()

  const mutation = useMutation({
    mutationKey: ["addTrip"],
    mutationFn: (e: { name: string, description?: string }) => api.post<resT>("/trips", e),
    onSuccess(data) {
      const tripId = data.data.tripId
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'trips'] })
      setIsOpen(false)
      setName("")
      setDescription("")
      return navigate(`/${tripId}`)
    },
    onError: () => toast.error("Please try again later")
  })

  const [nameErr, setNameErr] = useState(false)

  const handleSubmit = () => {
    if (!name) {
      setNameErr(true)
      toast.error("Please give a name for your trip")
      return
    }
    mutation.mutate({ name, description })
  }

  useEffect(() => {
    if (name) {
      setNameErr(false)
    }
    if (!isOpen) {
      setNameErr(false)
    }
  }, [name, isOpen])



  return (
    <Dialog.Content asChild>
      <div className={mystyle.wrapper}>
        <header className={mystyle.header}>
          <span className={mystyle.heading}>Create trip</span>
          <Dialog.Close>
            <XIcon weight="bold" />
          </Dialog.Close>
        </header>
        <div className={clsx(mystyle.nameBox, nameErr ? mystyle.nameBoxErr : null)}>
          <div className={mystyle.iconWrapper}>
            <CameraIcon size={22} />
          </div>
          <input className={mystyle.name} placeholder="Trip Name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className={mystyle.descriptionBox}>
          <textarea name="description" className={mystyle.description} placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <button className={mystyle.btn} onClick={handleSubmit}>Create Trip</button>
      </div>
    </Dialog.Content>
  )
}
