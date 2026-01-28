import { FaPeopleGroup } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import styles from '../chats.module.css'
import { RiPencilFill } from 'react-icons/ri'
import clsx from 'clsx'
import type { Group } from '../types'

type ChatHeaderProps = {
    group: Group | undefined,
    groupId: string | undefined,
}

const ChatHeader = ({ group, groupId }: ChatHeaderProps) => {
    return (
        <div className={styles.chatAreaHeader}>
            <Link to={`/moreinfo?q=${groupId}`} className={styles.avatarWrapper}>
                <FaPeopleGroup />
            </Link>
            <div className={styles.groupDetails}>
                <h3>
                    <Link to={`/moreinfo?q=${groupId}`}>{group?.title}</Link>
                </h3>
                <Link className={styles.members} to={`/moreinfo?q=${groupId}`}>
                    {group?.members?.map(member => {
                        return (
                            <div key={member._id}> {member.fullName}</div>
                        )
                    })}
                </Link>
            </div>
            <Link to={`/edit?q=${groupId}`} state={{ allowed: true }} aria-label='Edit Group' className={clsx(styles.groupOptions, styles.listItem)} >
                <RiPencilFill size={20} />
            </Link>
        </div>
    )
}

export default ChatHeader
