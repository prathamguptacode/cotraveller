import styles from './tabs.module.css'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { api } from '@/api/axios'
import { FaPeopleGroup } from 'react-icons/fa6'
import type { Group } from '@/types/group.types'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'


type OutboxGroup = Group & {
    memberNumber: number
}

const Outbox = () => {


    const outboxQuery = useSuspenseQuery({
        queryKey: ['outbox'],
        queryFn: () => api.get<{ groups: OutboxGroup[] }>('/user/outbox')
    })

    const cancelOutgoingRequestMutation = useMutation({
        mutationFn: (requestId: string) => api.delete(`/user/requests/${requestId}`),
        onSuccess: () => outboxQuery.refetch()
    })


    const { groups } = outboxQuery.data.data


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
                                <p className={styles.lastMessage}>Members: {group.memberNumber} </p>
                            </div>
                            <div className={styles.choicesWrapper}>
                                <button aria-label='Cancel Request' onClick={() => {
                                    cancelOutgoingRequestMutation.mutate(group._id)
                                }}> <X color='#EE2D3E' /></button>
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default Outbox
