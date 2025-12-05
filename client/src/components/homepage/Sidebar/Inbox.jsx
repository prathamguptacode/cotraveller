import styles from './sidebar.module.css'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { useEffect } from 'react'
import { callAuthApi } from '../../../api/axios'

const Inbox = () => {

  const [groups, setGroups] = useState([])
  useEffect(() => {

    (async (params) => {
      const { status, data } = await callAuthApi('get', '/user/inbox')
      if (status === 200) setGroups(data.data.groups)
      else console.error(data.message)
    })()

  }, [])

  return (
    <div className={styles.list}>
      {
        groups.map(group => {
          return (
            <Link className={styles.listItem}>
              <div className={styles.avatarWrapper} >
                <img src="apple-light.svg" alt="avatar" />
              </div>
              <div className={styles.detailsWrapper}>
                <p className={styles.groupName}>{group.title}</p>
                <p className={styles.lastMessage}>Members: {group.memberNumber} </p>
              </div>
              <div className={styles.choicesWrapper}>
                <button> <Check color='#2A903B' /></button>
                <button> <X color='#EE2D3E' /></button>
              </div>
            </Link>
          )
        })
      }


    </div>
  )
}

export default Inbox
