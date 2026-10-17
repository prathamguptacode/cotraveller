import ChatBox from "@/features/chat/components/ChatBox"
import { useParams } from "react-router-dom"


const DirectMessagePage = () => {
  const { roomId } = useParams() as { roomId: string }
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{height:74,borderBottom:'1px solid hsl(0 0% 15%)'}}></div>
      <ChatBox roomId={roomId} />
    </div>
  )
}

export default DirectMessagePage
