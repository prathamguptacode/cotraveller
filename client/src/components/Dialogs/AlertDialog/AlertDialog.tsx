import { Slot } from "@radix-ui/react-slot"
import { AlertDialogContext, useAlertDialogContext } from "./useAlertDialogContext"
import { useRef, type ReactNode } from "react"
import styles from './alertDialog.module.css'
import clsx from "clsx"


type AlertDialogProps = {
    children: ReactNode
}

const AlertDialog = ({ children }: AlertDialogProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const toggleDialog = () => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (dialog.open) dialog.close()
        else dialog.showModal()
    }

    const value = { dialogRef, toggleDialog }
    return (
        <AlertDialogContext.Provider value={value}>
            {children}
        </AlertDialogContext.Provider>
    )
}

export default AlertDialog


const Trigger = ({ ...props }) => {
    const { toggleDialog } = useAlertDialogContext()
    return (
        <Slot {...props} onClick={toggleDialog} />
    )
}

AlertDialog.Trigger = Trigger

type ContentProps = {
    children: ReactNode
}

const Content = ({ children }: ContentProps) => {
    const { dialogRef } = useAlertDialogContext()
    return (
        <dialog className={styles.dialog} ref={dialogRef}>
            <div>
                {children}
            </div>
        </dialog>
    )
}

AlertDialog.Content = Content


const Header = ({ children }: { children: ReactNode }) => {
    return (
        <div className={styles.dialogContentWrapper}>
            {children}
        </div>
    )
}

AlertDialog.Header = Header


const Title = ({ children }: { children: ReactNode }) => {
    return (
        <h2 className={styles.dialogHeading}>{children}</h2>
    )
}

AlertDialog.Title = Title


const Description = ({ children }: { children: ReactNode }) => {
    return (
        <p className={styles.dialogContent}>{children}</p>
    )
}

AlertDialog.Description = Description


const Footer = ({ children }: { children: ReactNode }) => {
    return (
        <div className={styles.dialogButtons}>
            {children}
        </div>
    )
}

AlertDialog.Footer = Footer


const CancelButton = ({ children }: { children: ReactNode }) => {
    const { toggleDialog } = useAlertDialogContext()
    return (
        <button onClick={toggleDialog} className={clsx(styles.dialogButton, styles.cancelButton)}>
            {children}
        </button>
    )
}

AlertDialog.CancelButton = CancelButton


type ConfirmButtonProps = {
    children: ReactNode,
    confirmActionHandler: () => void
}

const ConfirmButton = ({ children, confirmActionHandler }: ConfirmButtonProps) => {
    const { toggleDialog } = useAlertDialogContext()

    const handleClick = async () => {
        confirmActionHandler()
        toggleDialog()
    }

    return (
        <button onClick={handleClick} className={clsx(styles.dialogButton, styles.confirmButton)}>{children}</button>
    )
}

AlertDialog.ConfirmButton = ConfirmButton