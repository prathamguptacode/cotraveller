import { api } from "@/lib/axios"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import styles from './styles.module.css'
import leon from '@/assets/leon.jpeg'
import { NavLink } from "react-router-dom"
import clsx from "clsx"
import { useSocket } from "@/hooks/useSocket"
import { useEffect } from "react"

type Chat = {
  _id: string, //roomId
  receiver: {
    _id: string,
    email: string
  },
  lastMessage?: {
    text: string,
    author: {
      _id: string,
      email: string,
    },
    createdAt: string
  }
  lastReadAt: string
}

const DirectMessagesList = () => {
  const { data: chats } = useSuspenseQuery({
    queryKey: ['users', 'me', 'dms'],
    queryFn: () => api.get<{ chats: Chat[] }>('/users/me/dms'),
    select: (res) => res.data.chats
  })

  const socket = useSocket()
  const queryClient = useQueryClient()


  useEffect(() => {
    const updateList = () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'dms'], exact: true })
    }

    socket.on('dms-list:update', updateList)

    return () => {
      socket.off('dms-list:update', updateList)
    }
  }, [socket, queryClient])



  return (
    <section className={styles.wrapper}>
      <header className={styles.listHeader}>
        <h2 className={styles.listHeading}>
          Direct Messages
        </h2>
      </header>
      <div className={styles.list}>
        {
          chats.map(chat => {
            const isUnread = chat.lastMessage && new Date(chat.lastMessage.createdAt).getTime() >= new Date(chat.lastReadAt).getTime()

            return (
              <NavLink to={`/direct/${chat.receiver._id}`} key={chat._id} className={({ isActive }) => {
                return clsx(styles.listItem, isActive && styles.activeItem)
              }}>
                <div className={styles.imageWrapper}>
                  <img src={leon} alt="display-picture" />
                </div>
                <div className={styles.itemContentWrapper}>
                  <div className={styles.itemContent}>
                    <span className={styles.title}>
                      {chat.receiver.email}
                    </span>
                    {chat.lastMessage &&
                      <span className={styles.description}>
                        {chat.lastMessage.text}
                      </span>}
                  </div>
                  <div className={styles.extraItemContent}>
                    {chat.lastMessage &&
                      <span>
                        {new Date(chat.lastMessage.createdAt).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                    }
                    {isUnread && <span className={styles.unreadIndicator}>
                    </span>}
                  </div>
                </div>
              </NavLink>
            )
          })
        }
      </div>
    </section>
  )
}

export default DirectMessagesList
