import mystyle from '../groupInfo.module.css'
import { FaUser } from 'react-icons/fa6'
import MembersDisplay from './MembersDisplay'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { Group } from '../types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { normalizeError } from '@/utils/normalizeError'
import { useState } from 'react'
import { api } from '@/api/axios'
import { getFormattedTime } from '../utils/getFormattedTime'


type GroupInfoHeroProps = {
  group: Group,
}


const GroupInfoHero = ({ group }: GroupInfoHeroProps) => {
  const { user } = useAuth()
  const [hasRequested, setHasRequested] = useState(group.requests?.includes(user?._id ?? ''))
  const [time, setTime] = useState(getFormattedTime(group.travelDate))


  const { mutate: sendRequest } = useMutation({
    mutationFn: () => {
      //Optimistic update
      setHasRequested(true)
      return api.post('/groups/:groupId/requests')
    },
    onSuccess: () => {
      toast.success("Request Sent", {
        description: `Your request was sent to ${group.title}`
      })
    },
    onError: (error) => {
      const err = normalizeError(error)
      toast.error("An error occurred", {
        description: err.message
      })
      //Reverting optimistic update
      setHasRequested(false)
    }
  })


  const copyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url)
    toast.success('Link copied to your clipboard')
  }

  return (
    <div className={mystyle.hero}>
      <div className={mystyle.profile}>
        <FaUser />
      </div>
      <div className={mystyle.infoWrapper}>
        <div className={mystyle.parent}>
          <div className={mystyle.can}>
            <h2 className={mystyle.title}>
              {group.title}
            </h2>
            <p className={mystyle.content}>{group.content}</p>
            <div className={mystyle.detail}>
              <p className={mystyle.time}>Date & Time: {time}</p>
              <p className={mystyle.transport}>Transport: {group.mode}</p>
              <p className={mystyle.college}>College: {group.intialLocation}</p>
            </div>
          </div>
          <MembersDisplay group={group} />
        </div>
        <div className={mystyle.btnbox}>
          <button aria-label='Share' className={mystyle.sharebtn} onClick={copyLink}>Share</button>
          {
            group.member.some(e => e._id === user?._id) ?
              <Link to={`/groups/${group._id}/chats`} className={mystyle.groupbtn}>Chat now</Link> :
              <button aria-label='Send Request' onClick={() => sendRequest()} className={clsx(mystyle.groupbtn, hasRequested && mystyle.requested)}>
                {hasRequested ? 'Request Sent' : 'Send Request'}
              </button>
          }

        </div>
      </div>
    </div>
  )
}

export default GroupInfoHero
