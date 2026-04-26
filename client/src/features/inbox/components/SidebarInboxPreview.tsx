import styles from '../inbox.module.css'
import { MailCheck } from 'lucide-react'
import { api } from '@/api/axios'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { normalizeError } from '@/utils/normalizeError'
import { useEffect } from 'react'
import { useMainLayoutContext } from '@/app/layouts/MainLayout/useMainLayout'
import FallbackWrapper from '@/components/Loaders/FallbackWrapper'
import { getImgURL } from '@/lib/cloudinary'
import clsx from 'clsx'
import Avatar from '@/components/ui/Avatar'

type InboxRequest = {
  _id: string,
  group: {
    _id: string,
    title: string,
    members: string[]
  },
  requester: {
    _id: string,
    fullName: string,
    avatar: {
      publicId: string,
      version: number
    }
  },
  readBy: string[],
  createdAt: string
}



const SidebarInboxPreview = () => {
  const { setNotifications } = useMainLayoutContext()


  const { data: requests, refetch: refetchInbox } = useSuspenseQuery({
    queryKey: ['inbox'],
    queryFn: () => api.get<{ requests: InboxRequest[] }>('/user/inbox'),
    select: (res) => res.data.requests
  })



  const acceptRequestMutation = useMutation({
    mutationFn: ({ groupId, requestId }: { groupId: string, requestId: string }) => api.post(`/groups/${groupId}/requests/${requestId}`),
    onError: (error) => {
      const err = normalizeError(error)
      if (err.status < 500) toast.error(err.message)
    },
    onSettled: () => refetchInbox()
  })
  const rejectRequestMutation = useMutation({
    mutationFn: ({ groupId, requestId }: { groupId: string, requestId: string }) => api.delete(`/groups/${groupId}/requests/${requestId}`),
    onError: (error) => {
      const err = normalizeError(error)
      if (err.status < 500) toast.error(err.message)
    },
    onSettled: () => refetchInbox()
  })

  useEffect(() => {
    setNotifications(prev => ({ ...prev, Inbox: requests.length == 0 ? false : true }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests])






  return (
    requests.length == 0 ?
      <FallbackWrapper className={styles.fallbackWrapper}>
        {/* ###LATER Replace this fallback */}
        <MailCheck size={48} />
        Incoming Join Requests will appear here
      </FallbackWrapper> :
      <div className={styles.list}>
        {
          requests.map(request => {
            return (
              <div key={request._id} className={styles.listItem}>
                <Avatar avatar={request.requester.avatar} imgSize={400} alt='requester-avatar' title={request.requester.fullName} className={styles.avatarWrapper} />
                <div className={styles.detailsWrapper}>
                  <p className={styles.groupName}>{request.requester.fullName}</p>
                  <p className={styles.lastMessage}>{request.group.title} </p>
                </div>

              </div>
            )
          })
        }

      </div>
  )
}

export default SidebarInboxPreview




{/* <div className={styles.choicesWrapper}>
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
                </div> */}