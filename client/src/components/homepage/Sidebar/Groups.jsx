import { useEffect, useState } from 'react'
import styles from './sidebar.module.css'
import { Link } from 'react-router-dom'
import { callAuthApi } from '../../../api/axios'
import { useAuth } from '../../../hooks/useAuth'
import { FaPeopleGroup } from "react-icons/fa6";


const Groups = () => {
  const { user } = useAuth()

  const [groups, setGroups] = useState([])
  useEffect(() => {
    if (!user) return

    (async () => {
      const { status, data } = await callAuthApi('get', '/user/groups')
      if (status == 200) setGroups(data.data.groups)
      else console.error(data.message)
    })()


  }, [])

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
