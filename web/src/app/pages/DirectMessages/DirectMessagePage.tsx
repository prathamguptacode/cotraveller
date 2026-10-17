import ChatBox from "@/features/chat/components/ChatBox"
import { useParams } from "react-router-dom"
import styles from './styles.module.css'
import DirectMessageChatHeader from "@/features/chat/components/DirectMessages/DirectMessageChatHeader"


const DirectMessagePage = () => {
  const { roomId } = useParams() as { roomId: string }
  
  return (
    <div className={styles.chatBoxWrapper}>
      <DirectMessageChatHeader />
      <ChatBox roomId={roomId} />
    </div>
  )
}

export default DirectMessagePage
