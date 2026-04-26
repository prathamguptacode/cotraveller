import styles from '../inbox.module.css'
import { MailCheck } from 'lucide-react'
import { api } from '@/api/axios'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { normalizeError } from '@/utils/normalizeError'
import { useEffect } from 'react'
import { useMainLayoutContext } from '@/app/layouts/MainLayout/useMainLayout'
import FallbackWrapper from '@/components/Loaders/FallbackWrapper'
import Avatar from '@/components/ui/Avatar'
import { Link } from 'react-router-dom'
import moment from 'moment-timezone'
import ExpandableText from '@/components/ui/ExpandableText'

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
        <MailCheck size={48} />
        Incoming Join Requests will appear here
      </FallbackWrapper> :
      <div className={styles.cards}>
        {
          requests.map(request => {
            return (
              <RequestCard request={request} key={request._id} />
            )
          })
        }

      </div>
  )
}

export default SidebarInboxPreview


type RequestCardProps = {
  request: InboxRequest
}


const RequestCard = ({ request }: RequestCardProps) => {
  const { requester, group } = request

  return (
    <div className={styles.card}>
      <Link to={`/travellers/${requester._id}`} className={styles.requesterDetails}>
        <Avatar avatar={requester.avatar} imgSize={400} alt='requester-avatar' title={requester.fullName} className={styles.avatarWrapper} />
        <span className={styles.requesterName}>{requester.fullName}</span>
      </Link>
      <div className={styles.cardHero}>
        <div>
          <ExpandableText text={'Hey, I would like to join your trip !  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque vitae delectus quia natus consequuntur cumque labore repudiandae facilis dignissimos impedit? sadasd'} className={styles.requestNote} inputId={`note-toggle-for-${request._id}`} />
        </div>
        <div className={styles.heroFooter}>
          <span className={styles.groupName}>{group.title}</span>
          <span className={styles.requestAge}>{moment.duration(new Date().getTime() - new Date(request.createdAt).getTime()).humanize()}</span>
        </div>
      </div>


    </div>
  )
}












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