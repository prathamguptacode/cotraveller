import { Link, useParams } from 'react-router-dom'
import styles from '../chats.module.css'
import type { Group } from '../types'
import { ToolTip } from '@/components/Accessibility/ToolTip'
import { DoorOpen, MoreVertical, Pencil, Share2, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import ShareMenuPopover from '@/components/Popovers/ShareMenuPopover'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/api/axios'
import { normalizeError } from '@/utils/normalizeError'

type ChatHeaderProps = {
    group: Group,
}



const ChatHeader = ({ group }: ChatHeaderProps) => {
    const { user } = useAuth()
    const { groupId } = useParams() as { groupId: string }

    const { mutate: leaveGroup, isPending: isLeaving } = useMutation({
        mutationFn: () => api.delete(`/groups/${groupId}/members/me`),
        onError: (error) => normalizeError(error),
        onSuccess: () => window.location.href = '/'
    })

    return (
        <div className={styles.chatAreaHeader}>
            <Link to={`/groups/${groupId}`} className={styles.avatarWrapper}>
                <Users size={20} />
            </Link>
            <div className={styles.groupDetails}>
                <h3>
                    <Link to={`/groups/${groupId}`}>{group?.title}</Link>
                </h3>
                <Link className={styles.members} to={`/groups/${groupId}`}>
                    {group?.member?.map(member => {
                        return (
                            <div key={member._id}> {member.fullName}</div>
                        )
                    })}
                </Link>
            </div>

            <button popoverTarget='moreOptionsPopover' className={styles.moreOptions} aria-label='more options'>
                <MoreVertical size={20} />
                <ToolTip position='left' text='More Options' />
            </button>
            <div id='moreOptionsPopover' className={styles.moreOptionsPopover} popover='auto'>
                <div className={styles.moreOptionsList}>

                    <Link to={`/groups/${groupId}`} className={styles.moreOptionsListItem}>
                        <div className={styles.avatarWrapper} >
                            <Users />
                        </div>
                        <div>
                            <h3>View Profile</h3>
                            <span>{group.title}</span>
                        </div>

                    </Link>

                    {user?._id == group.owner && < Link className={styles.moreOptionsListItem} to={`/groups/${groupId}/edit`} state={{ allowed: true }}>
                        <div>
                            <Pencil />
                        </div>

                        <div>
                            <h3>Edit Group Info</h3>
                        </div>
                    </Link>}

                    <button popoverTarget='shareMenu' className={styles.moreOptionsListItem}>
                        <div>
                            <Share2 />
                        </div>

                        <div>
                            <h3>Share Invite Link</h3>
                        </div>
                    </button>
                    <ShareMenuPopover shareURL={document.location.origin + `/groups/${groupId}`} title={group.title} />

                    <button onClick={() => leaveGroup()} disabled={isLeaving} className={styles.moreOptionsListItem}>
                        <div>
                            <DoorOpen />
                        </div>

                        <div>
                            <h3>Exit Group</h3>
                        </div>
                    </button>

                </div>
            </div>
        </div >
    )
}

export default ChatHeader
