import styles from './sidebar.module.css'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { useEffect } from 'react'
import { callAuthApi } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { FaPeopleGroup } from 'react-icons/fa6'
import type { Group } from '@/types/group.types'


type OutboxProps = {
    setIsHidden: Dispatch<SetStateAction<boolean>>
}

type OutboxGroup = Group & {
    memberNumber: number
}

const Outbox = ({ setIsHidden }: OutboxProps) => {
    const { user } = useAuth()
    const [groups, setGroups] = useState<OutboxGroup[]>([])
    const [changed, setChanged] = useState(false)

    useEffect(() => {
        if (!user) return
        (async () => {
            const { data } = await callAuthApi<{ groups: OutboxGroup[] }>('get', '/user/outbox')
            if (!data.success) return console.error(data.message)
            setGroups(data.data.groups)
        })()

    }, [changed])

    const deleteOutgoingRequest = async (requestId: string) => {
        const { status, data } = await callAuthApi('delete', `/user/requests/${requestId}`)
        if (status === 204) setChanged(prev => !prev)
        else console.error(data.message)
    }

    return (
        <div className={styles.list}>
            {
                groups.map(group => {
                    return (<Link onClick={() => setIsHidden(true)} to={`/moreinfo?q=${group._id}`} key={group._id} className={styles.listItem}>
                        <div className={styles.avatarWrapper} >
                            <FaPeopleGroup />
                        </div>
                        <div className={styles.detailsWrapper}>
                            <p className={styles.groupName}>{group.title}</p>
                            <p className={styles.lastMessage}>Members: {group.memberNumber} </p>
                        </div>
                        <div className={styles.choicesWrapper}>
                            <button aria-label='Cancel Request' onClickCapture={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                deleteOutgoingRequest(group._id)
                            }}> <X color='#EE2D3E' /></button>
                        </div>
                    </Link>)
                })
            }


        </div>
    )
}

export default Outbox
