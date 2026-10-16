import { api } from "@/lib/axios"
import { useSuspenseQuery } from "@tanstack/react-query"

type Chat = {
  _id: string, //roomId
  receiver: {
    email: string
  },
  lastMessage?: {
    text: string
  }

}

const DirectMessagesList = () => {
  const { data: chats } = useSuspenseQuery({
    queryKey: ['users', 'me', 'dms'],
    queryFn: () => api.get<{ chats: Chat[] }>('/users/me/dms'),
    select: (res) => res.data.chats
  })


  return (
    <div style={{border:'1px solid rebeccapurple'}}>
      {
        chats.map(chat => {
          return (
            <div key={chat._id}>
              <div>Receiver: {chat.receiver.email}</div>
              <div> {chat.lastMessage?.text}</div>
            </div>
          )
        })
      }
    </div>
  )
}

export default DirectMessagesList
