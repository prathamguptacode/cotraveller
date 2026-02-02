import styles from './tabs.module.css'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { api, callAuthApi } from '@/api/axios'
import { FaPeopleGroup } from 'react-icons/fa6'
import type { Group } from '@/types/group.types'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'


type InboxGroup = Group & {
  requestee: {
    fullName: string,
    _id: string
  }
}

const Inbox = () => {


  const inboxQuery = useSuspenseQuery({
    queryKey: ['inbox'],
    queryFn: () => api.get<{ groups: InboxGroup[] }>('/user/inbox')
  })
  const { groups } = inboxQuery.data.data


  const acceptRequestMutation = useMutation({
    mutationFn: ({ groupId, requestId }: { groupId: string, requestId: string }) => api.post(`/group/${groupId}/requests/${requestId}`),
    onSuccess: () => inboxQuery.refetch(),
    onError: () => {

    }
  })
  const rejectRequestMutation = useMutation({
    mutationFn: ({ groupId, requestId }: { groupId: string, requestId: string }) => api.delete(`/group/${groupId}/requests/${requestId}`),
    onSuccess: () => inboxQuery.refetch()
  })





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
                <button aria-label='Accept Request' onClick={() => {
                  acceptRequestMutation.mutate({ groupId: group._id, requestId: group.requestee._id })
                }}>
                  <Check color='#2A903B' />
                </button>
                <button aria-label='Decline Request' onClick={() => {
                  rejectRequestMutation.mutate({ groupId: group._id, requestId: group.requestee._id })
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
