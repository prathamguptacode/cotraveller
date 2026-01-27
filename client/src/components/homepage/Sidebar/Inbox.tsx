import styles from './sidebar.module.css'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { useEffect } from 'react'
import { callAuthApi } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { FaPeopleGroup } from 'react-icons/fa6'
import type { Group } from '@/types/group.types'

type InboxProps = {
  setIsHidden: Dispatch<SetStateAction<boolean>>
}
type InboxGroup = Group & {
  requestee: {
    fullName: string,
    _id: string
  }
}

const Inbox = ({ setIsHidden }: InboxProps) => {
  const { user } = useAuth()



  const [groups, setGroups] = useState<InboxGroup[]>([])
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    if (!user) return
    (async () => {
      const { data } = await callAuthApi<{ groups: InboxGroup[] }>('get', '/user/inbox')
      if (!data.success) return console.error(data.message)
      setGroups(data.data.groups)
    })()

  }, [changed])

  const acceptIncomingRequest = async (groupId: string, requestId: string) => {
    const { status, data } = await callAuthApi('post', `/group/${groupId}/requests/${requestId}`)
    if (status != 200) console.error(data.message)
    setChanged(prev => !prev)
  }
  const rejectIncomingRequest = async (groupId: string, requestId: string) => {
    const { status, data } = await callAuthApi('delete', `/group/${groupId}/requests/${requestId}`)
    if (status != 204) console.error(data.message)
    setChanged(prev => !prev)
  }


  return (
    <div className={styles.list}>
      {
        groups.map(group => {
          return (
            <Link onClick={() => setIsHidden(true)} to={`/moreinfo?q=${group._id}`} key={group._id} className={styles.listItem}>
              <div className={styles.avatarWrapper} >
                <FaPeopleGroup />
              </div>
              <div className={styles.detailsWrapper}>
                <p className={styles.groupName}>{group.title}</p>
                <p className={styles.lastMessage}>{group.requestee.fullName} </p>
              </div>
              <div className={styles.choicesWrapper}>
                <button aria-label='Accept Request' onClickCapture={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  acceptIncomingRequest(group._id, group.requestee._id)
                }}>
                  <Check color='#2A903B' />
                </button>
                <button aria-label='Decline Request' onClickCapture={(e) => {
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
