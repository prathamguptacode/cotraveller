import { type RefObject } from 'react'
import scrollToBottom from '../utils/scrollToBottom'
import styles from '../chats.module.css'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

type ScrollToBottomButtonProps = {
    containerRef: RefObject<HTMLElement | null>,
    unreadCount: number,
    isIntersecting: boolean
}

const ScrollToBottomButton = ({ containerRef, unreadCount, isIntersecting }: ScrollToBottomButtonProps) => {
    return (
        <button aria-label='Scroll To Bottom' onClick={() => scrollToBottom(containerRef)} className={clsx(styles.scrollBtn, !isIntersecting && styles.showScrollBtn)}>
            {unreadCount > 0 && <div className={styles.unreadCounter}>{unreadCount}</div>}
            <ChevronDown size={26} strokeWidth={1.4} />
        </button>
    )
}

export default ScrollToBottomButton
