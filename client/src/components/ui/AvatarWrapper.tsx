import clsx from 'clsx'
import styles from './ui.module.css'
import type { ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'

type AvatarWrapperProps = {
    avatarURL: string | null,
    className?: string,
    children: ReactNode,
    asChild?: true
}

const AvatarWrapper = ({ avatarURL, className, children, asChild, ...props }: AvatarWrapperProps) => {
    const Component = asChild ? Slot : "div"

    return (
        <Component {...props} className={clsx(styles.avatarWrapper, !avatarURL && styles.emptyAvatar, className)}>
            {children}
        </Component>
    )
}

export default AvatarWrapper
