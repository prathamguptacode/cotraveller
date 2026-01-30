import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import styles from './tabs.module.css'
import { Link } from 'react-router-dom'
import { callAuthApi } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { FaPeopleGroup } from "react-icons/fa6";
import type { Group } from '@/types/group.types'

type GroupsProps = {
  setIsHidden: Dispatch<SetStateAction<boolean>>,
}

const Groups = ({ setIsHidden }: GroupsProps) => {
  const { user } = useAuth()

  const [groups, setGroups] = useState<Group[]>([])


  useEffect(() => {
    if (!user) return

    (async () => {
      const { data } = await callAuthApi<{ groups: Group[] }>('get', '/user/groups')
      if (!data.success) return console.error(data.message)
      setGroups(data.data.groups)
    })()


  }, [])

  return (
    <div className={styles.list}>
      {
        groups.map(group => {
          return (
            <Link onClick={() => setIsHidden(true)} to={`/groups/${group._id}/chats`} key={group._id} className={styles.listItem}>
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
