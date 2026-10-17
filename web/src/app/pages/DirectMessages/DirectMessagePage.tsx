import ChatBox from "@/features/chat/components/ChatBox"
import { useNavigate, useParams } from "react-router-dom"
import styles from './styles.module.css'
import DirectMessageChatHeader from "@/features/chat/components/DirectMessages/DirectMessageChatHeader"
import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { normalizeError } from "@/utils/normalizeError"

type Payload = {
  user: {
    email: string
  },
  chatRoom: {
    _id: string
  }
}

const DirectMessagePage = () => {
  const { userId } = useParams() as { userId: string }
  const navigate = useNavigate()

  const query = useQuery({
    queryKey: ['users', userId, 'chats'],
    queryFn: () => api.get<Payload>(`/users/${userId}/chats`),
    select: (res) => res.data,
    staleTime: Infinity
  })

  // ### LATER handle different errors differently
  const mutation = useMutation(({
    mutationKey: ['users', userId, 'chats'],
    mutationFn: (userId: string) => api.post<Payload>(`/users/${userId}/chats`),
    onError: () => navigate('/')
  }))



  if (query.error) {
    const err = normalizeError(query.error)
    if (err.code === "CHAT_NOT_FOUND") mutation.mutate(userId)
    else return navigate('/')
  }
  if (query.isPending || (query.error && mutation.isPending)) return

  const finalData = !query.error ? query.data : mutation.isSuccess && mutation.data.data
  if (!finalData) return navigate('/')




  return (
    <div className={styles.chatBoxWrapper}>
      <DirectMessageChatHeader user={finalData.user} />
      <ChatBox roomId={finalData.chatRoom._id} />
    </div>
  )
}

export default DirectMessagePage
