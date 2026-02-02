import styles from './tabs.module.css'
import { Link } from 'react-router-dom'
import { api } from '@/api/axios'
import { FaPeopleGroup } from "react-icons/fa6";
import type { Group } from '@/types/group.types'
import { useSuspenseQuery } from '@tanstack/react-query'


const Groups = () => {
  
  const query = useSuspenseQuery({
    queryKey: ['groups'],
    queryFn: () => api.get<{ groups: Group[] }>('/user/groups'),
  })

  const { groups } = query.data.data
  return (
    <div className={styles.list}>
      {
        groups.map(group => {
          return (
            <Link to={`/groups/${group._id}/chats`} key={group._id} className={styles.listItem}>
              <div className={styles.avatarWrapper} >
                <FaPeopleGroup />
              </div>
              <div className={styles.detailsWrapper}>
                <p className={styles.groupName}>{group.title}</p>
                {group.lastMessage && <p className={styles.lastMessage}>{group.lastMessage.author} : {group.lastMessage.text}</p>}
              </div>
            </Link>
          )
        })
      }

    </div>

  )
}

export default Groups
