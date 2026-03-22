import styles from '../inbox.module.css'
import { Check, MailCheck, X } from 'lucide-react'
import { api } from '@/api/axios'
import { FaPeopleGroup } from 'react-icons/fa6'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { normalizeError } from '@/utils/normalizeError'
import { NavbarContext } from '@/app/layouts/Navbar/useNavbarContext'
import { useContext, useEffect } from 'react'


type InboxRequest = {
  _id: string,
  group: {
    _id: string,
    title: string,
    members: string[]
  },
  requester: {
    _id: string,
    fullName: string
  },
  readBy: string[]
}



const SidebarInboxPreview = () => {


  const ctx = useContext(NavbarContext)


  const { data: requests, refetch: refetchInbox } = useSuspenseQuery({
    queryKey: ['inbox'],
    queryFn: () => api.get<{ requests: InboxRequest[] }>('/user/inbox'),
    select: (res) => res.data.requests
  })



  const acceptRequestMutation = useMutation({
    mutationFn: ({ groupId, requestId }: { groupId: string, requestId: string }) => api.post(`/groups/${groupId}/requests/${requestId}`),
    onSuccess: () => refetchInbox(),
    onError: (error) => {
      const err = normalizeError(error)
      if (err.status < 500) toast.error('An error occurred', {
        description: err.message
      })
      refetchInbox()
    }
  })
  const rejectRequestMutation = useMutation({
    mutationFn: ({ groupId, requestId }: { groupId: string, requestId: string }) => api.delete(`/groups/${groupId}/requests/${requestId}`),
    onSuccess: () => refetchInbox(),
    onError: (error) => {
      const err = normalizeError(error)
      if (err.status < 500) toast.error('An error occurred', {
        description: err.message
      })
      refetchInbox()
    }
  })

  useEffect(() => {
    if (ctx) ctx.setNotifications(prev => ({ ...prev, inbox: requests.length == 0 ? false : true }))
  }, [requests])






  return (
    requests.length == 0 ?
      <div className={styles.fallbackWrapper}>
        {/* ###LATER Replace this fallback */}
        <MailCheck size={48} />
        Incoming Join Requests will appear here
      </div> :
      <div className={styles.list}>
        {
          requests.map(request => {
            return (
              <div key={request._id} className={styles.listItem}>
                <div className={styles.avatarWrapper} >
                  <FaPeopleGroup />
                </div>
                <div className={styles.detailsWrapper}>
                  <p className={styles.groupName}>{request.group.title}</p>
                  <p className={styles.lastMessage}>{request.requester.fullName} </p>
                </div>
                <div className={styles.choicesWrapper}>
                  <button aria-label='Accept Request' onClick={() => {
                    acceptRequestMutation.mutate({ groupId: request.group._id, requestId: request._id })
                  }}>
                    <Check color='#2A903B' />
                  </button>
                  <button aria-label='Decline Request' onClick={() => {
                    rejectRequestMutation.mutate({ groupId: request.group._id, requestId: request._id })
                  }}>
                    <X color='#EE2D3E' />
                  </button>
                </div>
              </div>
            )
          })
        }

      </div>
  )
}

export default SidebarInboxPreview
