import { PaperPlaneTiltIcon } from '@phosphor-icons/react'
import styles from '../chat.module.css'
import { useChatRoom } from '../hooks/useChatRoom'

type MessageComposerProps = {
    roomId: string
}

const MessageComposer = ({ roomId }: MessageComposerProps) => {
    const { composeMessage, text, setText } = useChatRoom(roomId)


    return (
        <div className={styles.inputAreaWrapper}>
            <div className={styles.inputWrapper}>
                <input onKeyDown={(e) => {
                    if (e.key !== "Enter" || !text) return
                    composeMessage()
                }} onChange={(e) => setText(e.target.value)} value={text} type="text" />
                <button aria-label='Send Message' onClick={composeMessage} className={styles.sendBtn}>
                    <PaperPlaneTiltIcon weight='bold' size={20} />
                </button>
            </div>
        </div>
    )
}

export default MessageComposer
