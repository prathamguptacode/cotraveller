import { api } from "@/lib/axios"
import { useSuspenseQuery } from "@tanstack/react-query"
import styles from './styles.module.css'
import leon from '@/assets/leon.jpeg'
import { NavLink } from "react-router-dom"
import clsx from "clsx"

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
              <NavLink to={`/direct/${chat._id}`} key={chat._id} className={({ isActive }) => {
                return clsx(styles.listItem, isActive && styles.activeItem)
              }}>
                <div className={styles.imageWrapper}>
                  <img src={leon} alt="display-picture" />
                </div>
                <div className={styles.itemContentWrapper}>
                  <div className={styles.itemContent}>
                    <span className={styles.title}>
                      Leon S. Kennedy
                    </span>
                    <span className={styles.description}>
                      Roost, I have secured baby eagle. How is it going over there ?
                    </span>
                  </div>
                  <div className={styles.extraItemContent}>
                    <span>
                      11:40 AM
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
