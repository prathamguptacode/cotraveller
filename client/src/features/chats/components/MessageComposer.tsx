import { SendHorizontal } from 'lucide-react'
import styles from '../chats.module.css'
import type { Dispatch, SetStateAction } from 'react'

type MessageComposerProps = {
    text: string,
    setText: Dispatch<SetStateAction<string>>,
    sendMessage: () => void,
}

const MessageComposer = ({ text, sendMessage, setText }: MessageComposerProps) => {

    return (
        <div className={styles.inputAreaWrapper}>
            <div className={styles.inputWrapper}>
                <input onKeyDown={(e) => {
                    if (e.key !== "Enter" || !text) return
                    sendMessage()
                }} onChange={(e) => setText(e.target.value)} value={text} type="text" />
                <button aria-label='Send Message' onClick={sendMessage} className={styles.sendBtn}>
                    <SendHorizontal size={20} />
                </button>
            </div>
        </div>
    )
}

export default MessageComposer
