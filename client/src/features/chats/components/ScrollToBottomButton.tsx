import { type RefObject } from 'react'
import styles from '../chats.module.css'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

type ScrollToBottomButtonProps = {
    lastMessageRef: RefObject<HTMLElement | null>,
    unreadCount: number,
    isAtBottom: boolean
}

const ScrollToBottomButton = ({ lastMessageRef, unreadCount, isAtBottom }: ScrollToBottomButtonProps) => {

    const scrollToBottom = () => {
        const div = lastMessageRef.current
        if (div) div.scrollIntoView({ behavior: 'smooth' })
    }


    return (
        <button aria-label='Scroll To Bottom' onClick={scrollToBottom} className={clsx(styles.scrollBtn, !isAtBottom && styles.showScrollBtn)}>
            {unreadCount > 0 && <div className={styles.unreadCounter}>{unreadCount}</div>}
            <ChevronDown size={26} strokeWidth={1.4} />
        </button>
    )
}

export default ScrollToBottomButton
