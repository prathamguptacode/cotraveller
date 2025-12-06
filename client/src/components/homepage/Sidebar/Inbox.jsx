import styles from './sidebar.module.css'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { useEffect } from 'react'
import { callAuthApi } from '../../../api/axios'
import { useAuth } from '../../../hooks/useAuth'

const Inbox = () => {
  const { user } = useAuth()

  const [groups, setGroups] = useState([])
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    if (!user) return
    (async () => {
      const { status, data } = await callAuthApi('get', '/user/inbox')
      if (status === 200) setGroups(data.data.groups)
      else console.error(data.message)
    })()

  }, [changed])

  const acceptIncomingRequest = async (dbrequestId) => {
    const { status, data } = await callAuthApi('delete', `/user/dbrequests/${dbrequestId}`)
    if (status === 200) setChanged(prev => !prev)
    else console.error(data.message)
  }
  const deleteIncomingRequest = async (dbrequestId) => {
    const { status, data } = await callAuthApi('post', `/user/dbrequests/${dbrequestId}`)
    if (status === 204) setChanged(prev => !prev)
    else console.error(data.message)
  }


  return (
    <div className={styles.list}>
      {
        groups.map(group => {
          return (
            <Link key={group._id} className={styles.listItem}>
              <div className={styles.avatarWrapper} >
                <img src="apple-light.svg" alt="avatar" />
              </div>
              <div className={styles.detailsWrapper}>
                <p className={styles.groupName}>{group.title}</p>
                <p className={styles.lastMessage}>Members: {group.memberNumber} </p>
              </div>
              <div className={styles.choicesWrapper}>
                <button onClick={(e) => {
                  e.stopPropagation()
                  acceptIncomingRequest(group._id)
                }}> <Check color='#2A903B' /></button>
                <button onClick={(e) => {
                  e.stopPropagation()
                  deleteIncomingRequest(group._id)
                }}> <X color='#EE2D3E' /></button>
              </div>
            </Link>
          )
        })
      }


    </div>
  )
}

export default Inbox
