import styles from './inbox.module.css'
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
import clsx from 'clsx'

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
              <RequestCard refetchInbox={refetchInbox} request={request} key={request._id} />
            )
          })
        }

      </div>
  )
}

export default SidebarInboxPreview


type RequestCardProps = {
  request: InboxRequest,
  refetchInbox: () => void
}


const RequestCard = ({ request, refetchInbox }: RequestCardProps) => {
  const { requester, group } = request


  const { mutate: acceptRequest, isPending: isAccepting } = useMutation({
    mutationFn: ({ groupId, requestId }: { groupId: string, requestId: string }) => api.post(`/groups/${groupId}/requests/${requestId}`),
    onError: (error) => {
      const err = normalizeError(error)
      if (err.status < 500) toast.error(err.message)
    },
    onSuccess: () => toast.success("Request accepted"),
    onSettled: () => refetchInbox()
  })
  const { mutate: rejectRequest, isPending: isRejecting } = useMutation({
    mutationFn: ({ groupId, requestId }: { groupId: string, requestId: string }) => api.delete(`/groups/${groupId}/requests/${requestId}`),
    onError: (error) => {
      const err = normalizeError(error)
      if (err.status < 500) toast.error(err.message)
    },
    onSuccess: () => toast.success("Request declined"),
    onSettled: () => refetchInbox()
  })

  const isPending = isAccepting || isRejecting

  return (
    <div className={styles.card}>
      <Link to={`/travellers/${requester._id}`} className={styles.requesterDetails}>
        <Avatar avatar={requester.avatar} imgSize={400} alt='requester-avatar' title={requester.fullName} className={styles.avatarWrapper} />
        <span className={styles.requesterName}>{requester.fullName}</span>
      </Link>
      <div className={styles.cardHero}>
        <div aria-label='request-note-and-read-more-wrapper'>
          <ExpandableText text={'Hey, I would like to join your trip !'} className={styles.requestNote} inputId={`note-toggle-for-${request._id}`} />
        </div>
        <div className={styles.choicesWrapper}>
          <span>Accept join request?</span>
          <div className={styles.choices}>
            <button disabled={isPending} onClick={() => rejectRequest({ groupId: group._id, requestId: request._id })} aria-label='reject' className={clsx(styles.choice, styles.reject)}>Reject</button>
            <button disabled={isPending} onClick={() => acceptRequest({ groupId: group._id, requestId: request._id })} aria-label='accept' className={clsx(styles.choice, styles.accept)}>Accept</button>
          </div>
        </div>
        <div className={styles.heroFooter}>
          <Link to={`/groups/${group._id}`} className={styles.groupName}>{group.title}</Link>
          <span className={styles.requestAge}>{moment.duration(new Date().getTime() - new Date(request.createdAt).getTime()).humanize()} ago</span>
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