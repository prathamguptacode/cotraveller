import { useEffect, useState, type ReactNode } from 'react'
import styles from './dialog.module.css'
import clsx from 'clsx'
import { DialogContext, useDialogContext } from './useDialogContext'
import { Slot } from '@radix-ui/react-slot'



type DialogProps = {
    children: ReactNode,
    onOpen?: () => void
}

const Dialog = ({ children, onOpen }: DialogProps) => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        if (onOpen) onOpen()
        const handler = (e: KeyboardEvent) => {
            if (e.code === 'Escape') setIsOpen(false)
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)

    }, [isOpen])

    const value = { isOpen, setIsOpen }

    return (
        <DialogContext.Provider value={value}>
            {children}
        </DialogContext.Provider>
    )
}

export default Dialog




type DialogChildProps = {
    className?: string,
    children: ReactNode,
    asChild?: boolean,
    arialLabel?: string
}

type DialogTriggerProps = DialogChildProps & {
    isDialogDisabled?: () => boolean
}


Dialog.Trigger = function DialogTrigger({ className, children, asChild, isDialogDisabled = () => false, arialLabel }: DialogTriggerProps) {
    const { setIsOpen } = useDialogContext()
    const Component = asChild ? Slot : 'button'

    return (
        <Component onClick={() => {
            if (!isDialogDisabled()) setIsOpen(true)
        }} className={className} aria-label={arialLabel}>
            {children}
        </Component>
    )
}

Dialog.Backdrop = function DialogBackdrop({ className, children, asChild }: DialogChildProps) {
    const { isOpen, setIsOpen } = useDialogContext()
    const Component = asChild ? Slot : 'div'

    return (
        <Component onClick={() => setIsOpen(false)}
            data-visible={isOpen}
            role="dialog"
            className={clsx(styles.dialogBackdrop, className)}
        >
            {children}
        </Component >
    )
}

Dialog.Content = function DialogContent({ className, children, asChild }: DialogChildProps) {
    const Component = asChild ? Slot : 'div'

    return (
        <Component onClick={(e) => e.stopPropagation()} className={className}>
            {children}
        </Component>
    )
}


Dialog.Close = function DialogClose({ className, children, asChild }: DialogChildProps) {
    const { setIsOpen } = useDialogContext()
    const Component = asChild ? Slot : 'button'
    return (
        <Component onClick={() => setIsOpen(false)} className={className}>
            {children}
        </Component>
    )
}