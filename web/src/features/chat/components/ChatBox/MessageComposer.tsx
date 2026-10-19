import { PaperPlaneTiltIcon } from '@phosphor-icons/react'
import { useChatRoom } from '@/features/chat/hooks/useChatRoom'
import styles from './styles.module.css'


type MessageComposerProps = {
    roomId: string
}

const MessageComposer = ({ roomId }: MessageComposerProps) => {
    const { composeMessage, text, setText } = useChatRoom(roomId)


    return (
        <div className={styles.inputAreaWrapper}>
            <div className={styles.inputArea}>
                <div className={styles.inputWrapper}>
                    <textarea name='message' className={styles.input} placeholder='Type your message...' onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) e.preventDefault()
                        if (e.key !== "Enter" || e.shiftKey || !text) return
                        composeMessage()
                    }} onChange={(e) => setText(e.target.value)} value={text} />
                </div>
                <button aria-hidden={!text && !window.matchMedia('(max-width:768px)').matches} aria-label='Send Message' onClick={composeMessage} className={styles.sendButton}>
                    <PaperPlaneTiltIcon weight='bold' size={20} />
                </button>
            </div>
        </div>
    )
}

export default MessageComposer
