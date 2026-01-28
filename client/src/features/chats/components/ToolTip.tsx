import clsx from "clsx"
import styles from '@/features/chats/chats.module.css'

type ToolTipProps = {
    text: string,
    className?: string
}

export const ToolTip = ({ text, className = '' }: ToolTipProps) => {
    return (
        <span className={clsx(styles.listItemTooltip, styles[className])}>
            {text}
        </span>
    )
}