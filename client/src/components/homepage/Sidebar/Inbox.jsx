import styles from './sidebar.module.css'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { useEffect } from 'react'
import { callAuthApi } from '../../../api/axios'
import { useAuth } from '../../../hooks/useAuth'
import { FaPeopleGroup } from 'react-icons/fa6'


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

  const acceptIncomingRequest = async (groupId, requestId) => {
    const { status, data } = await callAuthApi('post', `/group/${groupId}/requests/${requestId}`)
    if (status != 200) console.error(data.message)
    setChanged(prev => !prev)
  }
  const rejectIncomingRequest = async (groupId, requestId) => {
    const { status, data } = await callAuthApi('delete', `/group/${groupId}/requests/${requestId}`)
    if (status != 204) console.error(data.message)
    setChanged(prev => !prev)
  }


  return (
    <div className={styles.list}>
      {
        groups.map(group => {
          return (
            <Link to={`/moreinfo?q=${group._id}`} key={group._id} className={styles.listItem}>
              <div className={styles.avatarWrapper} >
                <FaPeopleGroup />
              </div>
              <div className={styles.detailsWrapper}>
                <p className={styles.groupName}>{group.title}</p>
                <p className={styles.lastMessage}>{group.requestee.fullName} </p>
              </div>
              <div className={styles.choicesWrapper}>
                <button onClickCapture={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  acceptIncomingRequest(group._id, group.requestee._id)
                }}>
                  <Check color='#2A903B' />
                </button>
                <button onClickCapture={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  rejectIncomingRequest(group._id, group.requestee._id,)
                }}>
                  <X color='#EE2D3E' />
                </button>
              </div>
            </Link>
          )
        })


      }

    </div>
  )
}

export default Inbox
