import { api } from "@/lib/axios"
import { useSuspenseQuery } from "@tanstack/react-query"
import styles from './styles.module.css'
import leon from '@/assets/leon.jpeg'
import { NavLink } from "react-router-dom"
import clsx from "clsx"

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
  },
  createdAt: string
}

const DirectMessagesList = () => {
  const { data: chats } = useSuspenseQuery({
    queryKey: ['users', 'me', 'dms'],
    queryFn: () => api.get<{ chats: Chat[] }>('/users/me/dms'),
    select: (res) => res.data.chats
  })


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
                    {chat.lastMessage ?
                      <span className={styles.description}>
                        {chat.lastMessage.text}
                      </span> :
                      <span data-type='placeholder' className={styles.description}>
                        .
                      </span>
                    }
                  </div>
                  <div className={styles.extraItemContent}>
                    <span>
                      {chat.lastMessage ?
                        getFormattedTimeString(chat.lastMessage.createdAt) :
                        getFormattedTimeString(chat.createdAt)
                      }
                    </span>
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


const getFormattedTimeString = (dateString: string) => {
  const date = new Date(dateString)
  const isToday = new Date().toLocaleDateString() === date.toLocaleDateString()
  const formatted = isToday ?
    date.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: true }) :
    date.toLocaleDateString('default', { dateStyle: 'short' })

  return formatted
}